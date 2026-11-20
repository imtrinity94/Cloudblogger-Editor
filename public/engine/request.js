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
            // API catalog: the engine reads class data from this file on demand.
            catalogPath: opts.catalogPath || "",
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

    var api = { buildRequest: buildRequest, referencedClasses: referencedClasses };
    if (typeof module !== "undefined" && module.exports) module.exports = api;
    else root.VroRequest = api;
})(this);
