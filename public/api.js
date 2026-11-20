/*
 * Cloudblogger Editor — Orchestrator API catalog in the editor.
 *
 *  - API Explorer: plug-in -> class -> attribute / method tree with search,
 *    details in the "API" tab and insert-into-editor.
 *  - Monaco autocomplete, hover docs and signature help from generated .d.ts
 *    files, loaded per plug-in when a script uses one of its classes.
 *  - The list of catalog classes a script names, for the engine's runtime stubs.
 *
 * Data: public/catalog/ (built by engine/catalog/build-catalog.js from modernvroapi.in).
 */
(function () {
    "use strict";

    var SITE = "https://modernvroapi.in";
    var index = null;            // catalog.json
    var base = "";               // catalog/v-<hash>/
    var details = {};            // plugin id -> Promise<{ name: entry }>
    var dtsLoaded = {};          // plugin id -> Promise
    var stubsText = null;        // Promise<string> (member search)
    var monacoRef = null, editorRef = null;
    var hooks = { showApiTab: function () {} };

    function byId(id) { return document.getElementById(id); }
    function el(tag, cls, text) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text !== undefined && text !== null) e.textContent = text;
        return e;
    }

    function fetchJson(url) {
        return fetch(url).then(function (r) {
            if (!r.ok) throw new Error(url + ": HTTP " + r.status);
            return r.json();
        });
    }
    function fetchText(url) {
        return fetch(url).then(function (r) {
            if (!r.ok) throw new Error(url + ": HTTP " + r.status);
            return r.text();
        });
    }

    function pluginOf(cls) {
        var i = index && index.classes[cls];
        return i === undefined ? null : index.plugins[i];
    }

    // ------------------------------------------------------------ catalog data

    function load() {
        return fetchJson("catalog/catalog.json").then(function (ix) {
            index = ix;
            base = "catalog/" + ix.dir + "/";
            return ix;
        });
    }

    function detailOf(pluginId) {
        if (!details[pluginId]) {
            details[pluginId] = fetchJson(base + "plugins/" + pluginId + ".json").then(function (list) {
                var map = {};
                list.forEach(function (c) { map[c.n] = c; });
                return map;
            });
        }
        return details[pluginId];
    }

    function classDetail(name) {
        var p = pluginOf(name);
        if (!p) return Promise.resolve(null);
        return detailOf(p.id).then(function (m) { return m[name] || null; });
    }

    function stubs() {
        if (!stubsText) stubsText = fetchText(base + "stubs.txt");
        return stubsText;
    }

    function referencedClasses(texts) {
        if (!index) return [];
        return window.VroRequest.referencedClasses(texts, index.classes, index.builtins);
    }

    // ---------------------------------------------------------------- Monaco

    function loadDts(pluginId) {
        if (!dtsLoaded[pluginId]) {
            dtsLoaded[pluginId] = fetchText(base + "dts/" + pluginId + ".d.ts").then(function (text) {
                monacoRef.languages.typescript.javascriptDefaults.addExtraLib(text, "ts:catalog/" + pluginId + ".d.ts");
            }).catch(function (e) {
                dtsLoaded[pluginId] = null;
                console.warn("API types for " + pluginId + " not loaded:", e);
            });
        }
        return dtsLoaded[pluginId];
    }

    function loadDtsFor(text) {
        var need = {};
        referencedClasses([text]).forEach(function (c) {
            var p = pluginOf(c);
            if (p && !dtsLoaded[p.id]) need[p.id] = 1;
        });
        Object.keys(need).forEach(loadDts);
    }

    function attachMonaco(monaco, editor) {
        monacoRef = monaco;
        editorRef = editor;
        index.plugins.forEach(function (p) { if (p.eager) loadDts(p.id); });
        loadDtsFor(editor.getValue());

        var t = null;
        editor.onDidChangeModelContent(function () {
            clearTimeout(t);
            t = setTimeout(function () { loadDtsFor(editor.getValue()); }, 700);
        });

        // Class names from plug-ins whose types are not loaded yet (vCenter, vAPI, Aria Automation).
        var names = Object.keys(index.classes);
        monaco.languages.registerCompletionItemProvider("javascript", {
            provideCompletionItems: function (model, pos) {
                var word = model.getWordUntilPosition(pos);
                if (!word || word.word.length < 2) return { suggestions: [] };
                var before = model.getLineContent(pos.lineNumber).substring(0, word.startColumn - 1);
                if (/\.\s*$/.test(before)) return { suggestions: [] };
                var w = word.word.toLowerCase();
                var range = { startLineNumber: pos.lineNumber, endLineNumber: pos.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn };
                var out = [];
                for (var i = 0; i < names.length && out.length < 80; i++) {
                    var n = names[i];
                    if (n.toLowerCase().indexOf(w) !== 0) continue;
                    var p = pluginOf(n);
                    if (!p || dtsLoaded[p.id] || index.builtins.indexOf(n) !== -1) continue;
                    out.push({
                        label: n,
                        kind: monaco.languages.CompletionItemKind.Class,
                        detail: p.name,
                        insertText: n,
                        range: range,
                        sortText: "~" + n
                    });
                }
                return { suggestions: out };
            }
        });

        editor.addAction({
            id: "cbe.openInExplorer",
            label: "Open in API Explorer",
            contextMenuGroupId: "navigation",
            contextMenuOrder: 0.5,
            run: function (ed) {
                var model = ed.getModel();
                var w = model.getWordAtPosition(ed.getPosition());
                if (!w) return;
                if (pluginOf(w.word)) openClass(w.word);
                else { setNavMode("api"); var s = byId("apiSearch"); s.value = w.word; search(w.word); }
            }
        });
    }

    // ------------------------------------------------------------- insertion

    function sig(params) {
        return (params || []).map(function (p) { return p[0]; }).join(", ");
    }

    function insert(text, member) {
        if (!editorRef) return;
        var ed = editorRef;
        var sel = ed.getSelection();
        var model = ed.getModel();
        var before = model.getLineContent(sel.startLineNumber).substring(0, sel.startColumn - 1);
        if (member && /\.\s*$/.test(before)) text = member;
        ed.executeEdits("api-explorer", [{ range: sel, text: text, forceMoveMarkers: true }]);
        ed.focus();
    }

    // ---------------------------------------------------------- API tab body

    function typeLink(t) {
        var span = el("span", "api-type");
        var m = /^(Array\/)?([\w$]+)((?:\[\])*)$/.exec(String(t || ""));
        if (m && pluginOf(m[2]) && index.builtins.indexOf(m[2]) === -1) {
            var a = el("a", null, m[2]);
            a.href = "#";
            a.addEventListener("click", function (e) { e.preventDefault(); openClass(m[2]); });
            if (m[1]) span.appendChild(document.createTextNode("Array/"));
            span.appendChild(a);
            if (m[3]) span.appendChild(document.createTextNode(m[3]));
        } else {
            span.textContent = t || "void";
        }
        return span;
    }

    function paramNodes(params) {
        var f = document.createDocumentFragment();
        f.appendChild(document.createTextNode("("));
        (params || []).forEach(function (p, i) {
            if (i) f.appendChild(document.createTextNode(", "));
            f.appendChild(el("span", "api-pname", p[0]));
            f.appendChild(document.createTextNode(": "));
            f.appendChild(typeLink(p[1]));
        });
        f.appendChild(document.createTextNode(")"));
        return f;
    }

    var current = null;

    function openClass(name, member) {
        var p = pluginOf(name);
        if (!p) return;
        setNavMode("api");
        markExplorer(name);
        hooks.showApiTab();
        var body = byId("apiDetail");
        body.innerHTML = "";
        body.appendChild(el("div", "api-loading", "Loading " + name + "…"));
        classDetail(name).then(function (c) {
            if (!c) { body.textContent = name + " not found."; return; }
            current = name;
            renderClass(body, c, p, member);
        }).catch(function (e) {
            body.textContent = "Could not load " + p.name + ": " + e.message;
        });
    }

    function renderClass(body, c, p, member) {
        body.innerHTML = "";
        var head = el("div", "api-head");
        head.appendChild(el("h4", null, c.n));
        head.appendChild(el("span", "api-plugin", p.name));
        var ins = el("button", "cbe-link", "Insert");
        ins.addEventListener("click", function () { insert(c.n); });
        head.appendChild(ins);
        var site = el("a", "api-site", "modernvroapi.in");
        site.href = SITE + "/plugin/" + encodeURIComponent(p.id) + "/class/" + encodeURIComponent(c.n);
        site.target = "_blank";
        site.rel = "noopener";
        head.appendChild(site);
        body.appendChild(head);
        if (c.d) body.appendChild(el("p", "api-desc", c.d));

        function section(title, rows) {
            if (!rows.length) return;
            body.appendChild(el("h5", "api-sec", title + " (" + rows.length + ")"));
            var list = el("div", "api-list");
            rows.forEach(function (r) { list.appendChild(r); });
            body.appendChild(list);
        }

        section("Constructors", (c.c || []).map(function (k) {
            var row = el("div", "api-row");
            var s = el("code", "api-sig");
            s.appendChild(document.createTextNode("new " + c.n));
            s.appendChild(paramNodes(k));
            row.appendChild(s);
            var b = el("button", "cbe-link api-ins", "Insert");
            b.addEventListener("click", function () { insert("new " + c.n + "(" + sig(k) + ")"); });
            row.appendChild(b);
            return row;
        }));

        section("Attributes", (c.a || []).map(function (a) {
            var row = el("div", "api-row");
            row.dataset.member = a[0];
            var s = el("code", "api-sig");
            s.appendChild(el("span", "api-mname", a[0]));
            s.appendChild(document.createTextNode(": "));
            s.appendChild(typeLink(a[1]));
            row.appendChild(s);
            row.appendChild(el("span", "api-flag", a[2] ? "read-only" : "read/write"));
            var b = el("button", "cbe-link api-ins", "Insert");
            b.addEventListener("click", function () { insert(c.n + "." + a[0], a[0]); });
            row.appendChild(b);
            if (a[3]) row.appendChild(el("div", "api-mdesc", a[3]));
            return row;
        }));

        section("Methods", (c.m || []).map(function (m) {
            var row = el("div", "api-row");
            row.dataset.member = m[0];
            var s = el("code", "api-sig");
            s.appendChild(el("span", "api-mname", m[0]));
            s.appendChild(paramNodes(m[2]));
            s.appendChild(document.createTextNode(" : "));
            s.appendChild(typeLink(m[1]));
            row.appendChild(s);
            var b = el("button", "cbe-link api-ins", "Insert");
            var call = m[0] + "(" + sig(m[2]) + ")";
            b.addEventListener("click", function () { insert(c.n + "." + call, call); });
            row.appendChild(b);
            if (m[3]) row.appendChild(el("div", "api-mdesc", m[3]));
            return row;
        }));

        if (!(c.a || []).length && !(c.m || []).length && !(c.c || []).length) {
            body.appendChild(el("p", "api-desc", "No attributes or methods documented."));
        }
        body.scrollTop = 0;
        if (member) {
            var target = body.querySelector('[data-member="' + member.replace(/"/g, "") + '"]');
            if (target) {
                target.classList.add("hit");
                target.scrollIntoView({ block: "center" });
            }
        }
    }

    // -------------------------------------------------------------- explorer

    var navMode = "scripts";
    function setNavMode(mode) {
        navMode = mode;
        byId("nav").classList.toggle("api", mode === "api");
        Array.prototype.forEach.call(document.querySelectorAll(".cbe-nav-tabs button"), function (b) {
            b.setAttribute("aria-selected", String(b.dataset.mode === mode));
        });
        byId("sidebar").hidden = mode !== "scripts";
        byId("apiExplorer").hidden = mode !== "api";
        if (mode === "api" && !byId("apiTree").childNodes.length) renderTree();
    }

    function markExplorer(name) {
        Array.prototype.forEach.call(document.querySelectorAll("#apiExplorer .api-cls"), function (b) {
            b.classList.toggle("active", b.dataset.cls === name);
        });
    }

    var CHUNK = 200;
    function classButton(name, label, tag) {
        var b = el("button", "cbe-nav-link api-cls");
        b.dataset.cls = name;
        b.textContent = label || name;
        b.title = label || name;
        if (tag) b.appendChild(el("span", "tag", tag));
        b.addEventListener("click", function () {
            var dot = (label || "").indexOf(".");
            openClass(name, dot > 0 ? label.substring(dot + 1).replace(/\(\)$/, "") : null);
        });
        return b;
    }

    function renderList(container, items, make) {
        var shown = 0;
        function more() {
            var end = Math.min(items.length, shown + CHUNK);
            for (; shown < end; shown++) container.appendChild(make(items[shown]));
            if (shown < items.length) {
                var m = el("button", "cbe-link api-more", "Show " + Math.min(CHUNK, items.length - shown) + " more of " + (items.length - shown));
                m.addEventListener("click", function () { m.remove(); more(); });
                container.appendChild(m);
            }
        }
        more();
    }

    function classesOf(pi) {
        var out = [];
        Object.keys(index.classes).forEach(function (n) { if (index.classes[n] === pi && index.builtins.indexOf(n) === -1) out.push(n); });
        return out.sort(function (a, b) { return a.toLowerCase() < b.toLowerCase() ? -1 : 1; });
    }

    function renderTree() {
        var tree = byId("apiTree");
        tree.innerHTML = "";
        index.plugins.forEach(function (p, pi) {
            var g = el("button", "cbe-nav-group api-plugin-btn");
            g.setAttribute("aria-expanded", "false");
            g.appendChild(el("span", "chev", "▸"));
            g.appendChild(document.createTextNode(p.name));
            g.appendChild(el("span", "tag", String(p.classes)));
            var box = el("div", "api-classes");
            box.hidden = true;
            g.addEventListener("click", function () {
                var open = box.hidden;
                box.hidden = !open;
                g.setAttribute("aria-expanded", String(open));
                g.querySelector(".chev").textContent = open ? "▾" : "▸";
                if (open && !box.childNodes.length) renderList(box, classesOf(pi), function (n) { return classButton(n); });
            });
            tree.appendChild(g);
            tree.appendChild(box);
        });
    }

    var searchSeq = 0;
    function search(q) {
        q = String(q || "").trim();
        var tree = byId("apiTree"), res = byId("apiResults");
        if (q.length < 2) {
            res.hidden = true;
            tree.hidden = false;
            return;
        }
        tree.hidden = true;
        res.hidden = false;
        res.innerHTML = "";
        var seq = ++searchSeq;
        var ql = q.toLowerCase();
        var dot = ql.indexOf(".");
        var clsQ = dot >= 0 ? ql.substring(0, dot) : ql;
        var memQ = dot >= 0 ? ql.substring(dot + 1) : ql;

        // Classes first (prefix matches ahead of substring matches).
        var cls = [];
        if (dot < 0) {
            Object.keys(index.classes).forEach(function (n) {
                if (index.builtins.indexOf(n) !== -1) return;
                var i = n.toLowerCase().indexOf(ql);
                if (i !== -1) cls.push({ n: n, rank: i === 0 ? 0 : 1 });
            });
            cls.sort(function (a, b) { return a.rank - b.rank || a.n.length - b.n.length || (a.n < b.n ? -1 : 1); });
        }
        var head = el("div", "api-res-h", "Searching…");
        res.appendChild(head);
        var clsBox = el("div");
        res.appendChild(clsBox);
        renderList(clsBox, cls, function (c) { return classButton(c.n, null, pluginOf(c.n).name); });

        // Members from the stub catalog (name only), e.g. "powerOn" or "VcVirtualMachine.power".
        stubs().then(function (text) {
            if (seq !== searchSeq) return;
            var mem = [];
            var lines = text.split("\n");
            for (var i = 0; i < lines.length && mem.length < 2000; i++) {
                var f = lines[i].split("\t");
                if (f.length < 4) continue;
                if (dot >= 0 && f[0].toLowerCase().indexOf(clsQ) !== 0) continue;
                [[f[2], ""], [f[3], "()"]].forEach(function (part) {
                    if (!part[0]) return;
                    part[0].split("|").forEach(function (x) {
                        var name = x.split(":")[0];
                        if (memQ && name.toLowerCase().indexOf(memQ) === -1) return;
                        mem.push(f[0] + "." + name + part[1]);
                    });
                });
            }
            head.textContent = cls.length + " classes · " + (mem.length >= 2000 ? "2000+" : mem.length) + " members";
            if (mem.length) {
                res.appendChild(el("div", "api-res-h", "Members"));
                var memBox = el("div");
                res.appendChild(memBox);
                renderList(memBox, mem, function (label) { return classButton(label.split(".")[0], label); });
            }
        }).catch(function () {
            head.textContent = cls.length + " classes (member search unavailable)";
        });
    }

    function initExplorer() {
        Array.prototype.forEach.call(document.querySelectorAll(".cbe-nav-tabs button"), function (b) {
            b.addEventListener("click", function () { setNavMode(b.dataset.mode); });
        });
        var t = null;
        byId("apiSearch").addEventListener("input", function (e) {
            clearTimeout(t);
            var v = e.target.value;
            t = setTimeout(function () { search(v); }, 200);
        });
        var info = byId("apiSource");
        if (info) {
            info.textContent = index.totals.classes.toLocaleString() + " classes · " + index.plugins.length + " plug-ins · data from ";
            var a = el("a", null, "modernvroapi.in");
            a.href = SITE;
            a.target = "_blank";
            a.rel = "noopener";
            info.appendChild(a);
        }
    }

    window.CbeApi = {
        load: function (h) {
            hooks = h || hooks;
            return load().then(function () { initExplorer(); });
        },
        attachMonaco: attachMonaco,
        referencedClasses: referencedClasses,
        stubsPath: function () { return index ? "/app/" + base + "stubs.txt" : ""; },
        openClass: openClass,
        ready: function () { return !!index; }
    };
})();
