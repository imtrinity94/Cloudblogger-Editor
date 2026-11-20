#!/usr/bin/env node
/*
 * Runs the mock tests and the JavaScript feature matrix on the real engines
 * (desktop JVM, same jars the browser loads through CheerpJ).
 *
 *   node engine/test/run-tests.js            # assertions + matrix summary
 *   node engine/test/run-tests.js --matrix   # also writes docs/feature-matrix.md
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "../..");
const PUB = path.join(ROOT, "public");
const { buildRequest, referencedClasses } = require(path.join(PUB, "engine/request.js"));
const catalog = JSON.parse(fs.readFileSync(path.join(PUB, "catalog/catalog.json"), "utf8"));
const catalogPath = path.join(PUB, "catalog", catalog.dir, "stubs.txt");
const mocks = fs.readFileSync(path.join(PUB, "engine/vro-mocks.js"), "utf8");
const fixture = JSON.parse(fs.readFileSync(path.join(PUB, "engine/fixture.default.json"), "utf8"));
const profiles = JSON.parse(fs.readFileSync(path.join(PUB, "engine/profiles.json"), "utf8"));
const features = require("./features.js");

function runBatch(jobs) {
    const tmp = path.join(require("os").tmpdir(), "vro-batch-" + process.pid + ".jsonl");
    fs.writeFileSync(tmp, jobs.map(j => JSON.stringify({ engine: j.engine, request: JSON.parse(j.request) })).join("\n"));
    const dir = path.join(PUB, JSON.parse(fs.readFileSync(path.join(PUB, "engine/engines.json"), "utf8")).dir);
    const out = execFileSync("java", ["-cp", path.join(dir, "launcher.jar"), "vroconsole.Launcher",
        dir, "batch", tmp], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 26 });
    fs.unlinkSync(tmp);
    return out.trim().split("\n").map(l => JSON.parse(l));
}

function job(engine, code, extra) {
    const texts = [code].concat(((extra && extra.inputs) || []).map(i => i.value));
    const stubGlobals = referencedClasses(texts, catalog.classes, catalog.builtins);
    return {
        engine,
        request: buildRequest(Object.assign({ code, mocks, fixture, profile: profiles[engine], timeoutMs: 5000, catalogPath, stubGlobals }, extra || {}))
    };
}

// ---------------------------------------------------------------- mock tests

const all = ["8x", "9x", "91x"];
const both = all; // most behaviour is shared by every profile
const tests = [];
function test(name, engines, code, check, extra) {
    engines.forEach(e => tests.push({ name: `[${e}] ${name}`, job: job(e, code, extra), check }));
}
const ok = (v) => (r) => r.ok && r.result === v ? null : `expected result ${JSON.stringify(v)}, got ${JSON.stringify(r.error || r.result)}`;
const err = (re) => (r) => !r.ok && re.test(r.error.name + ": " + r.error.message) ? null : `expected error ${re}, got ${JSON.stringify(r.ok ? r.result : r.error)}`;

test("engine version 8.x", ["8x"], "return 1", r => /Rhino 1\.7 release 4 2012 06 18/.test(r.engineVersion) ? null : r.engineVersion);
test("engine version 9.x", ["9x"], "return 1", r => /Rhino 1\.7\.15 2024 05 03/.test(r.engineVersion) ? null : r.engineVersion);
test("engine version 9.1 matches the 9.1.1 server", ["91x"], "return 1", r => r.engineVersion === "Rhino 1.9.1" ? null : r.engineVersion);
test("System.log levels", both, "System.log('a'); System.warn('b'); System.error('c'); System.debug('d');",
    r => r.ok && r.logs.map(l => l.level).join() === "info,warning,error,debug" ? null : JSON.stringify(r.logs));
test("System.log of object prints [object Object]", both, "System.log({a:1})",
    r => r.logs[0] && r.logs[0].msg === "[object Object]" ? null : JSON.stringify(r.logs));
test("action return value", both, "return a + b;", ok("5"), { inputs: [{ name: "a", value: "2" }, { name: "b", value: "3" }] });
test("action line numbers match editor", both, "var x = 1;\nnull.foo;", r => !r.ok && r.error.line === 2 ? null : JSON.stringify(r.error));
test("scriptable task mode still rejects return (engine)", both, "var out = 5;\nreturn out;", err(/SyntaxError: invalid return/), { mode: "task" });
test("scriptable task outputs", both, "var out = n * 2;", r => r.ok && r.outputs.out === "42" ? null : JSON.stringify(r),
    { mode: "task", inputs: [{ name: "n", value: "21" }], outputs: ["out"] });
test("class shutter allows java.util", both, "var m = new java.util.HashMap(); m.put('k','v'); return m.get('k');", ok("v"));
test("class shutter blocks java.io", both, "return new java.io.File('/etc/passwd');", err(/is not a function|prohibited/));
test("class shutter blocks java.lang.System", both, "return java.lang.System.getProperty('user.home');", err(/./));
test("host internals hidden", both, "return typeof __vroHost + ',' + typeof __vroFixture;", ok("undefined,undefined"));
test("runaway loop times out", ["9x"], "while (true) {}", err(/Timeout/), { timeoutMs: 1000 });
test("for each (JS 1.7) works", both, "var s=0; for each (var v in [1,2,3]) s+=v; return s;", ok("6"));
test("E4X works", both, "var x = <vm><name>web-01</name></vm>; return x.name.toString();", ok("web-01"));
test("console on 9.0 only", ["9x"], "return typeof console;", ok("object"));
test("no console on 8.x and 9.1.1", ["8x", "91x"], "return typeof console;", ok("undefined"));
test("VcPlugin VMs", both, "return VcPlugin.getAllVirtualMachines().map(function(v){return v.name;}).join();",
    ok("web-01,web-02,db-01,test-win-01,app-01,tpl-ubuntu-24"));
test("VcPlugin xpath filter", both, "return VcPlugin.getAllVirtualMachines(null, \"xpath:name[matches(.,'web.*')]\").length;", ok("2"));
test("power on + wait task", both,
    "var vm = Server.findForType('VC:VirtualMachine', 'vcsa01.vmw.lab,vm-104');\n" +
    "var t = vm.powerOnVM_Task(null);\nSystem.getModule('com.vmware.library.vc.basic').vim3WaitTaskEnd(t, true, 2);\n" +
    "return vm.runtime.powerState.value;", ok("poweredOn"));
test("power on already-on VM fails in wait", both,
    "var vm = VcPlugin.getAllVirtualMachines()[0];\nSystem.getModule('com.vmware.library.vc.basic').vim3WaitTaskEnd(vm.powerOnVM_Task(), true, 2);",
    err(/current state \(Powered on\)/));
test("VM input expression", both, "return vm.name + ':' + vm.config.hardware.numCPU;", ok("db-01:8"),
    { inputs: [{ name: "vm", value: "VcPlugin.getAllVirtualMachines()[2]" }] });
test("reconfig", both, "var vm=VcPlugin.getAllVirtualMachines()[0]; var s=new VcVirtualMachineConfigSpec(); s.numCPUs=4; vm.reconfigVM_Task(s); return vm.config.hardware.numCPU;", ok("4"));
test("config element", both,
    "var cat = Server.getConfigurationElementCategoryWithPath('Web/Settings');\n" +
    "return cat.configurationElements[0].getAttributeWithKey('domain').value;", ok("vmw.lab"));
test("resource element JSON", both,
    "var re = Server.getResourceElementCategoryWithPath('Web/Templates').resourceElements[0];\n" +
    "return JSON.parse(re.getContentAsMimeAttachment().content).memoryMB;", ok("4096"));
test("REST canned route", both,
    "var h = RESTHostManager.getHost(RESTHostManager.getHosts()[0]);\n" +
    "var r = h.createRequest('POST', '/networks/1/next-ip', '{}').execute();\nreturn r.statusCode + ' ' + JSON.parse(r.contentAsString).ip;",
    ok("201 10.10.10.50"));
test("REST unknown route is 404", both, "var h=new RESTHost('x'); h.url='https://nowhere'; return h.createRequest('GET','/a',null).execute().statusCode;", ok("404"));
test("Properties", both, "var p = new Properties(); p.put('a', 1); p.put('b', 2); p.remove('a'); return p.keys().join() + p.get('b');", ok("b2"));
test("LockingSystem", both, "LockingSystem.lock('x','me'); return LockingSystem.lock('x','other');", ok("false"));
test("unknown module is clear", both, "System.getModule('com.acme').foo();", err(/Module 'com\.acme' not found/));
test("user mock action", both, "return System.getModule('com.example.utils').toUpperSnake('vmName');", ok("VM_NAME"));
test("unknown action in module", both, "System.getModule('com.vmware.library.vc.basic').nope();", err(/Cannot find function nope/));
test("System.getContext", both, "return System.getContext().getParameter('__asd_requestedBy');", ok("user@vmw.lab"));
test("VC array property: index write after assign is lost", both,
    "var spec = new VcVirtualMachineConfigSpec();\nspec.deviceChange = [];\nspec.deviceChange[0] = new VcVirtualDeviceConfigSpec();\nreturn String(spec.deviceChange[0]);",
    ok("undefined"));
test("VC array property: build locally then assign works", both,
    "var spec = new VcVirtualMachineConfigSpec();\nvar d = [];\nd[0] = new VcVirtualDeviceConfigSpec();\nspec.deviceChange = d;\nreturn String(spec.deviceChange[0]);",
    ok("VcVirtualDeviceConfigSpec"));
test("System.log(this) is not the Rhino global", both, "System.log(this); return String(this);", ok("[object Object]"));
test("XML output is typed for the serialization note", both, "var x = <a/>;", r => r.ok && r.outputTypes.x === "XML" ? null : JSON.stringify(r.outputTypes),
    { mode: "task", outputs: ["x"] });
test("System.getDateFromFormat (ISO with millis)", both,
    "var d = System.getDateFromFormat('2019-01-01T01:45:00.100', \"yyyy-MM-dd'T'HH:mm:ss.SSS\");\nreturn System.formatDate(d, \"yyyy-MM-dd HH:mm:ss.SSS\");",
    ok("2019-01-01 01:45:00.100"));
test("System.getDateFromFormat (MMM)", both,
    "var d = System.getDateFromFormat('20-Apr-2025 11:09:21', \"dd-MMM-yyyy' 'HH:mm:ss\");\nreturn System.formatDate(d, 'dd MMM yyyy HH:mm');",
    ok("20 Apr 2025 11:09"));
test("System.getDateFromFormat (literal Z)", both,
    "var d = System.getDateFromFormat('2023-05-08T16:58:34Z', \"yyyy-MM-dd'T'HH:mm:ss'Z'\");\nreturn d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours();",
    ok("2023-5-8 16"));
test("System.getDateFromFormat mismatch throws like the server", both, "System.getDateFromFormat('nope', 'yyyy-MM-dd');",
    err(/^InternalError: Unable to parse date \[nope\] using pattern : yyyy-MM-dd$/));
test("Properties return value is shown in full", both,
    "var p = new Properties(); p.put('cp', { network: 'pg-1' }); return p;",
    r => r.ok && /Properties \{\n  cp: \{\n    network: "pg-1"/.test(r.result) ? null : JSON.stringify(r.result));
test("thrown Error keeps name", both, "throw new TypeError('bad input');", err(/^TypeError: bad input$/));

// --- Core classes: expected values are the outputs of a real Orchestrator 9.1.1 (build 25643527).
const lab = (name, code, expected) => test(name, both, "return String(" + code + ");", ok(expected));
lab("formatBinaryValue 500", "System.formatBinaryValue(500)", "500");
lab("formatBinaryValue 2048", "System.formatBinaryValue(2048)", "2.0K");
lab("formatBinaryValue 1536", "System.formatBinaryValue(1536)", "1.5K");
lab("formatBinaryValue 4.5M", "System.formatBinaryValue(4718592)", "4.5M");
lab("formatBinaryValue 5G", "System.formatBinaryValue(5368709120)", "5.0G");
lab("formatDuration milli+zero", "System.formatDuration(93784005, true, true)", "1d 02h 03m 04.005s");
lab("formatDuration plain", "System.formatDuration(93784005, false, false)", "1d 02h 03m 04s");
lab("formatDuration showZero", "System.formatDuration(61000, false, true)", "0d 00h 01m 01s");
lab("formatDuration seconds only", "System.formatDuration(5000, false, false)", "05s");
lab("formatNumber grouping", "System.formatNumber(1234567.891, '#,##0.00')", "1,234,567.89");
lab("formatNumber percent", "System.formatNumber(0.5, '0%')", "50%");
lab("formatNumber zero pad", "System.formatNumber(42, '0000')", "0042");
lab("hexToDecimal", "System.hexToDecimal('1F')", "31");
lab("decimalToHex 4711", "System.decimalToHex(4711)", "1267");
lab("decimalToHex 255", "System.decimalToHex(255)", "FF");
lab("compareVersionNumber greater", "System.compareVersionNumber('1.2.10', '1.2.9')", "3");
lab("compareVersionNumber equal", "System.compareVersionNumber('1.0', '1.0')", "0");
lab("compareVersionNumber smaller", "System.compareVersionNumber('1.0.0', '2.0.0')", "-1");
lab("compareVersionNumber shorter", "System.compareVersionNumber('1.2', '1.2.1')", "-3");
lab("extractDirectory", "System.extractDirectory('/var/run/vco/a.txt')", "/var/run/vco/");
lab("extractDirectory Windows", "System.extractDirectory('C:\\\\temp\\\\a.txt')", "C:/temp/");
lab("extractFileName", "System.extractFileName('/var/run/vco/a.b.txt')", "a.b.txt");
lab("extractFileNameExtension", "System.extractFileNameExtension('/x/a.b.txt')", "txt");
lab("extractFileNameExtension none", "System.extractFileNameExtension('/x/noext')", "");
lab("extractFileNameWithoutExtension", "System.extractFileNameWithoutExtension('/x/a.b.txt')", "/x/a.b");
lab("appendToPath", "System.appendToPath('/tmp', 'sub/f.txt')", "/tmp/sub/f.txt");
lab("appendToPath trailing slash", "System.appendToPath('/tmp/', 'f.txt')", "/tmp/f.txt");
lab("getTempDirectory", "System.getTempDirectory()", "/usr/lib/vco/app-server/temp");
lab("getOsName", "System.getOsName()", "Linux");
lab("getObjectClassName Properties", "System.getObjectClassName(new Properties())", "Properties");
lab("getObjectClassName Array", "System.getObjectClassName([])", "Array");
lab("getObjectClassName Date", "System.getObjectClassName(new Date())", "Date");
lab("getObjectClassName String", "System.getObjectClassName('s')", "String");
lab("getObjectPluginName", "System.getObjectPluginName(new Properties())", "Server");
lab("getDate tomorrow", "System.getDate('tomorrow', new Date(0)).toISOString()", "1970-01-02T12:00:00.000Z");
lab("getDate in 2 hours", "System.getDate('in 2 hours', new Date(0)).toISOString()", "1970-01-01T02:00:00.000Z");
lab("formatDate patterns", "System.formatDate(new Date(2026, 0, 5, 9, 7, 3), 'yyyy-MM-dd HH:mm:ss EEE MMM')", "2026-01-05 09:07:03 Mon Jan");
lab("sleep returns true", "System.sleep(5)", "true");
lab("customEventUrl", "System.customEventUrl('myEvent', false).url", "http://0.0.0.0:8280/vmware-vmo-webcontrol/SendCustomEvent?EventName=myEvent");
lab("ByteBuffer from base64", "new ByteBuffer('aGVsbG8=').length", "5");
lab("MimeAttachment mime type", "(function(){ var m = new MimeAttachment('a.json'); return m.name + ' ' + m.mimeType + ' content=' + m.content; })()", "a.json application/json content=");
lab("URL validation", "(function(){ var u = new URL('http://x'); return [u.isValidHostname('web-01.vmw.lab'), u.isValidIPAddress('10.0.0.1'), u.isValidIPAddress('999.1.1.1'), u.isValidIPv6Address('::1'), u.escapeHost('::1'), u.unescapeHost('[::1]')].join(); })()", "true,true,false,true,[::1],::1");
lab("URL fields", "(function(){ var u = new URL('https://web-01.vmw.lab:8443/api/x?y=1'); return [u.host, u.port, u.url, u.requestType, u.contentType].join('|'); })()", "web-01.vmw.lab|8443|https://web-01.vmw.lab:8443/api/x?y=1|GET|application/x-www-form-urlencoded");
lab("URL addPath/addParameter", "(function(){ var u = new URL('https://h/api'); u.addPath('vms'); u.addParameter('name', 'a b'); return u.url; })()", "https://h/apivms?name=a+b");
lab("File attributes", "(function(){ var f = new File('/tmp/x/report.final.csv'); return [f.name, f.extension, f.path, f.directory, f.exists, f.isLocal, f.length].join('|'); })()", "report.final.csv|csv|/tmp/x/report.final.csv|/tmp/x/|false|true|0");
lab("File /tmp is a directory", "(function(){ var f = new File('/tmp'); return f.exists + ' isDir=' + f.isDir + ' name=' + f.name + ' dir=' + f.directory; })()", "true isDir=true name=tmp dir=/");
lab("File.write replaces content", "(function(){ var p = System.appendToPath(System.getTempDirectory(), 'p.txt'); var f = new File(p); f.write('a'); f.write('b'); var r = new FileReader(p); r.open(); var c = r.readAll(); r.close(); var len = f.length; f.deleteFile(); return 'content=' + c + ' length=' + len + ' existsAfterDelete=' + new File(p).exists; })()", "content=b length=1 existsAfterDelete=false");
lab("FileWriter lines", "(function(){ var p = System.appendToPath(System.getTempDirectory(), 'p2.txt'); var w = new FileWriter(p); w.open(); w.writeLine('l1'); w.write('l2'); w.close(); var r = new FileReader(p); r.open(); var a = r.readLine(); var b = r.readLine(); var c = r.readLine(); r.close(); return JSON.stringify([a, b, c]); })()", "[\"l1\",\"l2\",null]");
test("ZipWriter writes an archive file", both, "var p = System.getTempDirectory() + '/a.zip'; var z = new ZipWriter(p); z.addContent('a.txt', 'hello', 'UTF-8'); z.writeZip(); return new File(p).exists;", ok("true"));

// --- 9.1.1-only behaviour (measured)
test("9.1.1: ArrayList is a JavaScript array", ["91x"], "var l = new java.util.ArrayList(); return [Array.isArray(l), typeof l.add].join();", ok("true,undefined"));
test("9.1.1: HashMap is a Properties object", ["91x"], "var m = new java.util.HashMap(); m.put('k1', 'v1'); return System.getObjectClassName(m) + ' ' + m.k1;", ok("Properties v1"));
test("9.0: HashMap stays a Java map", ["9x"], "var m = new java.util.HashMap(); return typeof m.put + ' ' + Array.isArray(new java.util.ArrayList());", ok("function false"));
test("9.1.1: reading outside allowed folders is denied", ["91x"], "var r = new FileReader('/tmp/does-not-exist-cbe'); r.open();",
    err(/^InternalError: Permission denied on file '\/tmp\/does-not-exist-cbe' , read not allowed$/));
test("9.1.1: Command.execute is disabled", ["91x"], "new Command('echo hi').execute(true);",
    err(/^InternalError: This method is disabled for security reasons\. 'Command' is deprecated/));
test("8.x/9.0: Command is a no-op mock", ["8x", "9x"], "var c = new Command(['ls', '-l']); return c.execute(true) + '|' + c.command;", ok("0|ls -l"));

// ------------------------------------------------------------- API catalog stubs

const stubLog = (re) => (r) => r.ok && r.logs.some(l => l.level === "debug" && re.test(l.msg)) ? null : "no stub line " + re + " in " + JSON.stringify(r.logs);
test("stub: static scripting object", both, "var e = ActiveDirectory.searchExactMatch('User', 'bob'); return typeof ActiveDirectory + '|' + Array.isArray(e);", ok("function|true"));
test("stub: call is logged", both, "XMLManager.fromString('<a/>');", stubLog(/^\[stub\] XMLManager\.fromString\(\) \u2192 XMLDocument$/));
test("stub: typed placeholder chain", both, "var d = XMLManager.fromString('<a/>'); return System.getObjectClassName(d) + '|' + System.getObjectClassName(d.getDocumentElement());", ok("XMLDocument|XMLElement"));
test("stub: constructor keeps matching attributes", both, "var s = new SSHSession('host01', 'root'); return s.host + '|' + s.username + '|' + s.exitCode;",
    r => r.ok && /^host01\|root\|/.test(r.result) ? null : JSON.stringify(r.error || r.result));
test("stub: primitive defaults", both, "var c = new SSHCommand(); return [typeof c.output, typeof c.exitCode].join();",
    r => r.ok ? null : JSON.stringify(r.error));
test("stub: writable attribute keeps value", both, "var m = new EmailMessage(); m.subject = 'hi'; return m.subject;", ok("hi"));
test("stub: unknown class stays undefined", both, "return typeof NoSuchClassAnywhere;", ok("undefined"));
test("stub: hand-written mocks keep priority", both, "return typeof Properties.prototype.keys + '|' + new RESTHost('x').name;", ok("function|x"));
test("stub: hand-written VcPlugin gains catalog members", both, "return VcPlugin.getAllResourcePools().length + '|' + VcPlugin.allVirtualMachines.length;", ok("0|6"));
test("stub: mock VM keeps fixture data and gains catalog methods", both,
    "var vm = VcPlugin.getAllVirtualMachines()[0]; var t = typeof vm.refreshStorageInfo === 'function' ? 'fn' : 'none'; var task = vm.reconfigVM_Task(new VcVirtualMachineConfigSpec());\n" +
    "var t2 = vm.upgradeVM_Task('vmx-21'); System.getModule('com.vmware.library.vc.basic').vim3WaitTaskEnd(t2, true, 1);\n" +
    "return vm.name + '|' + t + '|' + t2.info.state.value + '|' + System.getObjectClassName(vm);", ok("web-01|fn|success|VcVirtualMachine"));
test("stub: SQL flow", both, "var dbs = SQLDatabaseManager.getDatabases(); var db = new SQLDatabase(); return Array.isArray(dbs) + '|' + Array.isArray(db.readCustomQuery('select 1'));", ok("true|true"));
test("stub: REST plug-in classes the mocks lack", both, "var o = new RESTOperation(); return System.getObjectClassName(o);", ok("RESTOperation"));

global.window = global.window || {};
require(path.join(PUB, "samples.js"));
window.VRO_SAMPLES.forEach(g => g.items.filter(x => /^pl-/.test(x.id)).forEach(x => {
    test("sample " + x.id + " runs", both, x.code, r => r.ok ? null : JSON.stringify(r.error), { inputs: x.inputs });
}));

// ------------------------------------------------------------- feature matrix

const matrixJobs = [];
features.forEach(f => all.forEach(e => matrixJobs.push(job(e, f.code))));

const results = runBatch(tests.map(t => t.job).concat(matrixJobs));
let failed = 0;
tests.forEach((t, i) => {
    const msg = t.check(results[i]);
    if (msg) { failed++; console.log("FAIL " + t.name + "\n     " + msg); }
});
console.log(`${tests.length - failed}/${tests.length} mock/runtime tests passed`);

const mres = results.slice(tests.length);
const rows = features.map((f, i) => {
    const r8 = mres[i * 3], r9 = mres[i * 3 + 1], r91 = mres[i * 3 + 2];
    const v = r => r.ok ? "yes" : "no";
    const why = r => r.ok ? "" : `${r.error.name}: ${r.error.message}`;
    return { f, r8, r9, r91, v8: v(r8), v9: v(r9), v91: v(r91), why8: why(r8), why9: why(r9), why91: why(r91) };
});

let mismatches = 0;
rows.forEach(r => {
    const m8 = r.f.blog8 && r.f.blog8 !== r.v8;
    const m9 = r.f.blog9 && r.f.blog9 !== r.v9;
    if (m8 || m9) mismatches++;
});
console.log(`${rows.length} features measured; ${mismatches} differ from the blog verdicts`);
const labDiff = rows.filter(r => r.f.lab91 && r.f.lab91 !== r.v91);
console.log(`9.1 profile vs real Orchestrator 9.1.1: ${rows.length - labDiff.length}/${rows.length} features match`);
labDiff.forEach(r => { failed++; console.log(`FAIL 9.1 vs server: ${r.f.name}: console=${r.v91} server=${r.f.lab91} ${r.why91}`); });

if (process.argv.includes("--matrix")) {
    const md = ["# JavaScript feature matrix (measured)", "",
        "Generated by `node engine/test/run-tests.js --matrix`: each snippet runs on the real Rhino",
        "engines with this console's Orchestrator settings (class shutter, language version, wrapping).",
        "The *blog* columns are the verdicts from the cloudblogger 8.x vs 9.x post; `?` = not tested there.",
        "The *9.1.1 server* column is ground truth: the same snippet run on a real Orchestrator 9.1.1",
        "(build 25643527, Rhino 1.9.1). A ⚠ marks a console result that differs from its reference.", "",
        "| Feature | 8.x console | 8.x blog | 9.0 console | 9.0 blog | 9.1 console | 9.1.1 server | 9.1 error |",
        "|---|---|---|---|---|---|---|---|"];
    rows.forEach(r => {
        const flag = (m, b) => b && b !== m ? `**${m}** ⚠` : m;
        md.push(`| ${r.f.name} | ${flag(r.v8, r.f.blog8)} | ${r.f.blog8 || "?"} | ${flag(r.v9, r.f.blog9)} | ${r.f.blog9 || "?"} | ` +
            `${flag(r.v91, r.f.lab91)} | ${r.f.lab91 || "?"} | ${r.why91.replace(/\|/g, "\\|").slice(0, 80)} |`);
    });
    fs.mkdirSync(path.join(ROOT, "docs"), { recursive: true });
    fs.writeFileSync(path.join(ROOT, "docs/feature-matrix.md"), md.join("\n") + "\n");
    console.log("wrote docs/feature-matrix.md");
}
if (process.argv.includes("--verbose")) {
    rows.forEach(r => console.log(`${r.f.name.padEnd(34)} 8x:${r.v8}${r.f.blog8 && r.f.blog8 !== r.v8 ? "!" : " "} 9x:${r.v9}${r.f.blog9 && r.f.blog9 !== r.v9 ? "!" : " "} 91x:${r.v91}${r.f.lab91 && r.f.lab91 !== r.v91 ? "!" : " "} ${r.why91 || r.why9}`));
}
process.exit(failed ? 1 : 0);
