#!/usr/bin/env node
/*
 * Builds the Orchestrator API catalog the editor uses (API Explorer, autocomplete,
 * hover docs and runtime stubs) from the modern-vroapi data files.
 *
 *   node engine/catalog/build-catalog.js [path-to-modern-vroapi]
 *
 * The source defaults to $MODERN_VROAPI or ../modern-vroapi next to this repo.
 * Output goes to public/catalog/: catalog.json (index) and a content-hashed folder
 * v-<hash>/ with per-plugin details, per-plugin .d.ts files and stubs.txt.
 */
"use strict";

var fs = require("fs");
var path = require("path");
var crypto = require("crypto");

var ROOT = path.resolve(__dirname, "..", "..");
var SRC = path.resolve(process.argv[2] || process.env.MODERN_VROAPI || path.join(ROOT, "..", "modern-vroapi"));
var DATA = path.join(SRC, "vro-doc-site", "src", "data", "plugins");
var OUT = path.join(ROOT, "public", "catalog");

// First wave. AWS, F5 and Avi are left out for now (size); add ids here to include more.
var PLUGINS = [
    "o11n-core",
    "o11n-plugin-vc",
    "o11n-plugin-vapi",
    "o11n-plugin-rest",
    "o11n-plugin-sql",
    "o11n-plugin-ssh",
    "o11n-plugin-powershell",
    "o11n-plugin-activedirectory",
    "o11n-plugin-vra",
    "o11n-plugin-vcfautomation",
    "o11n-plugin-infoblox",
    "o11n-plugin-xml",
    "o11n-plugin-mail"
];

// Loaded with the editor; the rest load when a script uses one of their classes.
var EAGER = ["o11n-core", "o11n-plugin-rest", "o11n-plugin-sql", "o11n-plugin-ssh", "o11n-plugin-powershell",
    "o11n-plugin-activedirectory", "o11n-plugin-vcfautomation", "o11n-plugin-infoblox", "o11n-plugin-xml", "o11n-plugin-mail"];

// Documented in the core plug-in but provided by the JavaScript engine itself.
var JS_BUILTINS = { Array: 1, Date: 1, Number: 1, Object: 1, String: 1, Boolean: 1, boolean: 1, char: 1, Function: 1, Regexp: 1, RegExp: 1, Math: 1, JSON: 1, Error: 1 };

var RESERVED = ("break case catch class const continue debugger default delete do else enum export extends false finally for function if " +
    "import in instanceof new null return super switch this throw true try typeof var void while with yield let static implements " +
    "interface package private protected public arguments eval").split(" ").reduce(function (o, w) { o[w] = 1; return o; }, {});

if (!fs.existsSync(DATA)) {
    console.error("modern-vroapi data not found at " + DATA + "\nPass the repo path as the first argument or set MODERN_VROAPI.");
    process.exit(1);
}

function clean(s) {
    s = String(s || "").replace(/\r/g, "").trim();
    if (s === "@since null" || s === "@since") return "";
    return s;
}

/* Parameters come as "string key, Object value" (core) or "key: String, value: Object" (plug-ins). */
function parseParams(p) {
    if (Array.isArray(p)) return p.map(function (x) { return { name: x.name || "arg", type: x.type || "Any" }; });
    p = String(p || "").trim();
    if (!p) return [];
    return p.split(/,\s*/).map(function (part, i) {
        part = part.trim();
        var m = /^([\w$]+)\s*:\s*(.+)$/.exec(part);
        if (m) return { name: m[1], type: m[2].trim() };
        var bits = part.split(/\s+/);
        if (bits.length >= 2) return { type: bits[0], name: bits.slice(1).join("") };
        return { type: bits[0] || "Any", name: "arg" + i };
    });
}

// ------------------------------------------------------------------ load

var plugins = [];
var byName = {};       // class name -> { plugin, cls }
PLUGINS.forEach(function (id, pi) {
    var raw = JSON.parse(fs.readFileSync(path.join(DATA, id + ".json"), "utf8"));
    var classes = [];
    (raw.classes || []).forEach(function (c) {
        if (byName[c.name]) return;           // first definition wins (a few vc duplicates)
        var ctors = [];
        (c.constructors || []).forEach(function (k) { ctors.push(parseParams(k.parameters)); });
        var methods = [];
        var seen = {};
        (c.methods || []).forEach(function (m) {
            var params = parseParams(m.parameters);
            if (m.name === c.name) { ctors.push(params); return; }   // plug-in data lists constructors as methods
            var key = m.name + "/" + params.length;
            if (seen[key]) return;
            seen[key] = 1;
            methods.push({ name: m.name, ret: m.returnType || "void", params: params, desc: clean(m.description) });
        });
        var attrs = (c.attributes || []).map(function (a) {
            return { name: a.name, type: a.type || "Any", ro: !!a.isReadonly, desc: clean(a.description) };
        });
        var cls = { name: c.name, desc: clean(c.description), ctors: ctors, attrs: attrs, methods: methods, plugin: pi };
        byName[c.name] = cls;
        classes.push(cls);
    });
    plugins.push({ id: id, name: raw.name || id, classes: classes });
});

