/*
 * vRO scripting API mocks.
 *
 * This file is NOT run by the browser. It is passed to the real Rhino engine
 * (1.7R4, 1.7.15 or 1.9.1) and evaluated in the root scope before your script,
 * so it must stay plain ES5 that every engine accepts.
 *
 * The engine provides one host object, __vroHost:
 *   __vroHost.log(level, message)   append a line to the log pane
 *   __vroHost.now()                 epoch millis
 *   __vroHost.sleep(ms)             sleep, bounded by the run timeout
 *   __vroHost.engineVersion         e.g. "Rhino 1.7 release 4 2012 06 18"
 *   __vroHost.languageVersion       170 (8.x) or 200 (9.x)
 *   __vroHost.flags                 profile switches, e.g. flags.console, flags.commandDisabled
 *
 * __vroFixture (defined just before this file by the page) holds the editable
 * fake inventory: vCenter objects, configuration/resource elements, REST
 * routes and mock actions.
 *
 * Everything here is a mock. Calls never leave the browser.
 */
(function (global) {
    "use strict";

    var host = global.__vroHost;
    var fx = global.__vroFixture || {};

    function define(name, value) {
        Object.defineProperty(global, name, { value: value, writable: true, configurable: true, enumerable: false });
    }

    function str(v) {
        if (v === null) return "null";
        if (v === undefined) return "undefined";
        return String(v);
    }

    var uuidCounter = 0;
    function uuid() {
        uuidCounter++;
        var hex = "";
        for (var i = 0; i < 32; i++) hex += Math.floor(Math.random() * 16).toString(16);
        return hex.substr(0, 8) + "-" + hex.substr(8, 4) + "-4" + hex.substr(13, 3) + "-a" +
            hex.substr(17, 3) + "-" + hex.substr(20, 12);
    }

    function pad(n, w) {
        var s = String(n);
        while (s.length < (w || 2)) s = "0" + s;
        return s;
    }

    // java.text.SimpleDateFormat subset for System.formatDate: y M d H h k K m s S E a z Z, 'quoted text'.
    function formatDate(d, pattern) {
        var p = pattern || "yyyy-MM-dd'T'HH:mm:ss.SSSZ";
        var tz = -d.getTimezoneOffset();
        var tzs = (tz >= 0 ? "+" : "-") + pad(Math.floor(Math.abs(tz) / 60)) + pad(Math.abs(tz) % 60);
        var out = "", i = 0;
        while (i < p.length) {
            var c = p.charAt(i);
            if (c === "'") {
                if (p.charAt(i + 1) === "'") { out += "'"; i += 2; continue; }
                var j = p.indexOf("'", i + 1);
                if (j < 0) j = p.length;
                out += p.substring(i + 1, j);
                i = j + 1;
                continue;
            }
            var run = 1;
            while (p.charAt(i + run) === c) run++;
            var h = d.getHours();
            switch (c) {
                case "y": out += run === 2 ? pad(d.getFullYear() % 100) : pad(d.getFullYear(), run); break;
                case "M": out += run >= 4 ? MONTHS_LONG[d.getMonth()] : run === 3 ? MONTHS[d.getMonth()] : pad(d.getMonth() + 1, run); break;
                case "d": out += pad(d.getDate(), run); break;
                case "E": out += run >= 4 ? DAYS_LONG[d.getDay()] : DAYS[d.getDay()]; break;
                case "a": out += h < 12 ? "AM" : "PM"; break;
                case "H": out += pad(h, run); break;
                case "k": out += pad(h === 0 ? 24 : h, run); break;
                case "K": out += pad(h % 12, run); break;
                case "h": out += pad(h % 12 === 0 ? 12 : h % 12, run); break;
                case "m": out += pad(d.getMinutes(), run); break;
                case "s": out += pad(d.getSeconds(), run); break;
                case "S": out += pad(d.getMilliseconds(), 3); break;
                case "z": out += tz === 0 ? "GMT" : "GMT" + tzs.substring(0, 3) + ":" + tzs.substring(3); break;
                case "Z": out += tzs; break;
                default: out += new Array(run + 1).join(c);
            }
            i += run;
        }
        return out;
    }

    var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Inverse of formatDate for the same SimpleDateFormat subset (yyyy MM MMM dd HH mm ss SSS Z, 'quoted').
    function parseDate(text, pattern) {
        var p = String(pattern), re = "^", fields = [], i = 0;
        while (i < p.length) {
            var c = p.charAt(i);
            if (c === "'") {
                var j = p.indexOf("'", i + 1);
                if (j < 0) j = p.length;
                re += p.substring(i + 1, j).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                i = j + 1;
                continue;
            }
            var run = 1;
            while (p.charAt(i + run) === c) run++;
            if ("yMdHhmsSZ".indexOf(c) >= 0) {
                if (c === "M" && run >= 3) { re += "([A-Za-z]{3})[a-z]*"; fields.push("MMM"); }
                else if (c === "Z") { re += "([+-]\\d{4}|Z)"; fields.push("Z"); }
                else { re += "(\\d{1," + Math.max(run, c === "y" ? 4 : 2) + "})"; fields.push(c); }
            } else {
                re += new Array(run + 1).join(c).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            }
            i += run;
        }
        var m = new RegExp(re + "$").exec(String(text));
        if (!m) return null;
        var d = { y: 1970, M: 0, d: 1, H: 0, m: 0, s: 0, S: 0 }, tz = null;
        fields.forEach(function (f, k) {
            var v = m[k + 1];
            if (f === "MMM") d.M = MONTHS.indexOf(v.charAt(0).toUpperCase() + v.substr(1, 2).toLowerCase());
            else if (f === "M") d.M = parseInt(v, 10) - 1;
            else if (f === "Z") tz = v === "Z" ? 0 : (v.charAt(0) === "-" ? -1 : 1) * (parseInt(v.substr(1, 2), 10) * 60 + parseInt(v.substr(3, 2), 10));
            else if (f === "h") d.H = parseInt(v, 10);
            else d[f] = parseInt(v, 10);
        });
        if (d.M < 0) return null;
        if (tz === null) return new Date(d.y, d.M, d.d, d.H, d.m, d.s, d.S);
        return new Date(Date.UTC(d.y, d.M, d.d, d.H, d.m, d.s, d.S) - tz * 60000);
    }

    // ------------------------------------------------------------- System
    //
    // The core classes from here to Command follow the real o11n-core API.
    // Outputs were measured on Orchestrator 9.1.1 (build 25643527) so the mocks
    // return what a server returns (e.g. compareVersionNumber("1.2.10","1.2.9") is 3,
    // formatBinaryValue(2048) is "2.0K"). Several classes started from Stefan
    // Schnell's VCF Automation emulator (MIT, see THIRD_PARTY_NOTICES.md), adapted
    // to run without Java access inside this engine.

    var flags = host.flags || {};
    var contextParams = fx.context || {};
    var modules = {};
    var TEMP_DIR = "/usr/lib/vco/app-server/temp";
    var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var DAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December"];

    // Errors raised by Orchestrator's Java side surface in scripts as InternalError.
    function internalError(message) {
        var e = new Error(message);
        e.name = "InternalError";
        return e;
    }

    function required(name, v) {
        if (v === null || v === undefined || String(v).trim() === "") {
            throw new Error(name + " argument can not be undefined or null");
        }
    }

    function fmtNumber(value, pattern) {
        var p = String(pattern || "#,##0.###");
        var prefix = "", suffix = "", body = p;
        var m = /^([^#0,.]*)([#0,.]+)(.*)$/.exec(p);
        if (m) { prefix = m[1]; body = m[2]; suffix = m[3]; }
        var n = Number(value);
        if (suffix.indexOf("%") >= 0 || prefix.indexOf("%") >= 0) n = n * 100;
        var parts = body.split(".");
        var intPart = parts[0], fracPart = parts[1] || "";
        var minFrac = (fracPart.match(/0/g) || []).length;
        var maxFrac = fracPart.length;
        var minInt = (intPart.replace(/,/g, "").match(/0/g) || []).length;
        var grouping = intPart.indexOf(",") >= 0 ? intPart.length - intPart.lastIndexOf(",") - 1 : 0;
        var neg = n < 0;
        var s = Math.abs(n).toFixed(maxFrac);
        var ip = s.split(".")[0], fp = s.split(".")[1] || "";
        while (fp.length > minFrac && fp.charAt(fp.length - 1) === "0") fp = fp.substring(0, fp.length - 1);
        while (ip.length < minInt) ip = "0" + ip;
        if (minInt === 0 && ip === "0" && fp.length) ip = "";
        if (grouping > 0) {
            var g = "";
            for (var i = ip.length; i > 0; i -= grouping) {
                g = ip.substring(Math.max(0, i - grouping), i) + (g ? "," + g : "");
            }
            ip = g;
        }
        return (neg ? "-" : "") + prefix + ip + (fp.length ? "." + fp : "") + suffix;
    }

    function fmtDuration(ms, showMilli, showZero) {
        if (ms < 0) return "N/A";
        var days = Math.floor(ms / 86400000);
        var hours = Math.floor(ms / 3600000) % 24;
        var mins = Math.floor(ms / 60000) % 60;
        var secs = Math.floor(ms / 1000) % 60;
        var parts = [];
        var started = !!showZero;
        if (started || days) { parts.push(days + "d"); started = true; }
        if (started || hours) { parts.push(pad(hours) + "h"); started = true; }
        if (started || mins) { parts.push(pad(mins) + "m"); started = true; }
        parts.push(pad(secs) + (showMilli ? "." + pad(ms % 1000, 3) : "") + "s");
        return parts.join(" ");
    }

    // Natural-language dates as System.getDate understands them: "now", "today",
    // "tomorrow", "yesterday", "in 2 hours", "3 days ago"; otherwise a parsable date.
    function naturalDate(input, ref) {
        var base = ref instanceof Date ? ref.getTime() : host.now();
        var s = String(input).trim().toLowerCase();
        var noon = function (offsetDays) {
            var d = new Date(base + offsetDays * 86400000);
            d.setUTCHours(12, 0, 0, 0);
            return d;
        };
        if (s === "now") return new Date(base);
        if (s === "today") return noon(0);
        if (s === "tomorrow") return noon(1);
        if (s === "yesterday") return noon(-1);
        var unitMs = { second: 1000, minute: 60000, hour: 3600000, day: 86400000, week: 604800000 };
        var m = /^in\s+(\d+)\s+(second|minute|hour|day|week)s?$/.exec(s);
        if (m) return new Date(base + Number(m[1]) * unitMs[m[2]]);
        m = /^(\d+)\s+(second|minute|hour|day|week)s?\s+ago$/.exec(s);
        if (m) return new Date(base - Number(m[1]) * unitMs[m[2]]);
        var t = Date.parse(input);
        return isNaN(t) ? null : new Date(t);
    }

    // Fake DNS from the mock inventory (VM hostnames and IPs, vCenter and REST hosts).
    function dnsEntries() {
        var list = [];
        ((fx.vcenter && fx.vcenter.vcenters) || []).forEach(function (vc) {
            list.push({ name: vc.name, ip: vc.ip || null });
            (vc.vms || []).forEach(function (v) { if (v.hostname || v.ip) list.push({ name: v.hostname || v.name, ip: v.ip || null }); });
            (vc.hosts || []).forEach(function (h) { list.push({ name: h.name, ip: h.ip || null }); });
        });
        ((fx.rest && fx.rest.hosts) || []).forEach(function (h) {
            var hm = /^[a-z]+:\/\/([^\/:]+)/i.exec(h.url || "");
            if (hm) list.push({ name: hm[1], ip: null });
        });
        return list;
    }

    function classNameOf(o) {
        if (o === null || o === undefined) return String(o);
        if (typeof o === "string") return "String";
        if (typeof o === "number") return "Number";
        if (typeof o === "boolean") return "Boolean";
        if (o instanceof Properties) return "Properties";
        if (o.__vroClass) return o.__vroClass;
        if (o.__vroType && o.__vroType.indexOf("VC:") === 0) return "Vc" + o.__vroType.substring(3);
        if (o.__vroType) return o.__vroType.split(":").pop();
        if (Array.isArray(o)) return "Array";
        if (o instanceof Date) return "Date";
        return "Object";
    }

    var logMarker = null;

    var System = {
        log: function (m) { host.log("info", str(m)); },
        warn: function (m) { host.log("warning", str(m)); },
        error: function (m) { host.log("error", str(m)); },
        debug: function (m) { host.log("debug", str(m)); },
        // Goes to the server console, not the workflow log; shown here as a debug line.
        stdout: function (m) { host.log("debug", "[stdout] " + str(m)); },
        sleep: function (ms) { host.sleep(ms); return true; },
        getCurrentTime: function () { return host.now(); },
        nextUUID: function () { return uuid(); },
        formatDate: function (date, pattern) { return formatDate(date, pattern); },
        getDateFromFormat: function (text, pattern) {
            var d = parseDate(text, pattern);
            if (d === null) {
                throw internalError("Unable to parse date [" + text + "] using pattern : " + pattern);
            }
            return d;
        },
        getDate: function (input, refDate) { required("input", input); return naturalDate(input, refDate); },
        formatNumber: function (n, pattern) { required("aNumber", n); return fmtNumber(n, pattern); },
        formatDuration: function (ms, showMilli, showZero) { return fmtDuration(Number(ms), showMilli === true, showZero === true); },
        formatBinaryValue: function (v) {
            var n = Number(v);
            var units = ["K", "M", "G", "T", "P"];
            if (n < 1024) return String(n);
            var i = -1;
            do { n = n / 1024; i++; } while (n >= 1024 && i < units.length - 1);
            return n.toFixed(1) + units[i];
        },
        hexToDecimal: function (v) { return parseInt(String(v), 16); },
        decimalToHex: function (v) { return Number(v).toString(16).toUpperCase(); },
        compareVersionNumber: function (v1, v2) {
            required("v1", v1); required("v2", v2);
            var a = String(v1).split("."), b = String(v2).split(".");
            for (var i = 0; i < Math.max(a.length, b.length); i++) {
                var x = i < a.length ? parseInt(a[i], 10) : -1;
                var y = i < b.length ? parseInt(b[i], 10) : -1;
                if (x > y) return i + 1;
                if (x < y) return -(i + 1);
            }
            return 0;
        },
        extractDirectory: function (p) { var s = normPath(p); return s.substring(0, s.lastIndexOf("/") + 1); },
        extractFileName: function (p) { var s = normPath(p); return s.substring(s.lastIndexOf("/") + 1); },
        extractFileNameExtension: function (p) {
            var n = System.extractFileName(p);
            return n.indexOf(".") >= 0 ? n.substring(n.lastIndexOf(".") + 1) : "";
        },
        extractFileNameWithoutExtension: function (p) {
            var n = System.extractFileName(p);
            return System.extractDirectory(p) + (n.indexOf(".") >= 0 ? n.substring(0, n.lastIndexOf(".")) : n);
        },
        appendToPath: function (root, toAdd) {
            required("rootPath", root); required("toAdd", toAdd);
            return normPath(String(root).replace(/[\/\\]+$/, "") + "/" + String(toAdd).replace(/^[\/\\]+/, ""));
        },
        getTempDirectory: function () { return TEMP_DIR; },
        createTempFile: function (suffix) {
            var f = new File(TEMP_DIR + "/vco-" + Math.floor(Math.random() * 1e15) + (suffix || ".tmp"));
            f.createFile();
            return f;
        },
        getOsName: function () { return "Linux"; },
        setLogMarker: function (marker) { logMarker = marker; },
        getModule: function (name) {
            var m = modules[name];
            if (!m) {
                throw new Error("Module '" + name + "' not found. Add it under Mocks > Actions to stub it.");
            }
            return m;
        },
        getAllModules: function () {
            return Object.keys(modules).sort().map(function (n) {
                var mod = { name: n, id: n, actionDescriptions: Object.keys(modules[n]).map(function (a) { return { name: a, module: n }; }) };
                Object.defineProperty(mod, "__vroClass", { value: "Module" });
                mod.toString = function () { return n; };
                return mod;
            });
        },
        getContext: function () {
            return {
                getParameter: function (k) { return contextParams[k] === undefined ? null : contextParams[k]; },
                setParameter: function (k, v) { contextParams[k] = v; },
                parameterNames: function () { return Object.keys(contextParams); }
            };
        },
        // Outside a workflow (as here, an action run) the item is empty, as on a real server.
        currentWorkflowItem: function () {
            return { getName: function () { return ""; }, getDisplayName: function () { return ""; }, toString: function () { return "WorkflowItemInfo"; } };
        },
        waitUntil: function (date, period) {
            if (!(date instanceof Date)) throw new Error("waitDate argument must be a Date");
            var ms = date.getTime() - host.now();
            if (ms > 0) host.sleep(ms);
            return true;
        },
        sendCustomEvent: function (key) { required("eventKey", key); host.log("debug", "[mock] custom event sent: " + key); },
        waitCustomEventUntil: function (key, name, endDate) {
            host.log("debug", "[mock] no custom events arrive in the console; waitCustomEventUntil returns null");
            return null;
        },
        customEventUrl: function (name, secure) {
            return new URL((secure ? "https" : "http") + "://0.0.0.0:8280/vmware-vmo-webcontrol/SendCustomEvent?EventName=" + encodeURIComponent(name));
        },
        customEventUrlforServer: function (name, hostName, port, secure) {
            return new URL((secure ? "https" : "http") + "://" + hostName + ":" + port + "/vmware-vmo-webcontrol/SendCustomEvent?EventName=" + encodeURIComponent(name));
        },
        isHostReachable: function (hostOrIp, timeout) {
            var h = String(hostOrIp).toLowerCase();
            return dnsEntries().some(function (e) { return String(e.name).toLowerCase() === h || e.ip === h; });
        },
        resolveHostName: function (name) {
            var n = String(name).toLowerCase();
            var hit = dnsEntries().filter(function (e) { return String(e.name).toLowerCase() === n && e.ip; })[0];
            return hit ? hit.ip : null;
        },
        resolveIpAddress: function (ip) {
            if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(String(ip))) throw internalError("Invalid IP address: " + ip);
            var hit = dnsEntries().filter(function (e) { return e.ip === String(ip); })[0];
            if (!hit) throw internalError("Cannot resolve host for address: " + ip);
            return hit.name;
        },
        getObjectClassName: function (o) { return classNameOf(o); },
        getObjectType: function (o) { return o && o.__vroType ? o.__vroType : classNameOf(o); },
        getObjectPluginName: function (o) {
            return o && o.__vroType && o.__vroType.indexOf(":") > 0 ? o.__vroType.split(":")[0] : "Server";
        },
        getObjectId: function (o) {
            if (o && o.__vroType && o.__vroType.indexOf("VC:") === 0 && o.sdkConnection) return o.sdkConnection.id + "," + o.id;
            return o && o.id !== undefined ? String(o.id) : "{}";
        },
        isNotFound: function (o) { return false; },
        filterAuthorized: function (o) { return o; },
        toString: function () { return "System"; }
    };
    define("System", System);

    // Orchestrator 9.0 has a console object; 8.x and 9.1.1 do not (measured on 9.1.1).
    if (flags.console) {
        define("console", {
            log: function () { host.log("info", Array.prototype.map.call(arguments, str).join(" ")); },
            info: function () { host.log("info", Array.prototype.map.call(arguments, str).join(" ")); },
            warn: function () { host.log("warning", Array.prototype.map.call(arguments, str).join(" ")); },
            error: function () { host.log("error", Array.prototype.map.call(arguments, str).join(" ")); },
            debug: function () { host.log("debug", Array.prototype.map.call(arguments, str).join(" ")); }
        });
    }

    // ---------------------------------------------------------- Properties

    // Entries are own properties, so p.key works as well as p.get("key") (as on a server).
    function Properties() {}
    var hasOwn = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };
    Properties.prototype = {
        constructor: Properties,
        put: function (k, v) { this[k] = v; },
        get: function (k) { return hasOwn(this, k) ? this[k] : null; },
        remove: function (k) { var v = this.get(k); delete this[k]; return v; },
        keys: function () { return Object.keys(this); },
        values: function () { var self = this; return Object.keys(this).map(function (k) { return self[k]; }); },
        containsKey: function (k) { return hasOwn(this, k); },
        size: function () { return Object.keys(this).length; },
        isEmpty: function () { return this.size() === 0; },
        clear: function () { var self = this; Object.keys(this).forEach(function (k) { delete self[k]; }); },
        toString: function () {
            var self = this;
            return "{" + Object.keys(this).map(function (k) { return k + "=" + str(self[k]); }).join(", ") + "}";
        }
    };
    Object.keys(Properties.prototype).forEach(function (k) {
        Object.defineProperty(Properties.prototype, k, { value: Properties.prototype[k], enumerable: false, writable: true, configurable: true });
    });
    define("Properties", Properties);

    // ------------------------------------------------- in-memory file system
    //
    // Files live only for the run. With the fileAccessRules flag (9.1.1), reads and
    // writes are allowed under /var/run/vco and the temp directory only, and other
    // paths fail with the server's own message.

    var files = {};
    var dirs = {};
    ["/", "/tmp", "/var", "/var/run", "/var/run/vco", "/usr", "/usr/lib", "/usr/lib/vco",
        "/usr/lib/vco/app-server", TEMP_DIR].forEach(function (d) { dirs[d] = true; });

    function normPath(p) {
        var s = String(p).replace(/\\/g, "/").replace(/\/+/g, "/");
        return s.length > 1 ? s.replace(/\/$/, "") : s;
    }
    function parentOf(p) { var s = normPath(p); var i = s.lastIndexOf("/"); return i <= 0 ? "/" : s.substring(0, i); }
    function mkdirs(d) { d = normPath(d); while (d && !dirs[d]) { dirs[d] = true; d = parentOf(d); } }
    function allowed(p) {
        if (!flags.fileAccessRules) return true;
        var s = normPath(p);
        return s === "/var/run/vco" || s.indexOf("/var/run/vco/") === 0 || s === TEMP_DIR || s.indexOf(TEMP_DIR + "/") === 0;
    }
    function checkAccess(p, mode) {
        if (!allowed(p)) throw internalError("Permission denied on file '" + normPath(p) + "' , " + mode + " not allowed");
    }

    // ------------------------------------------------------ ByteBuffer / Mime

    var B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    function b64decode(s) {
        s = String(s).replace(/[^A-Za-z0-9+\/]/g, "");
        var out = "", bits = 0, val = 0;
        for (var i = 0; i < s.length; i++) {
            val = (val << 6) | B64.indexOf(s.charAt(i));
            bits += 6;
            if (bits >= 8) { bits -= 8; out += String.fromCharCode((val >> bits) & 255); }
        }
        return out;
    }

    // new ByteBuffer(base64String | ByteBuffer | null)
    function ByteBuffer(arg) {
        var bytes = "";
        if (arg instanceof ByteBuffer) bytes = arg._bytes;
        else if (arg !== null && arg !== undefined) bytes = b64decode(arg);
        Object.defineProperty(this, "_bytes", { value: bytes, writable: true, enumerable: false });
        Object.defineProperty(this, "length", { get: function () { return this._bytes.length; }, enumerable: true });
    }
    ByteBuffer.prototype.toString = function () { return "ByteBuffer(" + this._bytes.length + " bytes)"; };
    define("ByteBuffer", ByteBuffer);

    var MIME = { txt: "text/plain", json: "application/json", xml: "text/xml", html: "text/html", htm: "text/html",
        csv: "text/csv", js: "application/javascript", zip: "application/zip", pdf: "application/pdf",
        png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", yaml: "application/x-yaml", yml: "application/x-yaml",
        ps1: "text/plain", sh: "text/plain" };

    // new MimeAttachment(fileName | File). (The extra content/mimeType arguments are
    // used internally by resource elements.)
    function MimeAttachment(arg, content, mimeType) {
        var name = "";
        var body = content === undefined ? "" : String(content);
        if (arg instanceof File) {
            name = arg.name;
            if (arg.exists) body = files[arg._full] || "";
        } else if (arg !== null && arg !== undefined) {
            name = String(arg);
        }
        var ext = name.indexOf(".") >= 0 ? name.substring(name.lastIndexOf(".") + 1).toLowerCase() : "";
        this.name = name;
        this.mimeType = mimeType || MIME[ext] || "application/octet-stream";
        this.content = body;
    }
    MimeAttachment.prototype.write = function (directory, fileName) {
        var p = normPath(String(directory) + "/" + (fileName || this.name));
        checkAccess(p, "write");
        mkdirs(parentOf(p));
        files[p] = str(this.content);
    };
    MimeAttachment.prototype.toString = function () { return "MimeAttachment(" + this.name + ")"; };
    Object.defineProperty(MimeAttachment.prototype, "buffer", {
        get: function () { var b = new ByteBuffer(null); b._bytes = str(this.content); return b; }
    });
    define("MimeAttachment", MimeAttachment);

    // ---------------------------------------------------------------- File

    function File(path) {
        var full = normPath(path);
        Object.defineProperty(this, "_full", { value: full, writable: true, enumerable: false });
        this.hostname = "localhost";
    }
    Object.defineProperties(File.prototype, {
        name: { get: function () { return this._full === "/" ? "" : this._full.substring(this._full.lastIndexOf("/") + 1); } },
        path: { get: function () { return this._full; } },
        directory: { get: function () { var d = parentOf(this._full); return d === "/" ? "/" : d + "/"; } },
        extension: { get: function () { var n = this.name; return n.indexOf(".") >= 0 ? n.substring(n.lastIndexOf(".") + 1) : ""; } },
        exists: { get: function () { return hasOwn(files, this._full) || hasOwn(dirs, this._full); } },
        isDir: { get: function () { return hasOwn(dirs, this._full); } },
        isLocal: { get: function () { return true; } },
        length: { get: function () { return hasOwn(files, this._full) ? files[this._full].length : 0; } }
    });
    File.prototype.write = function (content) {
        checkAccess(this._full, "write");
        mkdirs(parentOf(this._full));
        files[this._full] = str(content); // write() replaces the content (measured on 9.1.1)
    };
    File.prototype.createFile = function () {
        checkAccess(this._full, "write");
        mkdirs(parentOf(this._full));
        if (!hasOwn(files, this._full)) files[this._full] = "";
    };
    File.prototype.createDirectory = function () { checkAccess(this._full, "write"); mkdirs(this._full); };
    File.prototype.deleteFile = function () {
        checkAccess(this._full, "write");
        delete files[this._full];
        delete dirs[this._full];
    };
    File.prototype.renameTo = function (dest) {
        var to = normPath(dest);
        if (!hasOwn(files, this._full) || !allowed(this._full) || !allowed(to)) return false;
        mkdirs(parentOf(to));
        files[to] = files[this._full];
        delete files[this._full];
        this._full = to;
        return true;
    };
    File.prototype.list = function (extension) {
        var base = this._full === "/" ? "/" : this._full + "/";
        var ext = extension === undefined || extension === null ? "" : String(extension);
        var names = {};
        Object.keys(files).concat(Object.keys(dirs)).forEach(function (p) {
            if (p.indexOf(base) === 0 && p !== base && p.substring(base.length).indexOf("/") < 0) names[p.substring(base.length)] = true;
        });
        return Object.keys(names).filter(function (n) { return !ext || n.slice(-ext.length) === ext; }).sort();
    };
    File.prototype.canRead = function () { return this.exists && allowed(this._full); };
    File.prototype.canWrite = function () { return allowed(this._full); };
    File.prototype.toString = function () { return this._full; };
    define("File", File);

    function FileReader(path) {
        Object.defineProperty(this, "_full", { value: normPath(path), enumerable: false });
        Object.defineProperty(this, "_lines", { value: null, writable: true, enumerable: false });
        Object.defineProperty(this, "_text", { value: null, writable: true, enumerable: false });
    }
    Object.defineProperty(FileReader.prototype, "exists", { get: function () { return hasOwn(files, this._full); } });
    FileReader.prototype.open = function () {
        checkAccess(this._full, "read");
        if (!hasOwn(files, this._full)) throw internalError("File not found: " + this._full);
        this._text = files[this._full];
        this._lines = this._text.split(/\r\n|\r|\n/);
        if (this._lines.length && this._lines[this._lines.length - 1] === "") this._lines.pop();
    };
    FileReader.prototype.readLine = function () {
        if (this._lines === null) throw internalError("File is not open: " + this._full);
        return this._lines.length ? this._lines.shift() : null;
    };
    FileReader.prototype.readAll = function () {
        if (this._text === null) throw internalError("File is not open: " + this._full);
        return this._text;
    };
    FileReader.prototype.close = function () { this._lines = null; this._text = null; };
    define("FileReader", FileReader);

    function FileWriter(path) {
        Object.defineProperty(this, "_full", { value: normPath(path), enumerable: false });
        Object.defineProperty(this, "_open", { value: false, writable: true, enumerable: false });
        this.lineEndType = 0; // 0 Unix (LF), 1 Windows (CR LF), 2 Mac (CR)
    }
    Object.defineProperty(FileWriter.prototype, "exists", { get: function () { return hasOwn(files, this._full); } });
    FileWriter.prototype.open = function () {
        checkAccess(this._full, "write");
        mkdirs(parentOf(this._full));
        if (!hasOwn(files, this._full)) files[this._full] = "";
        this._open = true;
    };
    FileWriter.prototype.clean = function () { checkAccess(this._full, "write"); files[this._full] = ""; };
    FileWriter.prototype.write = function (v) {
        if (!this._open) throw internalError("File is not open: " + this._full);
        files[this._full] += str(v);
    };
    FileWriter.prototype.writeLine = function (v) {
        this.write(str(v) + (this.lineEndType === 1 ? "\r\n" : this.lineEndType === 2 ? "\r" : "\n"));
    };
    FileWriter.prototype.close = function () { this._open = false; };
    define("FileWriter", FileWriter);

    // ------------------------------------------------------------ ZipWriter

    // Collects entries and writes a stand-in archive file (no real compression here).
    function ZipWriter(file) {
        Object.defineProperty(this, "_full", { value: normPath(file), enumerable: false });
        Object.defineProperty(this, "_entries", { value: [], writable: true, enumerable: false });
    }
    ZipWriter.prototype.addContent = function (entryName, content, encoding) {
        this._entries.push({ name: String(entryName), content: str(content) });
    };
    ZipWriter.prototype.addMimeAttachment = function (att) {
        this._entries.push({ name: att.name, content: str(att.content) });
    };
    ZipWriter.prototype.writeZip = function () {
        checkAccess(this._full, "write");
        mkdirs(parentOf(this._full));
        files[this._full] = "PK[mock zip] " + this._entries.map(function (e) {
            return e.name + " (" + e.content.length + " bytes)";
        }).join(", ");
        host.log("debug", "[mock] zip written: " + this._full + " with " + this._entries.length + " entr" + (this._entries.length === 1 ? "y" : "ies"));
    };
    ZipWriter.prototype.clean = function () { this._entries = []; };
    ZipWriter.prototype.toString = function () { return "ZipWriter(" + this._full + ")"; };
    define("ZipWriter", ZipWriter);

    // -------------------------------------------------------------- Command

    // Never runs anything. On 9.1.1 execute() is disabled outright (measured).
    function Command(cmd) {
        this.command = Array.isArray(cmd) ? cmd.join(" ") : str(cmd);
        this.output = "";
        this.result = 0;
        this.input = "";
    }
    Command.prototype.execute = function (wait) {
        if (flags.commandDisabled) {
            throw internalError("This method is disabled for security reasons. 'Command' is deprecated and will be removed in future release");
        }
        host.log("debug", "[mock] Command not executed in the browser: " + this.command);
        this.output = "";
        this.result = 0;
        return 0;
    };
    Command.prototype.executeAndLog = function (fileName) {
        var rc = this.execute(true);
        new File(fileName).write(this.output);
        return rc;
    };
    define("Command", Command);

    // ------------------------------------------------------------------ URL

    var IPV4 = "(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)";
    var IPV6 = "(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,7}:|(?:[0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4}|" +
        "(?:[0-9A-Fa-f]{1,4}:){1,5}(?::[0-9A-Fa-f]{1,4}){1,2}|(?:[0-9A-Fa-f]{1,4}:){1,4}(?::[0-9A-Fa-f]{1,4}){1,3}|" +
        "(?:[0-9A-Fa-f]{1,4}:){1,3}(?::[0-9A-Fa-f]{1,4}){1,4}|(?:[0-9A-Fa-f]{1,4}:){1,2}(?::[0-9A-Fa-f]{1,4}){1,5}|" +
        "[0-9A-Fa-f]{1,4}:(?::[0-9A-Fa-f]{1,4}){1,6}|:(?:(?::[0-9A-Fa-f]{1,4}){1,7}|:))";
    var HOSTNAME = "(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)(?:\\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*";
    function full(re) { return new RegExp("^(?:" + re + ")$"); }
    function formEncode(v) { return encodeURIComponent(str(v)).replace(/%20/g, "+"); }

    // new URL(urlString). host, port and url are read-only, like on a server.
    function URL(u) {
        var s = u === undefined || u === null ? "" : String(u);
        Object.defineProperty(this, "_url", { value: s, writable: true, enumerable: false });
        this.requestType = "GET";
        this.contentType = "application/x-www-form-urlencoded";
        this.datas = "";
        Object.defineProperty(this, "_result", { value: null, writable: true, enumerable: false });
    }
    Object.defineProperties(URL.prototype, {
        url: { get: function () { return this._url; } },
        host: { get: function () { var m = /^[a-z]+:\/\/(\[[^\]]+\]|[^\/:?#]+)/i.exec(this._url); return m ? m[1] : ""; } },
        port: { get: function () {
            var m = /^([a-z]+):\/\/(?:\[[^\]]+\]|[^\/:?#]+)(?::(\d+))?/i.exec(this._url);
            if (!m) return -1;
            if (m[2]) return Number(m[2]);
            return m[1].toLowerCase() === "https" ? 443 : 80;
        } },
        result: { get: function () { return this._result; } }
    });
    URL.prototype.addPath = function (v) { this._url += str(v); }; // appended as-is (measured)
    URL.prototype.addParameter = function (k, v) {
        this._url += (this._url.indexOf("?") >= 0 ? "&" : "?") + formEncode(k) + "=" + formEncode(v);
    };
    URL.prototype._send = function (method, body) {
        var h = new RESTHost("transient");
        h.url = this._url;
        var r = h.createRequest(method, "", body === undefined ? null : body).execute();
        this._result = r.contentAsString;
        return this._result;
    };
    URL.prototype.getContent = function () { return this._send("GET"); };
    URL.prototype.post = function () { return this._send(this.requestType === "GET" ? "POST" : this.requestType, this.datas); };
    URL.prototype.postContent = function (content) { return this._send("POST", str(content)); };
    URL.prototype.isValidHostname = function (h) { return full(HOSTNAME).test(str(h)); };
    URL.prototype.isValidIPv4Address = function (ip) { return full(IPV4).test(str(ip)); };
    URL.prototype.isValidIPv6Address = function (ip) { return full(IPV6).test(str(ip).replace(/^\[|\]$/g, "")); };
    URL.prototype.isValidIPAddress = function (ip) { return this.isValidIPv4Address(ip) || this.isValidIPv6Address(ip); };
    URL.prototype.isValidHostnameOrIPAddress = function (h) {
        var s = str(h);
        // Dotted digits are judged as IPv4 only, so 999.1.1.1 is not a valid host name.
        if (/^[\d.]+$/.test(s)) return this.isValidIPv4Address(s);
        return this.isValidIPAddress(s) || this.isValidHostname(s);
    };
    URL.prototype.escapeHost = function (h) { var s = str(h); return this.isValidIPv6Address(s) && s.charAt(0) !== "[" ? "[" + s + "]" : s; };
    URL.prototype.unescapeHost = function (h) { var s = str(h); return /^\[.*\]$/.test(s) ? s.substring(1, s.length - 1) : s; };
    URL.prototype.getIPv4AddressPatternStr = function () { return IPV4; };
    URL.prototype.getIPv6AddressPatternStr = function () { return IPV6; };
    URL.prototype.getIPAddressPatternStr = function () { return "(?:" + IPV4 + "|" + IPV6 + ")"; };
    URL.prototype.getHostnameOrIPPatternStr = function () { return "(?:" + IPV4 + "|" + IPV6 + "|" + HOSTNAME + ")"; };
    URL.prototype.toString = function () { return this._url; };
    define("URL", URL);

    // ---------------------------------------------- Configuration elements

    function attrsOf(obj) {
        return Object.keys(obj || {}).map(function (k) { return { name: k, value: obj[k] }; });
    }

    function ConfigurationElement(category, name, attributes) {
        this.id = uuid();
        this.name = name;
        this.path = category.path + "/" + name;
        this.categoryPath = category.path;
        Object.defineProperty(this, "_attrs", { value: attributes || {}, enumerable: false });
        Object.defineProperty(this, "attributes", {
            get: function () { return attrsOf(this._attrs); }, enumerable: true
        });
    }
    ConfigurationElement.prototype.getAttributeWithKey = function (k) {
        return Object.prototype.hasOwnProperty.call(this._attrs, k) ? { name: k, value: this._attrs[k] } : null;
    };
    ConfigurationElement.prototype.setAttributeWithKey = function (k, v) { this._attrs[k] = v; };
    ConfigurationElement.prototype.removeAttributeWithKey = function (k) { delete this._attrs[k]; };
    ConfigurationElement.prototype.toString = function () { return "ConfigurationElement(" + this.path + ")"; };

    var configCategories = {};
    function configCategory(path, create) {
        if (!configCategories[path] && create) {
            configCategories[path] = { name: path.split("/").pop(), path: path, configurationElements: [] };
        }
        return configCategories[path] || null;
    }
    Object.keys(fx.configurationElements || {}).forEach(function (path) {
        var cat = configCategory(path, true);
        var els = fx.configurationElements[path];
        Object.keys(els).forEach(function (n) {
            cat.configurationElements.push(new ConfigurationElement(cat, n, els[n]));
        });
    });

    // --------------------------------------------------- Resource elements

    var resourceCategories = {};
    Object.keys(fx.resourceElements || {}).forEach(function (path) {
        var items = fx.resourceElements[path];
        resourceCategories[path] = {
            name: path.split("/").pop(),
            path: path,
            resourceElements: Object.keys(items).map(function (n) {
                var item = items[n];
                var content = typeof item === "string" ? item : JSON.stringify(item, null, 2);
                return {
                    id: uuid(),
                    name: n,
                    mimeType: typeof item === "string" ? "text/plain" : "application/json",
                    getContentAsMimeAttachment: function () { return new MimeAttachment(n, content, this.mimeType); },
                    setContentFromMimeAttachment: function (m) { content = m.content; },
                    toString: function () { return "ResourceElement(" + path + "/" + n + ")"; }
                };
            })
        };
    });

    // ------------------------------------------------- API catalog stubs
    /*
     * Every class of the API catalog (modernvroapi.in data) that the hand-written
     * mocks above and below do not cover becomes a stub: constructors and static
     * calls work, attributes return a typed default, and each method call writes a
     * "[stub] Class.method() -> Type" debug line and returns a placeholder:
     *   string "" / number 0 / boolean false / arrays [] / Any null / Properties and
     *   Date fresh objects / VcTask a finished task / any other class a stub of it.
     * The engine gives the class data through __vroHost.typeInfo(name), so only the
     * classes a script actually touches are built.
     */
    var stubNames = (host.stubGlobals || []).slice();
    var stubTypeCache = {};
    var stubProtoCache = {};
    var stubCalls = { n: 0, max: 200 };

    function stubTypeInfo(name) {
        if (Object.prototype.hasOwnProperty.call(stubTypeCache, name)) return stubTypeCache[name];
        var line = host.typeInfo ? host.typeInfo(name) : null;
        var info = null;
        if (line !== null && line !== undefined) {
            var f = String(line).split("\t");
            info = { name: name, attrs: [], methods: [], ctor: f[3] ? f[3].split(",") : [], attrSet: {} };
            if (f[1]) f[1].split("|").forEach(function (x) {
                var p = x.split(":");
                info.attrs.push({ name: p[0], type: p[1], w: p[2] === "w" });
                info.attrSet[p[0]] = 1;
            });
            if (f[2]) f[2].split("|").forEach(function (x) {
                var p = x.split(":");
                info.methods.push({ name: p[0], type: p[1] });
            });
        }
        stubTypeCache[name] = info;
        return info;
    }

    function stubTypeLabel(t) {
        var arr = "";
        while (/\[\]$/.test(t)) { arr += "[]"; t = t.slice(0, -2); }
        var named = { s: "string", n: "number", b: "boolean", a: "Any", p: "Properties", d: "Date", v: "void" };
        return (named[t] || t) + arr;
    }

    function stubNote(text) {
        stubCalls.n++;
        if (stubCalls.n <= stubCalls.max) host.log("debug", "[stub] " + text);
        else if (stubCalls.n === stubCalls.max + 1) host.log("debug", "[stub] further stub calls are not logged");
    }

    function stubValue(t, method, self) {
        if (!t || t === "v") return undefined;
        if (/\[\]$/.test(t)) return [];
        switch (t) {
            case "s": return "";
            case "n": return 0;
            case "b": return false;
            case "a": return null;
            case "p": return new Properties();
            case "d": return new Date(host.now());
        }
        if (t === "VcTask" && method) return new VcTask(method, self, null);
        return stubInstance(t);
    }

    function stubSkip(name) {
        return name === "constructor" || name === "__proto__" || name in Object.prototype;
    }

    function stubAttr(target, a) {
        var key = a.name;
        function own(obj, v) {
            try { Object.defineProperty(obj, key, { value: v, writable: true, configurable: true, enumerable: true }); } catch (e) { /* frozen */ }
        }
        try {
            Object.defineProperty(target, key, {
                configurable: true, enumerable: false,
                // The value is made on first read and then kept on the object.
                get: function () { var v = stubValue(a.type); own(this, v); return v; },
                set: function (v) { own(this, v); }
            });
        } catch (e) { /* not configurable */ }
    }

    function stubMethod(type, m) {
        return function () {
            stubNote(type + "." + m.name + "()" + (m.type === "v" ? "" : " → " + stubTypeLabel(m.type)));
            return stubValue(m.type, m.name, this);
        };
    }

    function stubFill(target, info, onlyMissing, methodsOnly) {
        if (!methodsOnly) {
            info.attrs.forEach(function (a) {
                if (stubSkip(a.name) || (onlyMissing && a.name in target)) return;
                stubAttr(target, a);
            });
        }
        info.methods.forEach(function (m) {
            if (stubSkip(m.name) || info.attrSet[m.name] || (onlyMissing && m.name in target)) return;
            try {
                Object.defineProperty(target, m.name, { value: stubMethod(info.name, m), writable: true, configurable: true, enumerable: false });
            } catch (e) { /* not configurable */ }
        });
    }

    function stubProto(type) {
        if (Object.prototype.hasOwnProperty.call(stubProtoCache, type)) return stubProtoCache[type];
        var info = stubTypeInfo(type);
        var proto = null;
        if (info) {
            proto = {};
            Object.defineProperty(proto, "__vroClass", { value: type });
            Object.defineProperty(proto, "toString", { value: function () { return "[stub " + type + "]"; }, writable: true, configurable: true });
            stubFill(proto, info, false, false);
        }
        stubProtoCache[type] = proto;
        return proto;
    }

    function stubInstance(type) {
        var proto = stubProto(type);
        return proto ? Object.create(proto) : null;
    }

    function stubClass(type) {
        var info = stubTypeInfo(type);
        if (!info) return null;
        var proto = stubProto(type);
        var Ctor = function () {
            var self = this instanceof Ctor ? this : Object.create(proto);
            // Named constructor arguments are kept on the object (new SSHSession(host, user).host).
            for (var i = 0; i < info.ctor.length && i < arguments.length; i++) {
                var pn = info.ctor[i];
                if (pn && !/^(arg|param)\d+$/.test(pn)) self[pn] = arguments[i];
            }
            return self;
        };
        Ctor.prototype = proto;
        Object.defineProperty(proto, "constructor", { value: Ctor, writable: true, configurable: true });
        Object.defineProperty(Ctor, "toString", { value: function () { return type; }, writable: true, configurable: true });
        // Scripting objects such as ActiveDirectory or XMLManager are used through the class name.
        stubFill(Ctor, info, true, false);
        return Ctor;
    }

    // vCenter inventory objects get the full catalog behind the hand-written members
    // when the script uses vCenter classes.
    var vcStubs = stubNames.some(function (n) { return n.indexOf("Vc") === 0; });

    // ------------------------------------------------------- vCenter mocks

    var vcTypes = {};
    var byId = {};

    function VcTask(name, target, action) {
        this.id = "task-" + (++uuidCounter);
        this.name = name;
        this.info = {
            key: this.id,
            name: name,
            descriptionId: name,
            entityName: target ? target.name : "",
            state: { value: "success" },
            progress: 100,
            result: null,
            error: null,
            startTime: new Date(host.now())
        };
        try {
            this.info.result = action ? action() : null;
        } catch (e) {
            this.info.state = { value: "error" };
            this.info.error = { localizedMessage: String(e.message || e) };
        }
        this.info.completeTime = new Date(host.now());
        host.log("debug", "[mock vCenter] " + name + " on '" + (target ? target.name : "?") + "' -> " + this.info.state.value);
    }
    VcTask.prototype.toString = function () { return "Task<" + this.name + ">"; };
    define("VcTask", VcTask);

    function vcObject(type, data, sdk) {
        var o = (vcStubs && stubInstance("Vc" + type)) || {};
        Object.keys(data).forEach(function (k) { o[k] = data[k]; });
        Object.defineProperty(o, "vimType", { value: type, enumerable: false });
        Object.defineProperty(o, "__vroType", { value: "VC:" + type, enumerable: false });
        o.sdkConnection = sdk;
        o.vimHost = sdk;
        o.moref = { type: type, value: data.id };
        o.toString = function () { return o.name; };
        (vcTypes[type] = vcTypes[type] || []).push(o);
        byId[sdk.id + "," + data.id] = o;
        byId[data.id] = o;
        return o;
    }

    var vcenters = (fx.vcenter && fx.vcenter.vcenters) || [];
    var sdks = vcenters.map(function (vc) {
        var sdk = {
            id: vc.name,
            name: vc.name,
            sdkId: vc.name,
            about: { version: vc.version || "9.0.0", fullName: "VMware vCenter Server " + (vc.version || "9.0.0") },
            toString: function () { return vc.name; }
        };
        Object.defineProperty(sdk, "__vroType", { value: "VC:SdkConnection", enumerable: false });

        (vc.datacenters || []).forEach(function (dc) {
            vcObject("Datacenter", { id: dc.id, name: dc.name }, sdk);
        });
        (vc.clusters || []).forEach(function (c) {
            vcObject("ClusterComputeResource", { id: c.id, name: c.name, datacenter: c.datacenter }, sdk);
        });
        (vc.hosts || []).forEach(function (h) {
            vcObject("HostSystem", {
                id: h.id, name: h.name, cluster: h.cluster,
                runtime: { connectionState: { value: "connected" }, inMaintenanceMode: !!h.maintenance },
                summary: { hardware: { numCpuCores: h.cpuCores || 32, memorySize: (h.memoryGB || 512) * 1073741824 } }
            }, sdk);
        });
        (vc.datastores || []).forEach(function (d) {
            vcObject("Datastore", {
                id: d.id, name: d.name,
                summary: { capacity: (d.capacityGB || 1024) * 1073741824, freeSpace: (d.freeGB || 512) * 1073741824, type: d.type || "VMFS" }
            }, sdk);
        });
        (vc.networks || []).forEach(function (n) {
            vcObject("Network", { id: n.id, name: n.name }, sdk);
        });
        (vc.vms || []).forEach(function (v) { makeVm(v, sdk); });
        return sdk;
    });

    function makeVm(v, sdk) {
        var vm = vcObject("VirtualMachine", {
            id: v.id,
            name: v.name,
            runtime: { powerState: { value: v.powerState || "poweredOff" }, host: v.host || null },
            config: {
                name: v.name,
                guestFullName: v.guestOS || "Other Linux (64-bit)",
                guestId: v.guestId || "otherLinux64Guest",
                annotation: v.notes || "",
                template: !!v.template,
                instanceUuid: v.instanceUuid || uuid(),
                hardware: { numCPU: v.cpu || 2, memoryMB: v.memoryMB || 4096, device: [] }
            },
            guest: {
                ipAddress: v.ip || null,
                hostName: v.hostname || null,
                toolsRunningStatus: v.powerState === "poweredOn" ? "guestToolsRunning" : "guestToolsNotRunning"
            },
            summary: { config: { numCpu: v.cpu || 2, memorySizeMB: v.memoryMB || 4096 } },
            tags: v.tags || []
        }, sdk);
        vm.datastore = (v.datastores || []).map(function (id) { return byId[sdk.id + "," + id]; }).filter(Boolean);
        vm.network = (v.networks || []).map(function (id) { return byId[sdk.id + "," + id]; }).filter(Boolean);
        vm.snapshot = null;
        (v.snapshots || []).forEach(function (sn) {
            var snap = {
                name: sn.name,
                description: sn.description || "",
                createTime: new Date(host.now() - (sn.ageDays || 0) * 86400000),
                vm: vm,
                snapshot: { value: "snapshot-" + (++uuidCounter) }
            };
            snap.toString = function () { return snap.name; };
            vm.snapshot = vm.snapshot || { rootSnapshotList: [] };
            vm.snapshot.rootSnapshotList.push(snap);
            vm.snapshot.currentSnapshot = snap;
        });

        function setPower(state) {
            return function () {
                if (vm.config.template) throw new Error("The operation is not supported on a template.");
                vm.runtime.powerState = { value: state };
                vm.guest.toolsRunningStatus = state === "poweredOn" ? "guestToolsRunning" : "guestToolsNotRunning";
                return null;
            };
        }
        vm.powerOnVM_Task = function () {
            if (vm.runtime.powerState.value === "poweredOn") {
                return new VcTask("PowerOnVM_Task", vm, function () {
                    throw new Error("The attempted operation cannot be performed in the current state (Powered on).");
                });
            }
            return new VcTask("PowerOnVM_Task", vm, setPower("poweredOn"));
        };
        vm.powerOffVM_Task = function () { return new VcTask("PowerOffVM_Task", vm, setPower("poweredOff")); };
        vm.suspendVM_Task = function () { return new VcTask("SuspendVM_Task", vm, setPower("suspended")); };
        vm.resetVM_Task = function () { return new VcTask("ResetVM_Task", vm, setPower("poweredOn")); };
        vm.shutdownGuest = function () {
            if (vm.guest.toolsRunningStatus !== "guestToolsRunning") {
                throw new Error("Cannot complete operation because VMware Tools is not running in this virtual machine.");
            }
            setPower("poweredOff")();
        };
        vm.rebootGuest = function () {
            if (vm.guest.toolsRunningStatus !== "guestToolsRunning") {
                throw new Error("Cannot complete operation because VMware Tools is not running in this virtual machine.");
            }
        };
        vm.rename_Task = function (n) { return new VcTask("Rename_Task", vm, function () { vm.name = n; vm.config.name = n; }); };
        vm.destroy_Task = function () {
            return new VcTask("Destroy_Task", vm, function () {
                var list = vcTypes.VirtualMachine;
                list.splice(list.indexOf(vm), 1);
            });
        };
        vm.reconfigVM_Task = function (spec) {
            return new VcTask("ReconfigVM_Task", vm, function () {
                if (spec.numCPUs) { vm.config.hardware.numCPU = spec.numCPUs; vm.summary.config.numCpu = spec.numCPUs; }
                if (spec.memoryMB) { vm.config.hardware.memoryMB = spec.memoryMB; vm.summary.config.memorySizeMB = spec.memoryMB; }
                if (spec.annotation !== undefined && spec.annotation !== null) vm.config.annotation = spec.annotation;
                if (spec.deviceChange && spec.deviceChange.length) {
                    host.log("debug", "[mock vCenter] " + spec.deviceChange.length + " device change(s) applied to '" + vm.name + "'");
                }
                if (spec.extraConfig && spec.extraConfig.length) {
                    vm.config.extraConfig = (vm.config.extraConfig || []).concat(spec.extraConfig);
                }
            });
        };
        vm.createSnapshot_Task = function (name, description) {
            return new VcTask("CreateSnapshot_Task", vm, function () {
                var snap = { name: name, description: description || "", createTime: new Date(host.now()) };
                vm.snapshot = vm.snapshot || { rootSnapshotList: [] };
                vm.snapshot.rootSnapshotList.push(snap);
                vm.snapshot.currentSnapshot = snap;
                return snap;
            });
        };
        vm.removeAllSnapshots_Task = function () {
            return new VcTask("RemoveAllSnapshots_Task", vm, function () { vm.snapshot = null; });
        };
        return vm;
    }

    /*
     * VC data objects. The vCenter plug-in converts a JavaScript array to a fixed-size
     * Java array the moment it is assigned to a data-object property, so
     *     spec.deviceChange = [];  spec.deviceChange[0] = x;   // silently lost
     * does nothing, while building a local array first and assigning it works.
     * Array properties here are stored as frozen copies to reproduce that.
     * See https://cloudblogger.co.in/2022/04/03/javascript-to-java-conversion-limitation-in-vro/
     */
    function vcDataObject(typeName, arrayProps) {
        function Ctor() {
            var self = this;
            arrayProps.forEach(function (p) {
                var stored = null;
                Object.defineProperty(self, p, {
                    enumerable: true,
                    get: function () { return stored; },
                    set: function (v) {
                        stored = (v === null || v === undefined) ? null : Object.freeze(Array.prototype.slice.call(v));
                    }
                });
            });
        }
        Ctor.prototype.toString = function () { return typeName; };
        Object.defineProperty(Ctor.prototype, "__vroType", { value: typeName, enumerable: false });
        define(typeName, Ctor);
        return Ctor;
    }

    var VcVirtualMachineConfigSpec = vcDataObject("VcVirtualMachineConfigSpec", ["deviceChange", "extraConfig"]);
    vcDataObject("VcVirtualDeviceConfigSpec", []);
    vcDataObject("VcVirtualMachineCloneSpec", []);
    vcDataObject("VcVirtualMachineRelocateSpec", ["disk"]);
    vcDataObject("VcCustomizationSpec", []);
    function VcOptionValue(key, value) { this.key = key; this.value = value; }
    VcOptionValue.prototype.toString = function () { return "VcOptionValue(" + this.key + ")"; };
    define("VcOptionValue", VcOptionValue);
    define("VcVirtualDeviceConfigSpecOperation", { add: { value: "add" }, remove: { value: "remove" }, edit: { value: "edit" } });

    function allOf(type) {
        return function () { return (vcTypes[type] || []).slice(); };
    }

    define("VcPlugin", {
        allSdkConnections: sdks,
        getAllVirtualMachines: function (props, xpath) {
            var vms = (vcTypes.VirtualMachine || []).slice();
            if (xpath) {
                // Supports the common form: xpath:name[matches(.,'web.*')] or xpath:name='x'
                var m = /name\[matches\(\.,\s*'(.*)'\)\]/.exec(xpath) || /name\s*=\s*'(.*)'/.exec(xpath);
                if (m) {
                    var re = new RegExp("^(?:" + m[1] + ")$");
                    vms = vms.filter(function (v) { return re.test(v.name); });
                }
            }
            return vms;
        },
        getAllHostSystems: allOf("HostSystem"),
        getAllClusterComputeResources: allOf("ClusterComputeResource"),
        getAllDatacenters: allOf("Datacenter"),
        getAllDatastores: allOf("Datastore"),
        getAllNetworks: allOf("Network"),
        get allVirtualMachines() { return allOf("VirtualMachine")(); },
        get allHostSystems() { return allOf("HostSystem")(); },
        get allClusterComputeResources() { return allOf("ClusterComputeResource")(); },
        get allDatacenters() { return allOf("Datacenter")(); },
        get allDatastores() { return allOf("Datastore")(); },
        get allNetworks() { return allOf("Network")(); },
        toString: function () { return "VcPlugin"; }
    });

    // ---------------------------------------------------------- REST mocks

    function RESTResponse(status, body, headers) {
        this.statusCode = status;
        this.contentAsString = body;
        this._headers = headers || {};
    }
    RESTResponse.prototype.getAllHeaders = function () {
        var p = new Properties();
        var h = this._headers;
        Object.keys(h).forEach(function (k) { p.put(k, h[k]); });
        return p;
    };
    define("RESTResponse", RESTResponse);

    var routes = (fx.rest && fx.rest.routes) || [];

    function RESTRequest(restHost, method, url, content) {
        this.host = restHost;
        this.method = method;
        this.url = url;
        this.fullUrl = restHost.url.replace(/\/$/, "") + "/" + String(url || "").replace(/^\//, "");
        this.content = content || null;
        this.contentType = null;
        this._headers = {};
    }
    RESTRequest.prototype.setHeader = function (k, v) { this._headers[k] = v; };
    RESTRequest.prototype.execute = function () {
        var req = this;
        host.log("debug", "[mock REST] " + req.method + " " + req.fullUrl);
        for (var i = 0; i < routes.length; i++) {
            var r = routes[i];
            if ((r.method || "GET").toUpperCase() !== String(req.method).toUpperCase()) continue;
            if (!new RegExp(r.url).test(req.fullUrl)) continue;
            var body = typeof r.body === "string" ? r.body : JSON.stringify(r.body);
            return new RESTResponse(r.status || 200, body, r.headers || { "Content-Type": "application/json" });
        }
        return new RESTResponse(404, JSON.stringify({ error: "No mock route for " + req.method + " " + req.fullUrl }),
            { "Content-Type": "application/json" });
    };
    define("RESTRequest", RESTRequest);

    function RESTHost(name) {
        this.id = uuid();
        this.name = name || "";
        this.url = "";
        this.hostVerification = true;
        this.connectionTimeout = 30;
        this.operationTimeout = 60;
    }
    RESTHost.prototype.createRequest = function (method, url, content) { return new RESTRequest(this, method, url, content); };
    RESTHost.prototype.toString = function () { return "RESTHost(" + this.name + ")"; };
    define("RESTHost", RESTHost);

    var restHosts = ((fx.rest && fx.rest.hosts) || []).map(function (h) {
        var r = new RESTHost(h.name);
        r.url = h.url;
        Object.defineProperty(r, "__vroType", { value: "REST:RESTHost", enumerable: false });
        byId[h.name] = r;
        return r;
    });

    define("RESTHostManager", {
        createHost: function (name) { return new RESTHost(name); },
        createTransientHostFrom: function (h) { var c = new RESTHost(h.name); c.url = h.url; return c; },
        addHost: function (h) { restHosts.push(h); return h; },
        getHosts: function () { return restHosts.map(function (h) { return h.id; }); },
        getHost: function (id) {
            for (var i = 0; i < restHosts.length; i++) if (restHosts[i].id === id) return restHosts[i];
            return null;
        }
    });


    // --------------------------------------------------------- LockingSystem

    var locks = {};
    define("LockingSystem", {
        lock: function (id, owner) {
            if (locks[id] && locks[id] !== owner) return false;
            locks[id] = owner;
            return true;
        },
        lockAndWait: function (id, owner) {
            if (locks[id] && locks[id] !== owner) {
                throw new Error("[mock] Lock '" + id + "' is held by '" + locks[id] + "'; lockAndWait would block forever.");
            }
            locks[id] = owner;
        },
        unlock: function (id, owner) {
            if (locks[id] === owner) delete locks[id];
        },
        unlockAll: function () { locks = {}; },
        retrieveAll: function () {
            return Object.keys(locks).map(function (k) { return k + " (" + locks[k] + ")"; });
        }
    });

    // ---------------------------------------------------------------- Server

    define("Server", {
        log: function (m) { host.log("info", "[Server] " + str(m)); },
        warn: function (m) { host.log("warning", "[Server] " + str(m)); },
        error: function (m) { host.log("error", "[Server] " + str(m)); },
        getConfigurationElementCategoryWithPath: function (p) { return configCategory(p, false); },
        createConfigurationElement: function (path, name) {
            var cat = configCategory(path, true);
            var ce = new ConfigurationElement(cat, name, {});
            cat.configurationElements.push(ce);
            return ce;
        },
        getAllConfigurationElementCategories: function () {
            return Object.keys(configCategories).map(function (k) { return configCategories[k]; });
        },
        getResourceElementCategoryWithPath: function (p) { return resourceCategories[p] || null; },
        findForType: function (type, id) {
            if (type.indexOf("VC:") === 0) return byId[id] || byId[String(id).split(",").pop()] || null;
            if (type === "REST:RESTHost") return byId[id] || null;
            return null;
        },
        findAllForType: function (type) {
            if (type.indexOf("VC:") === 0) return (vcTypes[type.substr(3)] || []).slice();
            if (type === "REST:RESTHost") return restHosts.slice();
            return [];
        },
        getCurrentLdapUser: function () { return { name: "configurationadmin", displayName: "Configuration Admin" }; },
        toString: function () { return "Server"; }
    });

    // --------------------------------------------------------- Mock actions

    function addModule(name, actions) {
        var mod = modules[name] = modules[name] || {};
        Object.keys(actions).forEach(function (a) { mod[a] = actions[a]; });
        Object.defineProperty(mod, "toString", {
            value: function () { return "[Module " + name + "]"; }, enumerable: false, configurable: true
        });
    }

    addModule("com.vmware.library.vc.basic", {
        // Mocked tasks finish synchronously; this mirrors the real action's contract.
        vim3WaitTaskEnd: function (task, progress, pollRate) {
            if (!task) throw new Error("task is null");
            if (task.info.state.value === "error") {
                throw new Error("Task '" + task.info.name + "' has encountered an error: " + task.info.error.localizedMessage);
            }
            return task.info.result;
        }
    });
    addModule("com.vmware.library.vc.vm", {
        getAllVMsMatchingRegexp: function (regexp) {
            var re = new RegExp(regexp);
            return (vcTypes.VirtualMachine || []).filter(function (v) { return re.test(v.name); });
        }
    });

    // User-defined actions from the Mocks panel: { "com.acme": { "add": "function(a,b){return a+b;}" } }
    Object.keys(fx.actions || {}).forEach(function (modName) {
        var defs = fx.actions[modName], compiled = {};
        Object.keys(defs).forEach(function (a) {
            /* jshint evil:true */
            compiled[a] = eval("(" + defs[a] + ")");
        });
        addModule(modName, compiled);
    });

    // -------------------------------------------------------------- Inspect

    // Catalog classes the script names: hand-written mocks keep priority and only
    // gain the members they lack; everything else becomes a generated stub.
    stubNames.forEach(function (name) {
        var existing = Object.prototype.hasOwnProperty.call(global, name) ? global[name] : undefined;
        if (existing === undefined) {
            var C = stubClass(name);
            if (C) define(name, C);
            return;
        }
        if (name === "Properties" || existing === null) return;
        var info = stubTypeInfo(name);
        if (!info) return;
        if (typeof existing === "function") {
            if (existing.prototype) stubFill(existing.prototype, info, true, true);
        } else if (typeof existing === "object") {
            stubFill(existing, info, true, false);
        }
    });

    // Formats a value for the Result/Outputs panes (not used by System.log).
    define("__vroInspect", function inspect(v, depth) {
        depth = depth || 0;
        if (v === null) return "null";
        if (v === undefined) return "undefined";
        var t = typeof v;
        if (t === "string") return depth ? JSON.stringify(v) : v;
        if (t === "number" || t === "boolean") return String(v);
        if (t === "function") return "[function " + (v.name || "anonymous") + "]";
        // E4X first: any property read on XML returns an (empty) XMLList, which would fool the checks below.
        if (t === "xml") return v.toXMLString();
        if (v instanceof Date) return v.toString();
        if (v.__vroType) return v.name !== undefined ? v.__vroType + "<" + v.name + ">" : String(v);
        if (v instanceof Properties) {
            var pk = v.keys(), pin = new Array(depth + 2).join("  ");
            if (!pk.length) return "Properties {}";
            return "Properties {\n" + pk.map(function (k) {
                return pin + k + ": " + inspect(v.get(k), depth + 1);
            }).join(",\n") + "\n" + new Array(depth + 1).join("  ") + "}";
        }
        if (depth > 3) return Array.isArray(v) ? "[Array]" : "[Object]";
        if (Array.isArray(v)) {
            return "[" + v.map(function (x) { return inspect(x, depth + 1); }).join(", ") + "]";
        }
        var proto = Object.getPrototypeOf ? Object.getPrototypeOf(v) : null;
        if (proto && proto !== Object.prototype && typeof v.toString === "function" && v.toString !== Object.prototype.toString) {
            return String(v);
        }
        try {
            var keys = Object.keys(v);
        } catch (e) {
            return String(v); // Java object (java.util.*)
        }
        if (!keys.length && String(v) !== "[object Object]") return String(v);
        var indent = new Array(depth + 2).join("  ");
        return "{\n" + keys.map(function (k) {
            return indent + k + ": " + inspect(v[k], depth + 1);
        }).join(",\n") + "\n" + new Array(depth + 1).join("  ") + "}";
    });
})(this);
