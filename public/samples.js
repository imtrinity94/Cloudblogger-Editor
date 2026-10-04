/* Sidebar samples. mode/inputs/outputs are applied along with the code. */
window.VRO_SAMPLES = [
    {
        group: "Basics",
        items: [
            {
                id: "hello",
                title: "System.log & friends",
                code: "System.log(\"Hello from Orchestrator\");\nSystem.warn(\"A warning\");\nSystem.error(\"An error line (the run still succeeds)\");\nSystem.debug(\"Debug output\");\n\n// Objects print the way Orchestrator prints them:\nSystem.log({ a: 1 });          // [object Object]\nSystem.log(JSON.stringify({ a: 1 }));\n"
            },
            {
                id: "action-inputs",
                title: "Action with inputs & return",
                mode: "action",
                inputs: [{ name: "firstName", value: "\"Mayank\"" }, { name: "count", value: "3" }],
                code: "// Actions run wrapped in a function, so `return` works.\n// Inputs come from the Inputs tab (values are JavaScript expressions).\nvar names = [];\nfor (var i = 0; i < count; i++) {\n    names.push(firstName + \"-\" + (i + 1));\n}\nSystem.log(\"Generated \" + names.length + \" names\");\nreturn names;\n"
            },
            {
                id: "task-outputs",
                title: "Scriptable task outputs",
                mode: "task",
                inputs: [{ name: "vmName", value: "\"web-01\"" }],
                outputs: ["hostname", "fqdn"],
                code: "// Scriptable tasks are not functions: `return` is a syntax error here.\n// Top-level variables listed under Outputs are bound like workflow outputs.\nhostname = vmName.toLowerCase();\nfqdn = hostname + \".vmw.lab\";\nSystem.log(\"fqdn = \" + fqdn);\n"
            },
            {
                id: "task-return",
                title: "Why `return` fails in a task",
                mode: "task",
                code: "var x = 1;\nif (x > 0) {\n    return; // SyntaxError: invalid return  (switch to Action mode and it runs)\n}\n"
            },
            {
                id: "task-exit",
                title: "Early exit from a task (labelled block)",
                mode: "task",
                code: "// The usual workaround for `return` in a scriptable task.\nmain: {\n    var cat = Server.getConfigurationElementCategoryWithPath(\"Web/Settings\");\n    if (!cat) {\n        System.warn(\"Category missing, skipping\");\n        break main;\n    }\n    System.log(\"Found \" + cat.configurationElements.length + \" element(s)\");\n}\nSystem.log(\"Task finished\");\n"
            }
        ]
    },
    {
        group: "vCenter (mock)",
        items: [
            {
                id: "list-vms",
                title: "List VMs",
                code: "var vms = VcPlugin.getAllVirtualMachines();\nfor (var i = 0; i < vms.length; i++) {\n    var vm = vms[i];\n    System.log(vm.name + \"  \" + vm.runtime.powerState.value + \"  \" +\n        vm.config.hardware.numCPU + \" vCPU / \" + vm.config.hardware.memoryMB + \" MB\" +\n        (vm.config.template ? \"  [template]\" : \"\"));\n}\nreturn vms.length;\n"
            },
            {
                id: "power-on",
                title: "Power on & wait for task",
                inputs: [{ name: "vm", value: "Server.findForType(\"VC:VirtualMachine\", \"vcsa01.vmw.lab,vm-104\")" }],
                code: "System.log(\"Before: \" + vm.runtime.powerState.value);\nvar task = vm.powerOnVM_Task(null);\nSystem.getModule(\"com.vmware.library.vc.basic\").vim3WaitTaskEnd(task, true, 2);\nSystem.log(\"After: \" + vm.runtime.powerState.value);\nreturn vm;\n"
            },
            {
                id: "power-off-prod",
                title: "Filter by xpath & power off",
                code: "var web = VcPlugin.getAllVirtualMachines(null, \"xpath:name[matches(.,'web-.*')]\");\nweb.forEach(function (vm) {\n    if (vm.runtime.powerState.value === \"poweredOn\") {\n        var t = vm.powerOffVM_Task();\n        System.getModule(\"com.vmware.library.vc.basic\").vim3WaitTaskEnd(t, true, 2);\n        System.log(vm.name + \" powered off\");\n    }\n});\n"
            },
            {
                id: "reconfig",
                title: "Reconfigure CPU / memory",
                inputs: [{ name: "vm", value: "VcPlugin.getAllVirtualMachines()[0]" }, { name: "cpu", value: "4" }, { name: "memGB", value: "8" }],
                code: "var spec = new VcVirtualMachineConfigSpec();\nspec.numCPUs = cpu;\nspec.memoryMB = memGB * 1024;\nvar task = vm.reconfigVM_Task(spec);\nSystem.getModule(\"com.vmware.library.vc.basic\").vim3WaitTaskEnd(task, true, 2);\nSystem.log(vm.name + \" now \" + vm.config.hardware.numCPU + \" vCPU / \" + vm.config.hardware.memoryMB + \" MB\");\n"
            },
            {
                id: "template-error",
                title: "Task error handling",
                code: "var tpl = VcPlugin.getAllVirtualMachines(null, \"xpath:name='tpl-ubuntu-24'\")[0];\ntry {\n    System.getModule(\"com.vmware.library.vc.basic\").vim3WaitTaskEnd(tpl.powerOnVM_Task(), true, 2);\n} catch (e) {\n    System.error(\"Power on failed: \" + e.message);\n}\n"
            }
        ]
    },
    {
        group: "Server & elements",
        items: [
            {
                id: "config-element",
                title: "Configuration element",
                code: "var cat = Server.getConfigurationElementCategoryWithPath(\"Web/Settings\");\nvar ce = cat.configurationElements[0];\nce.attributes.forEach(function (a) {\n    System.log(a.name + \" = \" + a.value);\n});\nreturn ce.getAttributeWithKey(\"domain\").value;\n"
            },
            {
                id: "resource-element",
                title: "Resource element (JSON)",
                code: "var cat = Server.getResourceElementCategoryWithPath(\"Web/Templates\");\nvar re = cat.resourceElements.filter(function (r) { return r.name === \"vm-request.json\"; })[0];\nvar body = JSON.parse(re.getContentAsMimeAttachment().content);\nbody.name = \"web-03\";\nreturn JSON.stringify(body);\n"
            },
            {
                id: "rest",
                title: "REST call (canned response)",
                code: "var host = RESTHostManager.getHost(RESTHostManager.getHosts()[0]);\nvar req = host.createRequest(\"POST\", \"/networks/1/next-ip\", \"{}\");\nreq.contentType = \"application/json\";\nreq.setHeader(\"Accept\", \"application/json\");\nvar resp = req.execute();\nSystem.log(\"HTTP \" + resp.statusCode);\nvar ip = JSON.parse(resp.contentAsString).ip;\nreturn ip;\n"
            },
            {
                id: "locking",
                title: "LockingSystem",
                code: "var owner = \"run-\" + System.nextUUID();\nif (LockingSystem.lock(\"ip-allocation\", owner)) {\n    try {\n        System.log(\"Got the lock, allocating...\");\n    } finally {\n        LockingSystem.unlock(\"ip-allocation\", owner);\n    }\n}\n"
            },
            {
                id: "mock-action",
                title: "Call a mocked action",
                code: "// Define your own actions under Mocks > actions.\nvar s = System.getModule(\"com.example.utils\").toUpperSnake(\"vmPowerState\");\nreturn s;\n"
            }
        ]
    },
    {
        group: "Language & engine",
        items: [
            {
                id: "engine-info",
                title: "Which engine am I on?",
                code: "// Run this on 8.x and 9.x (or use Run on both).\nSystem.log(typeof console === \"undefined\" ? \"no console object (8.x)\" : \"console exists (9.x)\");\ntry {\n    eval(\"var f = (a) => a * 2;\");\n    System.log(\"Arrow functions: supported\");\n} catch (e) {\n    System.log(\"Arrow functions: \" + e.message);\n}\n"
            },
            {
                id: "modern-js",
                title: "9.x modern JavaScript",
                code: "// Runs on 9.x; fails to parse on 8.x.\nconst vms = VcPlugin.getAllVirtualMachines();\nconst on = vms.filter(vm => vm.runtime.powerState.value === \"poweredOn\");\nconst byName = new Map(on.map(vm => [vm.name, vm.config.hardware.numCPU]));\n// `for (const [k, v] of map)` is a SyntaxError on Rhino 1.7.15 — use var:\nfor (var [name, cpu] of byName) {\n    console.log(`${name}: ${cpu} vCPU`);\n}\n// [...byName.keys()] would be a SyntaxError: spread is still not supported in 9.x\nreturn Array.from(byName.keys());\n"
            },
            {
                id: "java-util",
                title: "java.util and the class shutter",
                code: "var map = new java.util.HashMap();\nmap.put(\"vm\", \"web-01\");\nSystem.log(\"get: \" + map.get(\"vm\"));\nSystem.log(\"property access: \" + map.vm);   // works on 9.x only\n\ntry {\n    var f = new java.io.File(\"/etc/hosts\");     // outside java.util.* -> blocked\n} catch (e) {\n    System.error(e);\n}\n"
            },
            {
                id: "e4x",
                title: "E4X (XML)",
                code: "var xml = <vms>\n  <vm name=\"web-01\" cpu=\"2\"/>\n  <vm name=\"db-01\" cpu=\"8\"/>\n</vms>;\nfor each (var vm in xml.vm) {\n    System.log(vm.@name + \" has \" + vm.@cpu + \" vCPU\");\n}\nreturn xml.vm.length();\n"
            },
            {
                id: "for-each",
                title: "for each...in (JS 1.6)",
                code: "var total = 0;\nfor each (var vm in VcPlugin.getAllVirtualMachines()) {\n    total += vm.config.hardware.numCPU;\n}\nreturn total;\n"
            }
        ]
    },
    {
        group: "From cloudblogger",
        items: [
            {
                "id": "cb-first-class",
                "title": "First-class functions & closures",
                "code": "// CB10099: functions are values — pass them, return them, keep private state.\nfunction performOperation(a, b, cb) {\n    cb(a + b);\n}\nperformOperation(2, 3, function (result) {\n    System.log(\"The result of the operation is \" + result);\n});\n\nvar next = (function () {\n    var counter = 0;          // private\n    return function () { return ++counter; };\n})();\nSystem.log(next()); // 1\nSystem.log(next()); // 2\n"
            },
            {
                "id": "cb-classes",
                "title": "Custom class without `class`",
                "code": "// CB10099: `class` is a reserved word in both 8.x and 9.x, so use constructors + prototypes.\nfunction Person(name, isDeveloper) {\n    this.name = name;\n    this.isDeveloper = isDeveloper || false;\n}\nPerson.prototype.writesCode = function () {\n    System.log(this.name + (this.isDeveloper ? \" writes code\" : \" does not write code\"));\n};\nnew Person(\"Bob\", true).writesCode();\nnew Person(\"Alice\").writesCode();\n\n// Properties four ways\nvar o = {};\no.a = 1;\no[\"b\"] = 2;\nObject.defineProperty(o, \"c\", { value: 3, enumerable: true });\nObject.defineProperties(o, { d: { value: 4, writable: false, enumerable: true } });\no.d = 99;               // ignored: not writable\nreturn JSON.stringify(o);\n"
            },
            {
                "id": "cb-scope",
                "title": "Labels, with, bind, __proto__",
                "code": "// CB10099 snippets that behave the same on both engines.\nvar str = \"\";\nloop1:\nfor (var i = 0; i < 5; i++) {\n    if (i === 1) continue loop1;\n    str += i;\n}\nSystem.log(str); // 0234\n\nvar box = { dimensions: { width: 2, height: 3, length: 4 } };\nwith (box.dimensions) {\n    var volume = width * height * length;\n}\nSystem.log(volume); // 24\n\nvar mod = { x: 42, getX: function () { return this.x; } };\nvar unbound = mod.getX;\nSystem.log(unbound());           // undefined\nSystem.log(unbound.bind(mod)()); // 42\n\nvar p = { a: 1, b: 2, __proto__: { b: 3, c: 4 } };\nSystem.log([p.a, p.b, p.c, p.d].join()); // 1,2,4,\n"
            },
            {
                "id": "cb-java-array",
                "title": "JS → Java array limitation",
                "code": "// vCenter data objects convert a JS array to a fixed-size Java array on assignment.\nvar spec = new VcVirtualMachineConfigSpec();\nspec.deviceChange = [];\nspec.deviceChange[0] = new VcVirtualDeviceConfigSpec();\nSystem.log(\"assign, then push by index: \" + spec.deviceChange[0]);   // undefined\n\n// Workaround: build the array locally, then assign it once.\nvar changes = [];\nchanges[0] = new VcVirtualDeviceConfigSpec();\nspec.deviceChange = changes;\nSystem.log(\"build locally, then assign: \" + spec.deviceChange[0]);  // VcVirtualDeviceConfigSpec\n"
            },
            {
                "id": "cb-dates",
                "title": "Date and time",
                "code": "System.log(\"now (ms): \" + System.getCurrentTime());\n\nvar d1 = System.getDateFromFormat(\"2019-01-01T01:45:00.100\", \"yyyy-MM-dd'T'HH:mm:ss.SSS\");\nvar d2 = System.getDateFromFormat(\"20-Apr-2025 11:09:21\", \"dd-MMM-yyyy' 'HH:mm:ss\");\nvar d3 = System.getDateFromFormat(\"2023-05-08T16:58:34Z\", \"yyyy-MM-dd'T'HH:mm:ss'Z'\");\n[d1, d2, d3].forEach(function (d) {\n    System.log(System.formatDate(d, \"dd MMM yyyy HH:mm:ss\") + \"  |  \" + d.toISOString());\n});\n\nvar days = Math.round((d2.getTime() - d1.getTime()) / 86400000);\nreturn days + \" days between d1 and d2\";\n"
            },
            {
                "id": "cb-serialization",
                "title": "Serialization: XML, functions, `this`",
                "mode": "task",
                "outputs": [
                    "vmXml",
                    "vmXmlString",
                    "helper"
                ],
                "code": "// Scriptable tasks don't run in Rhino's root scope:\nSystem.log(this);   // [object Object], not the global object\n\n// XML is not serialized between workflow elements — pass a string instead.\nvar vmXml = <vm name=\"web-01\"/>;\nvar vmXmlString = vmXml.toXMLString();\n\n// Functions can't be passed to the next element either.\nvar helper = function () { return 1; };\n// Check the NOTE lines under Outputs after running.\n"
            }
        ]
    }
];
