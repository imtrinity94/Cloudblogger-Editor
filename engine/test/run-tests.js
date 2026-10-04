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
const { buildRequest } = require(path.join(PUB, "engine/request.js"));
const mocks = fs.readFileSync(path.join(PUB, "engine/vro-mocks.js"), "utf8");
const fixture = JSON.parse(fs.readFileSync(path.join(PUB, "engine/fixture.default.json"), "utf8"));
const profiles = JSON.parse(fs.readFileSync(path.join(PUB, "engine/profiles.json"), "utf8"));
const features = require("./features.js");

function runBatch(jobs) {
    const tmp = path.join(require("os").tmpdir(), "vro-batch-" + process.pid + ".jsonl");
    fs.writeFileSync(tmp, jobs.map(j => JSON.stringify({ engine: j.engine, request: JSON.parse(j.request) })).join("\n"));
    const out = execFileSync("java", ["-cp", path.join(PUB, "engines/launcher.jar"), "vroconsole.Launcher",
        path.join(PUB, "engines"), "batch", tmp], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 26 });
    fs.unlinkSync(tmp);
    return out.trim().split("\n").map(l => JSON.parse(l));
}

function job(engine, code, extra) {
    return {
        engine,
        request: buildRequest(Object.assign({ code, mocks, fixture, profile: profiles[engine], timeoutMs: 5000 }, extra || {}))
    };
}

// ---------------------------------------------------------------- mock tests

const both = ["8x", "9x"];
const tests = [];
function test(name, engines, code, check, extra) {
    engines.forEach(e => tests.push({ name: `[${e}] ${name}`, job: job(e, code, extra), check }));
}
const ok = (v) => (r) => r.ok && r.result === v ? null : `expected result ${JSON.stringify(v)}, got ${JSON.stringify(r.error || r.result)}`;
const err = (re) => (r) => !r.ok && re.test(r.error.name + ": " + r.error.message) ? null : `expected error ${re}, got ${JSON.stringify(r.ok ? r.result : r.error)}`;

test("engine version 8.x", ["8x"], "return 1", r => /Rhino 1\.7 release 4 2012 06 18/.test(r.engineVersion) ? null : r.engineVersion);
test("engine version 9.x", ["9x"], "return 1", r => /Rhino 1\.7\.15 2024 05 03/.test(r.engineVersion) ? null : r.engineVersion);
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
test("console only on 9.x", both, "return typeof console;", r => r.ok && r.result === (r.languageVersion >= 200 ? "object" : "undefined") ? null : r.result);
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
test("System.getDateFromFormat mismatch returns null", both, "return String(System.getDateFromFormat('nope', 'yyyy-MM-dd'));", ok("null"));
test("Properties return value is shown in full", both,
    "var p = new Properties(); p.put('cp', { network: 'pg-1' }); return p;",
    r => r.ok && /Properties \{\n  cp: \{\n    network: "pg-1"/.test(r.result) ? null : JSON.stringify(r.result));
test("thrown Error keeps name", both, "throw new TypeError('bad input');", err(/^TypeError: bad input$/));

// ------------------------------------------------------------- feature matrix

const matrixJobs = [];
features.forEach(f => both.forEach(e => matrixJobs.push(job(e, f.code))));

const results = runBatch(tests.map(t => t.job).concat(matrixJobs));
let failed = 0;
tests.forEach((t, i) => {
    const msg = t.check(results[i]);
    if (msg) { failed++; console.log("FAIL " + t.name + "\n     " + msg); }
});
console.log(`${tests.length - failed}/${tests.length} mock/runtime tests passed`);

const mres = results.slice(tests.length);
const rows = features.map((f, i) => {
    const r8 = mres[i * 2], r9 = mres[i * 2 + 1];
    const v = r => r.ok ? "yes" : "no";
    const why = r => r.ok ? "" : `${r.error.name}: ${r.error.message}`;
    return { f, r8, r9, v8: v(r8), v9: v(r9), why8: why(r8), why9: why(r9) };
});

let mismatches = 0;
rows.forEach(r => {
    const m8 = r.f.blog8 && r.f.blog8 !== r.v8;
    const m9 = r.f.blog9 && r.f.blog9 !== r.v9;
    if (m8 || m9) mismatches++;
});
console.log(`${rows.length} features measured; ${mismatches} differ from the blog verdicts`);

if (process.argv.includes("--matrix")) {
    const md = ["# JavaScript feature matrix (measured)", "",
        "Generated by `node engine/test/run-tests.js --matrix`: each snippet runs on the real Rhino",
        "engines with this console's Orchestrator settings (class shutter, language version, wrapping).",
        "The *blog* columns are the verdicts from the cloudblogger 8.x vs 9.x post; `?` = not tested there.", "",
        "| Feature | 8.x measured | 8.x blog | 9.x measured | 9.x blog | 9.x error |",
        "|---|---|---|---|---|---|"];
    rows.forEach(r => {
        const flag = (m, b) => b && b !== m ? `**${m}** ⚠` : m;
        md.push(`| ${r.f.name} | ${flag(r.v8, r.f.blog8)} | ${r.f.blog8 || "?"} | ${flag(r.v9, r.f.blog9)} | ${r.f.blog9 || "?"} | ${r.why9.replace(/\|/g, "\\|").slice(0, 90)} |`);
    });
    fs.mkdirSync(path.join(ROOT, "docs"), { recursive: true });
    fs.writeFileSync(path.join(ROOT, "docs/feature-matrix.md"), md.join("\n") + "\n");
    console.log("wrote docs/feature-matrix.md");
}
if (process.argv.includes("--verbose")) {
    rows.forEach(r => console.log(`${r.f.name.padEnd(34)} 8x:${r.v8}${r.f.blog8 && r.f.blog8 !== r.v8 ? "!" : " "} 9x:${r.v9}${r.f.blog9 && r.f.blog9 !== r.v9 ? "!" : " "} ${r.why9 || r.why8}`));
}
process.exit(failed ? 1 : 0);
