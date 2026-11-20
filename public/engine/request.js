/*
 * Builds the request the Java runner expects. Shared by the web page and the
 * Node test harness so both exercise exactly the same path.
 */
(function (root) {
    "use strict";

    function buildRequest(opts) {
        var profile = opts.profile;
        // Mocks are compiled once and cached by the engine; the fixture travels separately.
        var prelude = opts.mocks;
        return JSON.stringify({
            code: opts.code,
            prelude: prelude,
            fixture: JSON.stringify(opts.fixture || {}),
            mode: opts.mode || "action",
            name: opts.name || (opts.mode === "task" ? "item1" : "myAction"),
            workflow: opts.workflow || "Test",
            languageVersion: profile.languageVersion,
            timeoutMs: opts.timeoutMs || 10000,
            removeGlobals: profile.removeGlobals || [],
            enableFeatures: profile.enableFeatures || [],
            flags: profile.flags || [],
            allowJava: opts.allowJava || [],
            inputs: opts.inputs || [],
            outputs: opts.outputs || [],
            trace: opts.trace ? "true" : "false",
            // API catalog lines for classes this engine has not been sent yet.
            catalogLines: opts.catalogLines || "",
            stubGlobals: opts.stubGlobals || []
        });
    }

    /*
     * Catalog classes named in a script (and its input expressions). Only these become
     * global stubs for the run; classes reached through return values are built lazily.
     */
    function referencedClasses(texts, classIndex, builtins) {
        var seen = {}, out = [];
        var skip = {};
        (builtins || []).forEach(function (b) { skip[b] = 1; });
        (Array.isArray(texts) ? texts : [texts]).forEach(function (t) {
            var re = /[A-Za-z_$][\w$]*/g, m;
            t = String(t || "");
            while ((m = re.exec(t))) {
                var id = m[0];
                if (seen[id] || skip[id]) continue;
                if (Object.prototype.hasOwnProperty.call(classIndex, id)) {
                    seen[id] = 1;
                    out.push(id);
                }
            }
        });
        return out;
    }

    /* stubs.txt text -> { className: restOfLine } */
    function parseCatalog(text) {
        var map = {};
        String(text || "").split("\n").forEach(function (l) {
            var i = l.indexOf("\t");
            if (i > 0) map[l.substring(0, i)] = l.substring(i + 1);
        });
        return map;
    }

    /*
     * Every class reachable from the given ones through attribute and return types,
     * so the engine can build stubs for whole chains (vm.runtime.host.parent...).
     * `sent` (optional) holds names the engine already has; they are skipped and the
     * new ones are added to it. Returns the catalog lines to send.
     */
    function catalogLinesFor(names, map, sent) {
        var seen = {}, queue = names.slice(), out = [];
        while (queue.length) {
            var n = queue.pop();
            if (seen[n] || !Object.prototype.hasOwnProperty.call(map, n)) continue;
            seen[n] = 1;
            var rest = map[n];
            if (!sent || !sent[n]) out.push(n + "\t" + rest);
            var f = rest.split("\t");
            [f[1], f[2]].forEach(function (part) {
                if (!part) return;
                part.split("|").forEach(function (x) {
                    var t = (x.split(":")[1] || "").replace(/\[\]/g, "");
                    if (t.length > 1 && !seen[t]) queue.push(t);
                });
            });
        }
        if (sent) Object.keys(seen).forEach(function (k) { sent[k] = 1; });
        return out.join("\n");
    }

    var api = { buildRequest: buildRequest, referencedClasses: referencedClasses, parseCatalog: parseCatalog, catalogLinesFor: catalogLinesFor };
    if (typeof module !== "undefined" && module.exports) module.exports = api;
    else root.VroRequest = api;
})(this);