// ------------------------------------------------------------- stubs.txt

function typeCode(t) {
    t = String(t || "").trim();
    var arr = "";
    while (/\[\]$/.test(t)) { arr += "[]"; t = t.slice(0, -2); }
    var m = /^Array\/(.+)$/.exec(t);
    if (m) { arr += "[]"; t = m[1]; }
    var code;
    switch (t) {
        case "string": case "String": case "Text": case "SecureString": case "char": code = "s"; break;
        case "number": case "Number": case "int": case "long": case "double": case "float": case "short": case "Integer": case "Long": case "Double": code = "n"; break;
        case "boolean": case "Boolean": code = "b"; break;
        case "void": code = "v"; break;
        case "Properties": code = "p"; break;
        case "Date": code = "d"; break;
        case "Array": code = "a"; arr += "[]"; break;
        case "": case "Any": case "Object": case "any": case "Function": code = "a"; break;
        default: code = byName[t] && !JS_BUILTINS[t] ? t : "a";
    }
    return code + arr;
}

var stubLines = [];
plugins.forEach(function (p, pi) {
    p.classes.forEach(function (c) {
        if (JS_BUILTINS[c.name]) return;
        var a = c.attrs.map(function (x) { return x.name + ":" + typeCode(x.type) + (x.ro ? "" : ":w"); }).join("|");
        var m = c.methods.map(function (x) { return x.name + ":" + typeCode(x.ret); });
        // overloads collapse to one runtime stub
        var mm = [], ms = {};
        m.forEach(function (x) { var n = x.split(":")[0]; if (!ms[n]) { ms[n] = 1; mm.push(x); } });
        var ctor = c.ctors.length ? c.ctors[0].map(function (x) { return x.name; }).join(",") : "";
        stubLines.push([c.name, pi, a, mm.join("|"), ctor].join("\t"));
    });
});
var stubsText = stubLines.join("\n") + "\n";

// ------------------------------------------------------------------ d.ts

function tsType(t) {
    t = String(t || "").trim();
    var arr = "";
    while (/\[\]$/.test(t)) { arr += "[]"; t = t.slice(0, -2); }
    var m = /^Array\/(.+)$/.exec(t);
    if (m) { arr += "[]"; t = m[1]; }
    var out;
    switch (t) {
        case "string": case "String": case "Text": case "SecureString": case "char": out = "string"; break;
        case "number": case "Number": case "int": case "long": case "double": case "float": case "short": case "Integer": case "Long": case "Double": out = "number"; break;
        case "boolean": case "Boolean": out = "boolean"; break;
        case "void": out = "void"; break;
        case "Date": out = "Date"; break;
        case "Array": out = "any[]"; break;
        case "": case "Any": case "Object": case "any": out = "any"; break;
        case "Function": out = "Function"; break;
        default: out = byName[t] && !JS_BUILTINS[t] ? t : "any";
    }
    return out + arr;
}

function ident(n, i) {
    n = String(n || "").replace(/[^\w$]/g, "_");
    if (!n || /^\d/.test(n)) n = "arg" + i;
    if (RESERVED[n]) n += "_";
    return n;
}

