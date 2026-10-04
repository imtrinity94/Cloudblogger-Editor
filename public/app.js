/*
 * Cloudblogger Editor — vRO script console.
 *
 * Scripts run on real Rhino (1.7R4 / 1.7.15) inside CheerpJ's WebAssembly JVM.
 * The page only builds a request (engine/request.js), calls
 * vroconsole.Launcher.run(engine, json) and renders the JSON it returns.
 */
(function () {
    "use strict";

    var ENGINE_LABEL = { "8x": "8.x · Rhino 1.7R4", "9x": "9.x · Rhino 1.7.15" };
    var STORE_KEY = "cbe.state.v2";

    var state = load() || {
        version: "9x",
        mode: "action",
        sample: "hello",
        code: null,
        inputs: [],
        outputs: [],
        fixtureText: null
    };

    var els = {
        runBtn: byId("runBtn"),
        runBothBtn: byId("runBothBtn"),
        status: byId("engineStatus"),
        output: byId("output"),
        sidebar: byId("sidebar"),
        inputs: byId("inputs"),
        outputs: byId("outputs"),
        outputsCol: byId("outputsCol"),
        editorTitle: byId("editorTitle"),
        fixtureError: byId("fixtureError"),
        debugToggle: byId("debugToggle")
    };

    var editor = null, fixtureEditor = null;
    var mocksSource = "", profiles = null, defaultFixtureText = "";
    var launcher = null;
    var running = false;

    function byId(id) { return document.getElementById(id); }

    function load() {
        try { return JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { return null; }
    }
    var saveTimer = null;
    function save() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(function () {
            try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
        }, 300);
    }

    function setStatus(kind, text) {
        els.status.className = "status " + kind;
        els.status.querySelector(".txt").textContent = text;
    }

    function refreshButtons() {
        var ready = !!launcher && !running;
        els.runBtn.disabled = !ready;
        els.runBothBtn.disabled = !ready;
    }

    // ------------------------------------------------------------- controls

    function bindSeg(id, key, onChange) {
        var seg = byId(id);
        function paint() {
            Array.prototype.forEach.call(seg.querySelectorAll("button"), function (b) {
                b.setAttribute("aria-checked", String(b.dataset.value === state[key]));
            });
        }
        seg.addEventListener("click", function (e) {
            var b = e.target.closest("button");
            if (!b) return;
            state[key] = b.dataset.value;
            paint();
            save();
            if (onChange) onChange();
        });
        paint();
        return paint;
    }

    var paintMode = bindSeg("modeSeg", "mode", onModeChange);
    bindSeg("versionSeg", "version");

    function onModeChange() {
        els.editorTitle.textContent = state.mode === "task" ? "Scriptable task (item1)" : "myAction";
        els.outputsCol.classList.toggle("disabled", state.mode !== "task");
    }

    // --------------------------------------------------------- inputs/outputs

    function renderIo() {
        els.inputs.innerHTML = "";
        state.inputs.forEach(function (inp, i) {
            var row = document.createElement("div");
            row.className = "io-row";
            row.innerHTML = '<input class="name" spellcheck="false" placeholder="name"><span>=</span>' +
                '<input class="value" spellcheck="false" placeholder="JavaScript expression, e.g. &quot;web-01&quot; or VcPlugin.getAllVirtualMachines()[0]">' +
                '<button class="rm" title="Remove" aria-label="Remove input">×</button>';
            var n = row.querySelector(".name"), v = row.querySelector(".value");
            n.value = inp.name; v.value = inp.value;
            n.addEventListener("input", function () { inp.name = n.value.trim(); save(); });
            v.addEventListener("input", function () { inp.value = v.value; save(); });
            row.querySelector(".rm").addEventListener("click", function () { state.inputs.splice(i, 1); renderIo(); save(); });
            els.inputs.appendChild(row);
        });
        els.outputs.innerHTML = "";
        state.outputs.forEach(function (name, i) {
            var row = document.createElement("div");
            row.className = "io-row";
            row.innerHTML = '<input class="name value" spellcheck="false" placeholder="variable name">' +
                '<button class="rm" title="Remove" aria-label="Remove output">×</button>';
            var n = row.querySelector("input");
            n.value = name;
            n.addEventListener("input", function () { state.outputs[i] = n.value.trim(); save(); });
            row.querySelector(".rm").addEventListener("click", function () { state.outputs.splice(i, 1); renderIo(); save(); });
            els.outputs.appendChild(row);
        });
    }
    byId("addInput").addEventListener("click", function () { state.inputs.push({ name: "", value: "" }); renderIo(); save(); });
    byId("addOutput").addEventListener("click", function () { state.outputs.push(""); renderIo(); save(); });

    // ---------------------------------------------------------------- tabs

    function showTab(name) {
        Array.prototype.forEach.call(document.querySelectorAll(".tabs [role=tab]"), function (t) {
            t.classList.toggle("active", t.dataset.tab === name);
        });
        Array.prototype.forEach.call(document.querySelectorAll(".tab-body"), function (b) {
            b.classList.toggle("active", b.dataset.tab === name);
        });
        if (name === "mocks" && fixtureEditor) fixtureEditor.layout();
    }
    document.querySelector(".tabs").addEventListener("click", function (e) {
        var t = e.target.closest("[role=tab]");
        if (t) showTab(t.dataset.tab);
    });

    els.debugToggle.addEventListener("change", function () {
        els.output.classList.toggle("hide-debug", !els.debugToggle.checked);
    });
    byId("clearBtn").addEventListener("click", function () {
        els.output.innerHTML = '<div class="empty">Output cleared.</div>';
        if (editor) monaco.editor.setModelMarkers(editor.getModel(), "vro", []);
    });

    // -------------------------------------------------------------- sidebar

    function renderSidebar() {
        els.sidebar.innerHTML = "";
        window.VRO_SAMPLES.forEach(function (g) {
            var h = document.createElement("h4");
            h.textContent = g.group;
            els.sidebar.appendChild(h);
            g.items.forEach(function (s) {
                var b = document.createElement("button");
                b.dataset.id = s.id;
                b.textContent = s.title;
                if (s.mode === "task") {
                    var t = document.createElement("span");
                    t.className = "tag";
                    t.textContent = "task";
                    b.appendChild(t);
                }
                b.addEventListener("click", function () { applySample(s); });
                els.sidebar.appendChild(b);
            });
        });
        markSample();
    }

    function markSample() {
        Array.prototype.forEach.call(els.sidebar.querySelectorAll("button"), function (b) {
            b.classList.toggle("active", b.dataset.id === state.sample);
        });
    }

    function findSample(id) {
        for (var i = 0; i < window.VRO_SAMPLES.length; i++) {
            var items = window.VRO_SAMPLES[i].items;
            for (var j = 0; j < items.length; j++) if (items[j].id === id) return items[j];
        }
        return null;
    }

    function applySample(s) {
        state.sample = s.id;
        state.mode = s.mode || "action";
        state.inputs = (s.inputs || []).map(function (x) { return { name: x.name, value: x.value }; });
        state.outputs = (s.outputs || []).slice();
        if (editor) editor.setValue(s.code);
        state.code = s.code;
        paintMode();
        onModeChange();
        renderIo();
        markSample();
        save();
    }

    // ---------------------------------------------------------------- run

    function fixtureObject() {
        var text = fixtureEditor ? fixtureEditor.getValue() : (state.fixtureText || defaultFixtureText);
        try {
            var obj = JSON.parse(text);
            els.fixtureError.textContent = "";
            return obj;
        } catch (e) {
            els.fixtureError.textContent = "Mocks JSON is invalid (" + e.message + "). Using the default inventory for this run.";
            return JSON.parse(defaultFixtureText);
        }
    }

    function buildRequest(engine) {
        return window.VroRequest.buildRequest({
            code: editor.getValue(),
            mocks: mocksSource,
            fixture: fixtureObject(),
            profile: profiles[engine],
            mode: state.mode,
            inputs: state.inputs.filter(function (i) { return i.name; }),
            outputs: state.mode === "task" ? state.outputs.filter(Boolean) : [],
            timeoutMs: 15000
        });
    }

    function callEngine(engine, request) {
        return launcher.run(engine, request).then(function (r) {
            if (typeof r === "string") return r;
            return r && typeof r.toString === "function" ? r.toString() : String(r);
        }).then(function (text) {
            try { return JSON.parse(text); }
            catch (e) { return { ok: false, logs: [], error: { name: "EngineError", message: "Unreadable engine response: " + text } }; }
        }, function (err) {
            return { ok: false, logs: [], error: { name: "EngineError", message: String(err && err.message || err) } };
        });
    }

    function run(engines) {
        if (!launcher || running) return;
        running = true;
        refreshButtons();
        showTab("output");
        setStatus("busy", "Running…");
        monaco.editor.setModelMarkers(editor.getModel(), "vro", []);

        var results = [];
        var chain = Promise.resolve();
        engines.forEach(function (engine) {
            chain = chain.then(function () {
                return callEngine(engine, buildRequest(engine)).then(function (res) {
                    results.push({ engine: engine, res: res });
                });
            });
        });
        chain.then(function () {
            renderResults(results);
            markErrors(results);
            setStatus("ready", "Engines ready");
        }).catch(function (e) {
            setStatus("error", "Run failed: " + e);
        }).then(function () {
            running = false;
            refreshButtons();
        });
    }

    els.runBtn.addEventListener("click", function () { run([state.version]); });
    els.runBothBtn.addEventListener("click", function () { run(["8x", "9x"]); });

    // ------------------------------------------------------------ rendering

    function el(tag, cls, text) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text !== undefined) e.textContent = text;
        return e;
    }

    var LEVEL = { info: "INFO", warning: "WARN", error: "ERROR", debug: "DEBUG" };

    function renderResults(results) {
        els.output.innerHTML = "";
        els.output.classList.toggle("hide-debug", !els.debugToggle.checked);
        results.forEach(function (r) {
            var res = r.res;
            var col = el("div", "run-col");

            var head = el("div", "run-head");
            head.appendChild(el("span", "badge " + (res.ok ? "ok" : "fail"), res.ok ? "completed" : "failed"));
            head.appendChild(el("span", "", r.engine === "8x" ? "8.x" : "9.x"));
            if (res.engineVersion) head.appendChild(el("span", "", "· " + res.engineVersion));
            if (res.durationMs !== undefined) head.appendChild(el("span", "", "· " + res.durationMs + " ms"));
            col.appendChild(head);

            var log = el("div", "log");
            (res.logs || []).forEach(function (l) {
                var line = el("div", "log-line " + l.level);
                line.appendChild(el("span", "ts", (l.t / 1000).toFixed(3) + "s"));
                line.appendChild(el("span", "lvl", LEVEL[l.level] || l.level));
                line.appendChild(el("span", "msg", l.msg));
                log.appendChild(line);
            });
            if (res.logsTruncated) log.appendChild(el("div", "log-line warning", "… log truncated after 5000 lines"));
            if (!(res.logs || []).length && res.ok) log.appendChild(el("div", "log-line debug", "(no log output)"));

            if (res.ok) {
                var notes = [];
                if (state.mode !== "task" && res.resultType !== "undefined") {
                    log.appendChild(box("Return value · " + res.resultType, res.result));
                    var rn = serializationNote("the return value", res.resultType, true);
                    if (rn) notes.push(rn);
                }
                var outs = res.outputs ? Object.keys(res.outputs) : [];
                if (outs.length) {
                    var types = res.outputTypes || {};
                    log.appendChild(box("Outputs", outs.map(function (k) {
                        return k + " = " + res.outputs[k] + (types[k] ? "   (" + types[k] + ")" : "");
                    }).join("\n")));
                    outs.forEach(function (k) {
                        var n = serializationNote("output '" + k + "'", types[k], false);
                        if (n) notes.push(n);
                    });
                }
                notes.forEach(function (n) {
                    var line = el("div", "log-line warning");
                    line.appendChild(el("span", "ts", ""));
                    line.appendChild(el("span", "lvl", "NOTE"));
                    line.appendChild(el("span", "msg", n));
                    log.appendChild(line);
                });
            } else {
                log.appendChild(errorBox(res.error || { name: "Error", message: "Unknown failure" }));
            }
            col.appendChild(log);
            els.output.appendChild(col);
        });
    }

    // Orchestrator passes values between workflow elements serialized; some JS values can't make the trip.
    function serializationNote(what, type, isAction) {
        if (type === "XML" || type === "XMLList") {
            return "In Orchestrator, " + what + " (E4X " + type + ") is not serialized between workflow elements. " +
                "Convert it with .toXMLString() first.";
        }
        if (type === "function") {
            return "In Orchestrator, " + what + " is a function and cannot be passed to another workflow element.";
        }
        return null;
    }

    function box(title, text) {
        var b = el("div", "result-box");
        b.appendChild(el("h5", "", title));
        b.appendChild(el("pre", "", text));
        return b;
    }

    // Formatted like Orchestrator: "TypeError: msg (Dynamic Script Module name : myAction#3)"
    function errorBox(e) {
        var b = el("div", "result-box err");
        b.appendChild(el("h5", "", e.name || "Error"));
        var pre = el("pre");
        var text = (e.name ? e.name + ": " : "") + e.message;
        if (e.source) text += " (" + e.source + "#" + e.line + ")";
        pre.appendChild(document.createTextNode(text));
        if (e.lineSource && e.lineSource.trim()) {
            pre.appendChild(el("div", "src", "\n" + e.line + " | " + e.lineSource.replace(/^\(function\([^)]*\)\{/, "")));
        }
        b.appendChild(pre);
        return b;
    }

    function markErrors(results) {
        var markers = [];
        results.forEach(function (r) {
            var e = r.res.error;
            if (!e || !e.line || e.line < 1) return;
            if (e.source && /^input:/.test(e.source)) return;
            var line = Math.min(e.line, editor.getModel().getLineCount());
            markers.push({
                severity: monaco.MarkerSeverity.Error,
                message: "[" + ENGINE_LABEL[r.engine] + "] " + e.name + ": " + e.message,
                startLineNumber: line, endLineNumber: line,
                startColumn: 1, endColumn: editor.getModel().getLineMaxColumn(line)
            });
        });
        monaco.editor.setModelMarkers(editor.getModel(), "vro", markers);
        if (markers.length) editor.revealLineInCenterIfOutsideViewport(markers[0].startLineNumber);
    }

    // ---------------------------------------------------------------- theme

    function isDark() {
        var t = document.documentElement.getAttribute("data-theme");
        if (t) return t === "dark";
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    function applyMonacoTheme() {
        if (window.monaco) monaco.editor.setTheme(isDark() ? "vs-dark" : "vs");
    }
    try {
        var savedTheme = localStorage.getItem("cbe.theme");
        if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);
    } catch (e) { /* ignore */ }
    byId("themeBtn").addEventListener("click", function () {
        var next = isDark() ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        try { localStorage.setItem("cbe.theme", next); } catch (e) { /* ignore */ }
        applyMonacoTheme();
    });
    if (window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyMonacoTheme);
    }

    // ------------------------------------------------------------- splitter

    (function () {
        var splitter = byId("splitter"), panel = byId("panel"), dragging = false;
        splitter.addEventListener("pointerdown", function (e) {
            dragging = true;
            splitter.setPointerCapture(e.pointerId);
        });
        splitter.addEventListener("pointermove", function (e) {
            if (!dragging) return;
            var ws = document.querySelector(".workspace").getBoundingClientRect();
            var h = Math.max(120, Math.min(ws.bottom - e.clientY, ws.height - 140));
            panel.style.flex = "0 0 " + h + "px";
            if (editor) editor.layout();
        });
        splitter.addEventListener("pointerup", function () { dragging = false; });
    })();

    // --------------------------------------------------------------- monaco

    var VRO_DTS = [
        "declare var System: { log(m: any): void; warn(m: any): void; error(m: any): void; debug(m: any): void;",
        "  sleep(ms: number): void; getCurrentTime(): number; nextUUID(): string; formatDate(d: Date, pattern?: string): string;",
        "  getModule(name: string): any; getContext(): { getParameter(k: string): any; setParameter(k: string, v: any): void };",
        "  getTempDirectory(): string; };",
        "declare var Server: { log(m: any): void; warn(m: any): void; error(m: any): void;",
        "  getConfigurationElementCategoryWithPath(path: string): { name: string; path: string; configurationElements: ConfigurationElement[] } | null;",
        "  createConfigurationElement(categoryPath: string, name: string): ConfigurationElement;",
        "  getResourceElementCategoryWithPath(path: string): { name: string; resourceElements: ResourceElement[] } | null;",
        "  findForType(type: string, id: string): any; findAllForType(type: string): any[]; };",
        "interface ConfigurationElement { name: string; path: string; attributes: { name: string; value: any }[];",
        "  getAttributeWithKey(k: string): { name: string; value: any } | null; setAttributeWithKey(k: string, v: any): void; }",
        "interface ResourceElement { name: string; mimeType: string; getContentAsMimeAttachment(): MimeAttachment; }",
        "declare class MimeAttachment { constructor(name?: string, content?: string, mimeType?: string); name: string; content: string; mimeType: string; }",
        "declare class Properties { put(k: string, v: any): void; get(k: string): any; remove(k: string): any; keys(): string[]; values(): any[]; containsKey(k: string): boolean; size(): number; }",
        "interface VcTask { info: { state: { value: string }; result: any; error: any; name: string }; }",
        "interface VcVirtualMachine { name: string; id: string; runtime: { powerState: { value: string } };",
        "  config: { hardware: { numCPU: number; memoryMB: number }; guestFullName: string; annotation: string; template: boolean };",
        "  guest: { ipAddress: string; hostName: string; toolsRunningStatus: string };",
        "  powerOnVM_Task(host?: any): VcTask; powerOffVM_Task(): VcTask; suspendVM_Task(): VcTask; resetVM_Task(): VcTask;",
        "  shutdownGuest(): void; rebootGuest(): void; reconfigVM_Task(spec: VcVirtualMachineConfigSpec): VcTask;",
        "  rename_Task(name: string): VcTask; destroy_Task(): VcTask; createSnapshot_Task(name: string, desc?: string, memory?: boolean, quiesce?: boolean): VcTask; }",
        "declare class VcVirtualMachineConfigSpec { numCPUs: number; memoryMB: number; annotation: string; }",
        "declare var VcPlugin: { allSdkConnections: any[]; getAllVirtualMachines(props?: string[] | null, xpath?: string): VcVirtualMachine[];",
        "  getAllHostSystems(): any[]; getAllClusterComputeResources(): any[]; getAllDatacenters(): any[]; getAllDatastores(): any[]; getAllNetworks(): any[]; };",
        "declare class RESTHost { constructor(name: string); name: string; url: string; createRequest(method: string, url: string, content?: string | null): RESTRequest; }",
        "interface RESTRequest { contentType: string; setHeader(k: string, v: string): void; execute(): RESTResponse; }",
        "interface RESTResponse { statusCode: number; contentAsString: string; getAllHeaders(): Properties; }",
        "declare var RESTHostManager: { createHost(name: string): RESTHost; createTransientHostFrom(h: RESTHost): RESTHost; getHosts(): string[]; getHost(id: string): RESTHost; };",
        "declare var LockingSystem: { lock(id: string, owner: string): boolean; lockAndWait(id: string, owner: string): void; unlock(id: string, owner: string): void; unlockAll(): void; retrieveAll(): string[]; };",
        "declare var java: any;"
    ].join("\n");

    function initMonaco() {
        return new Promise(function (resolve) {
            require.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs" } });
            require(["vs/editor/editor.main"], function () {
                // Rhino is the judge of syntax (E4X, for each, JS 1.7) — Monaco only colours.
                monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                    noSemanticValidation: true, noSyntaxValidation: true
                });
                monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                    target: monaco.languages.typescript.ScriptTarget.ES2017, allowNonTsExtensions: true, noLib: false
                });
                monaco.languages.typescript.javascriptDefaults.addExtraLib(VRO_DTS, "vro.d.ts");

                var initial = state.code;
                if (initial === null || initial === undefined) {
                    var s = findSample(state.sample) || window.VRO_SAMPLES[0].items[0];
                    initial = s.code;
                }
                editor = monaco.editor.create(byId("editor"), {
                    value: initial,
                    language: "javascript",
                    theme: isDark() ? "vs-dark" : "vs",
                    automaticLayout: true,
                    fontFamily: "IBM Plex Mono, Consolas, monospace",
                    fontSize: 13.5,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    tabSize: 4
                });
                editor.onDidChangeModelContent(function () {
                    state.code = editor.getValue();
                    save();
                });
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function () { run([state.version]); });
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, function () { run(["8x", "9x"]); });
                resolve();
            });
        });
    }

    function initFixtureEditor() {
        fixtureEditor = monaco.editor.create(byId("fixtureEditor"), {
            value: state.fixtureText || defaultFixtureText,
            language: "json",
            theme: isDark() ? "vs-dark" : "vs",
            automaticLayout: true,
            fontFamily: "IBM Plex Mono, Consolas, monospace",
            fontSize: 12.5,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            tabSize: 2
        });
        fixtureEditor.onDidChangeModelContent(function () {
            var v = fixtureEditor.getValue();
            state.fixtureText = v === defaultFixtureText ? null : v;
            save();
        });
        byId("resetFixture").addEventListener("click", function () {
            fixtureEditor.setValue(defaultFixtureText);
            state.fixtureText = null;
            els.fixtureError.textContent = "";
            save();
        });
    }

    // ----------------------------------------------------------------- engine

    function initEngine() {
        if (typeof cheerpjInit !== "function") {
            return Promise.reject(new Error("CheerpJ runtime could not be loaded (blocked network or ad blocker?)"));
        }
        setStatus("busy", "Starting Java runtime…");
        return cheerpjInit({ status: "none" })
            .then(function () {
                setStatus("busy", "Loading Rhino engines…");
                return cheerpjRunLibrary("/app/engines/launcher.jar");
            })
            .then(function (lib) { return lib.vroconsole.Launcher; })
            .then(function (L) {
                // Load the selected engine first, then the other one in the background.
                var first = state.version, second = first === "8x" ? "9x" : "8x";
                return L.warm(first).then(function (r) {
                    if (String(r) !== "ok") throw new Error(String(r));
                    launcher = L;
                    setStatus("ready", "Engines ready");
                    refreshButtons();
                    return L.warm(second);
                });
            });
    }

    // ------------------------------------------------------------------ boot

    function fetchText(url) {
        return fetch(url, { cache: "no-cache" }).then(function (r) {
            if (!r.ok) throw new Error(url + ": HTTP " + r.status);
            return r.text();
        });
    }

    renderSidebar();
    renderIo();
    onModeChange();

    Promise.all([
        fetchText("engine/vro-mocks.js"),
        fetchText("engine/profiles.json"),
        fetchText("engine/fixture.default.json")
    ]).then(function (texts) {
        mocksSource = texts[0];
        profiles = JSON.parse(texts[1]);
        defaultFixtureText = texts[2].replace(/\s+$/, "") + "\n";
        return initMonaco();
    }).then(function () {
        initFixtureEditor();
        return initEngine();
    }).catch(function (e) {
        console.error(e);
        setStatus("error", e.message || String(e));
    });
})();
