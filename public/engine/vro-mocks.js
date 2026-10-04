/*
 * vRO scripting API mocks.
 *
 * This file is NOT run by the browser. It is passed to the real Rhino engine
 * (1.7R4 or 1.7.15) and evaluated in the root scope before your script, so it
 * must stay plain ES5 that both engines accept.
 *
 * The engine provides one host object, __vroHost:
 *   __vroHost.log(level, message)   append a line to the log pane
 *   __vroHost.now()                 epoch millis
 *   __vroHost.sleep(ms)             sleep, bounded by the run timeout
 *   __vroHost.engineVersion         e.g. "Rhino 1.7 release 4 2012 06 18"
 *   __vroHost.languageVersion       170 (8.x) or 200 (9.x)
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

    // Small subset of java.text.SimpleDateFormat patterns, enough for System.formatDate.
    function formatDate(d, pattern) {
        var p = pattern || "yyyy-MM-dd'T'HH:mm:ss.SSSZ";
        var tz = -d.getTimezoneOffset();
        var tzs = (tz >= 0 ? "+" : "-") + pad(Math.floor(Math.abs(tz) / 60)) + pad(Math.abs(tz) % 60);
        var out = "", i = 0;
        while (i < p.length) {
            var c = p.charAt(i);
            if (c === "'") {
                var j = p.indexOf("'", i + 1);
                if (j < 0) j = p.length;
                out += p.substring(i + 1, j);
                i = j + 1;
                continue;
            }
            var run = 1;
            while (p.charAt(i + run) === c) run++;
            switch (c) {
                case "y": out += run === 2 ? pad(d.getFullYear() % 100) : d.getFullYear(); break;
                case "M": out += run >= 3 ? MONTHS[d.getMonth()] : pad(d.getMonth() + 1, run); break;
                case "d": out += pad(d.getDate(), run); break;
                case "H": out += pad(d.getHours(), run); break;
                case "m": out += pad(d.getMinutes(), run); break;
                case "s": out += pad(d.getSeconds(), run); break;
                case "S": out += pad(d.getMilliseconds(), 3); break;
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

    var contextParams = fx.context || {};

    var modules = {};

    var System = {
        log: function (m) { host.log("info", str(m)); },
        warn: function (m) { host.log("warning", str(m)); },
        error: function (m) { host.log("error", str(m)); },
        debug: function (m) { host.log("debug", str(m)); },
        sleep: function (ms) { host.sleep(ms); },
        getCurrentTime: function () { return host.now(); },
        nextUUID: function () { return uuid(); },
        formatDate: function (date, pattern) { return formatDate(date, pattern); },
        getDateFromFormat: function (text, pattern) { return parseDate(text, pattern); },
        getModule: function (name) {
            var m = modules[name];
            if (!m) {
                throw new Error("Module '" + name + "' not found. Add it under Mocks > Actions to stub it.");
            }
            return m;
        },
        getContext: function () {
            return {
                getParameter: function (k) { return contextParams[k] === undefined ? null : contextParams[k]; },
                setParameter: function (k, v) { contextParams[k] = v; },
                parameterNames: function () { return Object.keys(contextParams); }
            };
        },
        getTempDirectory: function () { return "/var/run/vco-tmp"; },
        appendToArray: function (arr, v) { arr.push(v); return arr; },
        toString: function () { return "System"; }
    };
    define("System", System);

    // console exists in Orchestrator 9.x only.
    if (host.languageVersion >= 200) {
        define("console", {
            log: function () { host.log("info", Array.prototype.map.call(arguments, str).join(" ")); },
            info: function () { host.log("info", Array.prototype.map.call(arguments, str).join(" ")); },
            warn: function () { host.log("warning", Array.prototype.map.call(arguments, str).join(" ")); },
            error: function () { host.log("error", Array.prototype.map.call(arguments, str).join(" ")); },
            debug: function () { host.log("debug", Array.prototype.map.call(arguments, str).join(" ")); }
        });
    }

    // ---------------------------------------------------------- Properties

    function Properties() {
        Object.defineProperty(this, "_m", { value: {}, enumerable: false });
    }
    Properties.prototype = {
        constructor: Properties,
        put: function (k, v) { this._m[k] = v; },
        get: function (k) { return Object.prototype.hasOwnProperty.call(this._m, k) ? this._m[k] : null; },
        remove: function (k) { var v = this.get(k); delete this._m[k]; return v; },
        keys: function () { return Object.keys(this._m); },
        values: function () { var m = this._m; return Object.keys(m).map(function (k) { return m[k]; }); },
        containsKey: function (k) { return Object.prototype.hasOwnProperty.call(this._m, k); },
        size: function () { return Object.keys(this._m).length; },
        isEmpty: function () { return this.size() === 0; },
        clear: function () { var m = this._m; Object.keys(m).forEach(function (k) { delete m[k]; }); },
        toString: function () {
            var m = this._m;
            return "{" + Object.keys(m).map(function (k) { return k + "=" + str(m[k]); }).join(", ") + "}";
        }
    };
    define("Properties", Properties);

    // ------------------------------------------- Mime / ByteBuffer / File

    function ByteBuffer(content) { this.content = content === undefined ? "" : String(content); }
    ByteBuffer.prototype.length = function () { return this.content.length; };
    ByteBuffer.prototype.toString = function () { return this.content; };
    define("ByteBuffer", ByteBuffer);

    function MimeAttachment(name, content, mimeType) {
        this.name = name || "";
        this.content = content || "";
        this.mimeType = mimeType || "text/plain";
    }
    MimeAttachment.prototype.write = function (dir, name) {
        files[(dir || "/var/run/vco-tmp") + "/" + (name || this.name)] = this.content;
    };
    MimeAttachment.prototype.toString = function () { return "MimeAttachment(" + this.name + ")"; };
    define("MimeAttachment", MimeAttachment);

    var files = {};
    function File(path) {
        this.name = String(path).split("/").pop();
        this.path = String(path);
    }
    File.prototype = {
        constructor: File,
        exists: function () { return Object.prototype.hasOwnProperty.call(files, this.path); },
        read: function () { return this.exists() ? files[this.path] : null; },
        write: function (content) { files[this.path] = (files[this.path] || "") + str(content); },
        rename: function (to) { files[to] = files[this.path]; delete files[this.path]; this.path = to; },
        deleteFile: function () { delete files[this.path]; },
        get length() { return this.exists() ? files[this.path].length : 0; },
        toString: function () { return this.path; }
    };
    define("File", File);

    function FileWriter(path) { this.file = new File(path); }
    FileWriter.prototype.open = function () { files[this.file.path] = ""; };
    FileWriter.prototype.write = function (s) { this.file.write(s); };
    FileWriter.prototype.writeLine = function (s) { this.file.write(str(s) + "\n"); };
    FileWriter.prototype.close = function () {};
    define("FileWriter", FileWriter);

    function FileReader(path) { this.file = new File(path); this._lines = null; }
    FileReader.prototype.open = function () { this._lines = (this.file.read() || "").split("\n"); };
    FileReader.prototype.readAll = function () { return this.file.read(); };
    FileReader.prototype.readLine = function () { return this._lines && this._lines.length ? this._lines.shift() : null; };
    FileReader.prototype.close = function () {};
    define("FileReader", FileReader);

    function Command(cmd) { this.command = cmd; this.output = ""; this.result = 0; }
    Command.prototype.execute = function () {
        host.log("debug", "[mock] Command not executed in the browser: " + this.command);
        this.output = "";
        this.result = 0;
        return 0;
    };
    define("Command", Command);

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
        var o = {};
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

    function URL(u) { this.url = String(u); }
    URL.prototype.getContent = function () {
        var h = new RESTHost("transient");
        h.url = this.url;
        return h.createRequest("GET", "", null).execute().contentAsString;
    };
    define("URL", URL);

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
        if (v instanceof Properties) return "Properties" + v.toString();
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
