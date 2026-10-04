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
            allowJava: opts.allowJava || [],
            inputs: opts.inputs || [],
            outputs: opts.outputs || [],
            trace: opts.trace ? "true" : "false"
        });
    }

    var api = { buildRequest: buildRequest };
    if (typeof module !== "undefined" && module.exports) module.exports = api;
    else root.VroRequest = api;
})(this);