function jsdoc(text, indent, extra) {
    var lines = [];
    if (text) lines = lines.concat(text.split("\n"));
    if (extra) lines.push(extra);
    if (!lines.length) return "";
    lines = lines.map(function (l) { return l.replace(/\*\//g, "* /"); });
    if (lines.length === 1) return indent + "/** " + lines[0] + " */\n";
    return indent + "/**\n" + lines.map(function (l) { return indent + " * " + l; }).join("\n") + "\n" + indent + " */\n";
}

function paramList(params) {
    var used = {};
    return params.map(function (p, i) {
        var n = ident(p.name, i);
        while (used[n]) n += "_";
        used[n] = 1;
        return n + ": " + tsType(p.type);
    }).join(", ");
}

function propName(n) {
    return /^[A-Za-z_$][\w$]*$/.test(n) ? n : JSON.stringify(n);
}

function dtsFor(p) {
    var out = ["// " + p.name + " (" + p.id + "), generated from modernvroapi.in data. Do not edit.", ""];
    p.classes.forEach(function (c) {
        if (JS_BUILTINS[c.name]) return;
        out.push(jsdoc(c.desc, "", "Plug-in: " + p.name) + "interface " + c.name + " {");
        var seen = {};
        c.attrs.forEach(function (a) {
            if (seen["a:" + a.name]) return;
            seen["a:" + a.name] = 1;
            out.push(jsdoc(a.desc, "    ") + "    " + (a.ro ? "readonly " : "") + propName(a.name) + ": " + tsType(a.type) + ";");
        });
        c.methods.forEach(function (m) {
            if (seen["a:" + m.name]) return;   // attribute and method with one name: keep the attribute
            out.push(jsdoc(m.desc, "    ") + "    " + propName(m.name) + "(" + paramList(m.params) + "): " + tsType(m.ret) + ";");
        });
        out.push("}");
        var ctors = c.ctors.length ? c.ctors : [[]];
        var sig = ctors.map(function (k) { return "new(" + paramList(k) + "): " + c.name; }).join("; ");
        out.push("declare var " + c.name + ": " + c.name + " & { " + sig + "; prototype: " + c.name + " };");
        out.push("");
    });
    return out.join("\n");
}

// ---------------------------------------------------------- plug-in details

function detailFor(p) {
    return p.classes.map(function (c) {
        var o = { n: c.name };
        if (c.desc) o.d = c.desc;
        if (c.ctors.length) o.c = c.ctors.map(function (k) { return k.map(function (x) { return [x.name, x.type]; }); });
        if (c.attrs.length) o.a = c.attrs.map(function (a) { var r = [a.name, a.type, a.ro ? 1 : 0]; if (a.desc) r.push(a.desc); return r; });
        if (c.methods.length) o.m = c.methods.map(function (m) {
            var r = [m.name, m.ret, m.params.map(function (x) { return [x.name, x.type]; })];
            if (m.desc) r.push(m.desc);
            return r;
        });
        return o;
    });
}

// ------------------------------------------------------------------ write

var files = {};
files["stubs.txt"] = stubsText;
plugins.forEach(function (p) {
    files["dts/" + p.id + ".d.ts"] = dtsFor(p);
    files["plugins/" + p.id + ".json"] = JSON.stringify(detailFor(p));
});

var hash = crypto.createHash("sha256");
Object.keys(files).sort().forEach(function (k) { hash.update(k + "\0" + files[k]); });
var version = hash.digest("hex").slice(0, 12);
var dir = "v-" + version;

// Remove older hashed folders, then write the new one.
if (fs.existsSync(OUT)) {
    fs.readdirSync(OUT).forEach(function (f) {
        if (/^v-[0-9a-f]+$/.test(f) && f !== dir) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
    });
}
Object.keys(files).forEach(function (k) {
    var f = path.join(OUT, dir, k);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, files[k]);
});

var srcRev = "";
try {
    srcRev = require("child_process").execSync("git -C " + JSON.stringify(SRC) + " rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
} catch (e) { /* not a git checkout */ }

var classIndex = {};
var totals = { classes: 0, methods: 0, attributes: 0 };
plugins.forEach(function (p, pi) {
    p.classes.forEach(function (c) {
        classIndex[c.name] = pi;
        totals.classes++;
        totals.methods += c.methods.length;
        totals.attributes += c.attrs.length;
    });
});

var index = {
    version: version,
    dir: dir,
    source: "modernvroapi.in (github.com/imtrinity94/modern-vroapi" + (srcRev ? " @ " + srcRev : "") + ")",
    totals: totals,
    plugins: plugins.map(function (p) {
        return { id: p.id, name: p.name, classes: p.classes.length, eager: EAGER.indexOf(p.id) !== -1 };
    }),
    builtins: Object.keys(JS_BUILTINS),
    classes: classIndex
};
fs.writeFileSync(path.join(OUT, "catalog.json"), JSON.stringify(index));

console.log("catalog " + dir + ": " + totals.classes + " classes, " + totals.methods + " methods, " + totals.attributes +
    " attributes from " + plugins.length + " plug-ins");
Object.keys(files).sort().forEach(function (k) {
    console.log("  " + k + "  " + Math.round(files[k].length / 1024) + " KB");
});
