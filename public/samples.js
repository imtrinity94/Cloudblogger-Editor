/* Sidebar samples. inputs are applied along with the code (values are JavaScript expressions). */
window.VRO_SAMPLES = [
    {
        group: "Real-world scripts",
        items: [
            {
                id: "rw-naming",
                title: "Next VM name (naming standard)",
                code: "// Request-time action: work out the next free hostname for a naming standard\n// like \"<base>-NN\" and build the FQDN from the environment's config element.\nvar existing = VcPlugin.getAllVirtualMachines(null, \"xpath:name[matches(.,'\" + baseName + \"-[0-9]+')]\");\nvar used = existing.map(function (vm) { return parseInt(vm.name.split(\"-\").pop(), 10); });\nSystem.log(\"Existing \" + baseName + \" VMs: \" + existing.map(function (vm) { return vm.name; }).join(\", \"));\n\nvar next = 1;\nwhile (used.indexOf(next) >= 0) next++;\nvar name = baseName + \"-\" + (next < 10 ? \"0\" + next : next);\n\nvar settings = Server.getConfigurationElementCategoryWithPath(\"Web/Settings\").configurationElements[0];\nvar domain = settings.getAttributeWithKey(\"domain\").value;\n\nSystem.log(\"Next name: \" + name + \".\" + domain);\nreturn name + \".\" + domain;\n",
                inputs: [
                    {
                        name: "baseName",
                        value: "\"web\""
                    }
                ]
            },
            {
                id: "rw-snapshot-report",
                title: "Snapshot age report (+ cleanup)",
                code: "// Daily hygiene: find snapshots older than the limit for the environment.\n// With dryRun = false it removes them; with true it only reports.\nvar envCe = null;\nServer.getConfigurationElementCategoryWithPath(\"Web/Environments\").configurationElements.forEach(function (ce) {\n    if (ce.name === env) envCe = ce;\n});\nif (!envCe) throw new Error(\"No configuration element for environment '\" + env + \"'\");\nvar maxAge = envCe.getAttributeWithKey(\"snapshotMaxAgeDays\").value;\nvar now = System.getCurrentTime();\nvar waitTask = System.getModule(\"com.vmware.library.vc.basic\").vim3WaitTaskEnd;\n\nvar rows = [\"vm,snapshot,ageDays,action\"];\nVcPlugin.getAllVirtualMachines().forEach(function (vm) {\n    if (!vm.snapshot) return;\n    vm.snapshot.rootSnapshotList.forEach(function (snap) {\n        var age = Math.floor((now - snap.createTime.getTime()) / 86400000);\n        if (age <= maxAge) return;\n        var action = dryRun ? \"would remove\" : \"removed\";\n        if (!dryRun) waitTask(vm.removeAllSnapshots_Task(), true, 2);\n        System.warn(vm.name + \": '\" + snap.name + \"' is \" + age + \" days old (limit \" + maxAge + \") - \" + action);\n        rows.push([vm.name, snap.name, age, action].join(\",\"));\n    });\n});\nSystem.log((rows.length - 1) + \" snapshot(s) over the limit\");\nreturn rows.join(\"\\n\");\n",
                inputs: [
                    {
                        name: "env",
                        value: "\"prod\""
                    },
                    {
                        name: "dryRun",
                        value: "true"
                    }
                ]
            },
            {
                id: "rw-compliance",
                title: "Compliance audit (tags, owner, tools)",
                code: "// Find VMs that break the standard: no tags, no owner in the notes,\n// or VMware Tools not running on a powered-on VM.\nvar findings = [];\nVcPlugin.getAllVirtualMachines().forEach(function (vm) {\n    if (vm.config.template) return;\n    var issues = [];\n    if (!vm.tags || vm.tags.length === 0) issues.push(\"no tags\");\n    if (!/Owner:/i.test(vm.config.annotation || \"\") && vm.tags.join().indexOf(\"app:\") < 0) issues.push(\"no owner\");\n    if (vm.runtime.powerState.value === \"poweredOn\" && vm.guest.toolsRunningStatus !== \"guestToolsRunning\") {\n        issues.push(\"tools not running\");\n    }\n    if (issues.length) {\n        System.warn(vm.name + \": \" + issues.join(\", \"));\n        findings.push({ vm: vm.name, issues: issues });\n    }\n});\nSystem.log(findings.length + \" non-compliant VM(s)\");\nreturn JSON.stringify(findings, null, 2);\n"
            },
            {
                id: "rw-ipam",
                title: "Allocate an IP from IPAM (REST)",
                code: "// Typical pre-provisioning step: look up the network in IPAM, reserve the next\n// IP and return everything the customization spec needs.\nvar ipam = RESTHostManager.getHost(RESTHostManager.getHosts()[0]);\n\nfunction call(method, url, body) {\n    var req = ipam.createRequest(method, url, body ? JSON.stringify(body) : null);\n    req.contentType = \"application/json\";\n    req.setHeader(\"Accept\", \"application/json\");\n    var resp = req.execute();\n    if (resp.statusCode >= 300) {\n        throw new Error(method + \" \" + url + \" failed: HTTP \" + resp.statusCode + \" \" + resp.contentAsString);\n    }\n    return JSON.parse(resp.contentAsString);\n}\n\nvar network = call(\"GET\", \"/networks?name=\" + encodeURIComponent(networkName))[0];\nif (!network) throw new Error(\"Network '\" + networkName + \"' not found in IPAM\");\nvar reservation = call(\"POST\", \"/networks/\" + network.id + \"/next-ip\", { hostname: hostname });\n\nvar dns = Server.getConfigurationElementCategoryWithPath(\"Web/Settings\")\n    .configurationElements[0].getAttributeWithKey(\"dnsServers\").value;\n\nvar result = new Properties();\nresult.put(\"ip\", reservation.ip);\nresult.put(\"cidr\", network.cidr);\nresult.put(\"gateway\", network.gateway);\nresult.put(\"dns\", dns.join(\",\"));\nSystem.log(\"Reserved \" + reservation.ip + \" for \" + hostname + \" in \" + network.cidr);\nreturn result;\n",
                inputs: [
                    {
                        name: "networkName",
                        value: "\"app-1010\""
                    },
                    {
                        name: "hostname",
                        value: "\"web-03\""
                    }
                ]
            },
            {
                id: "rw-retry",
                title: "REST call with retry & backoff",
                code: "// External systems fail. Retry with exponential backoff, then fail with a\n// message an operator can act on. (The CMDB mock always answers 503.)\nvar cmdb = RESTHostManager.getHost(RESTHostManager.getHosts()[1]);\nvar maxAttempts = 3, delayMs = 200;\n\nfor (var attempt = 1; attempt <= maxAttempts; attempt++) {\n    var resp = cmdb.createRequest(\"GET\", \"/ci/\" + ciName, null).execute();\n    if (resp.statusCode === 200) {\n        return JSON.parse(resp.contentAsString);\n    }\n    System.warn(\"Attempt \" + attempt + \"/\" + maxAttempts + \": HTTP \" + resp.statusCode);\n    if (resp.statusCode < 500 || attempt === maxAttempts) break;\n    System.sleep(delayMs);\n    delayMs *= 2;\n}\nthrow new Error(\"CMDB lookup for '\" + ciName + \"' failed after \" + attempt + \" attempt(s), last status \" + resp.statusCode);\n",
                inputs: [
                    {
                        name: "ciName",
                        value: "\"web-01\""
                    }
                ]
            },
            {
                id: "rw-capacity",
                title: "Cluster capacity & overcommit",
                code: "// Capacity check before a big request: physical vs allocated vCPU/RAM\n// for powered-on VMs, ignoring hosts in maintenance mode.\nvar hosts = VcPlugin.getAllHostSystems().filter(function (h) { return !h.runtime.inMaintenanceMode; });\nvar cores = 0, memGB = 0;\nhosts.forEach(function (h) {\n    cores += h.summary.hardware.numCpuCores;\n    memGB += h.summary.hardware.memorySize / 1073741824;\n});\n\nvar vcpu = 0, vramGB = 0;\nVcPlugin.getAllVirtualMachines().forEach(function (vm) {\n    if (vm.runtime.powerState.value !== \"poweredOn\") return;\n    vcpu += vm.config.hardware.numCPU;\n    vramGB += vm.config.hardware.memoryMB / 1024;\n});\n\nvar cpuRatio = (vcpu / cores).toFixed(2);\nvar memPct = (vramGB / memGB * 100).toFixed(1);\nSystem.log(\"Hosts in service: \" + hosts.length + \" (\" + cores + \" cores, \" + memGB + \" GB)\");\nSystem.log(\"Allocated: \" + vcpu + \" vCPU, \" + vramGB + \" GB\");\nSystem.log(\"vCPU:pCPU = \" + cpuRatio + \":1, memory used \" + memPct + \"%\");\nif (vcpu + requestedCpu > cores * maxRatio) {\n    throw new Error(\"Request for \" + requestedCpu + \" vCPU would exceed \" + maxRatio + \":1 overcommit\");\n}\nreturn \"OK to place \" + requestedCpu + \" vCPU\";\n",
                inputs: [
                    {
                        name: "requestedCpu",
                        value: "16"
                    },
                    {
                        name: "maxRatio",
                        value: "4"
                    }
                ]
            },
            {
                id: "rw-vra-subscription",
                title: "VCFA/vRA subscription: read inputProperties",
                code: "// Event broker subscription action (e.g. compute.provision.pre). The payload\n// arrives as inputProperties; return the custom properties you want to change.\nSystem.log(\"Event for: \" + inputProperties.resourceNames.join(\", \"));\nvar cp = inputProperties.customProperties || {};\n\nvar env = cp.environment || \"dev\";\nvar envCe = Server.getConfigurationElementCategoryWithPath(\"Web/Environments\")\n    .configurationElements.filter(function (ce) { return ce.name === env; })[0];\n\nvar out = new Properties();\nvar updated = {};\nfor (var k in cp) updated[k] = cp[k];\nupdated.network = envCe.getAttributeWithKey(\"network\").value;\nupdated.approvalRequired = String(envCe.getAttributeWithKey(\"approvalRequired\").value);\nupdated.requestedBy = System.getContext().getParameter(\"__asd_requestedBy\");\nout.put(\"customProperties\", updated);\n\nSystem.log(\"Network -> \" + updated.network + \", approval required: \" + updated.approvalRequired);\nreturn out;\n",
                inputs: [
                    {
                        name: "inputProperties",
                        value: "{ resourceNames: [\"web-03\"], customProperties: { environment: \"prod\", app: \"shop\", size: \"medium\" } }"
                    }
                ]
            },
            {
                id: "rw-validate",
                title: "Validate a VM request",
                code: "// Custom form validation: return every problem at once instead of failing\n// on the first. Limits come from the configuration element.\nvar settings = Server.getConfigurationElementCategoryWithPath(\"Web/Settings\").configurationElements[0];\nvar maxCpu = settings.getAttributeWithKey(\"maxCpu\").value;\nvar errors = [];\n\nif (!/^[a-z][a-z0-9-]{1,13}[a-z0-9]$/.test(hostname)) {\n    errors.push(\"Hostname '\" + hostname + \"' must be 3-15 chars: lower case, digits, hyphens, starting with a letter\");\n}\nif (VcPlugin.getAllVirtualMachines(null, \"xpath:name='\" + hostname + \"'\").length) {\n    errors.push(\"A VM named '\" + hostname + \"' already exists\");\n}\nif (cpu > maxCpu) errors.push(\"CPU \" + cpu + \" is above the limit of \" + maxCpu);\nif (memoryGB % 2 !== 0) errors.push(\"Memory must be a multiple of 2 GB\");\n\nerrors.forEach(function (e) { System.warn(e); });\nreturn errors.length ? errors.join(\"\\n\") : \"\";\n",
                inputs: [
                    {
                        name: "hostname",
                        value: "\"Web_01\""
                    },
                    {
                        name: "cpu",
                        value: "12"
                    },
                    {
                        name: "memoryGB",
                        value: "5"
                    }
                ]
            },
            {
                id: "rw-modern-9x",
                title: "Snapshot report in 9.x syntax",
                code: "// Same idea as the snapshot report, written with 9.x features.\n// Run on both: 8.x stops at the first arrow function.\nconst now = System.getCurrentTime();\nconst ageDays = snap => Math.floor((now - snap.createTime.getTime()) / 86400000);\n\nconst old = VcPlugin.getAllVirtualMachines()\n    .filter(vm => vm.snapshot)\n    .flatMap(vm => vm.snapshot.rootSnapshotList.map(s => ({ vm: vm.name, snap: s.name, age: ageDays(s) })))\n    .filter(r => r.age > limit);\n\nold.forEach(r => console.log(`${r.vm}: ${r.snap} (${r.age} days)`));\nreturn Object.fromEntries(old.map(r => [r.vm, r.age]));\n",
                inputs: [
                    {
                        name: "limit",
                        value: "7"
                    }
                ]
            }
        ]
    },
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
                title: "Inputs & return value",
                inputs: [
                    {
                        name: "firstName",
                        value: "\"Mayank\""
                    },
                    {
                        name: "count",
                        value: "3"
                    }
                ],
                code: "// Actions run wrapped in a function, so `return` works.\n// Inputs come from the Inputs tab (values are JavaScript expressions).\nvar names = [];\nfor (var i = 0; i < count; i++) {\n    names.push(firstName + \"-\" + (i + 1));\n}\nSystem.log(\"Generated \" + names.length + \" names\");\nreturn names;\n"
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
                inputs: [
                    {
                        name: "vm",
                        value: "Server.findForType(\"VC:VirtualMachine\", \"vcsa01.vmw.lab,vm-104\")"
                    }
                ],
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
                inputs: [
                    {
                        name: "vm",
                        value: "VcPlugin.getAllVirtualMachines()[0]"
                    },
                    {
                        name: "cpu",
                        value: "4"
                    },
                    {
                        name: "memGB",
                        value: "8"
                    }
                ],
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
                id: "cb-first-class",
                title: "First-class functions & closures",
                code: "// CB10099: functions are values — pass them, return them, keep private state.\nfunction performOperation(a, b, cb) {\n    cb(a + b);\n}\nperformOperation(2, 3, function (result) {\n    System.log(\"The result of the operation is \" + result);\n});\n\nvar next = (function () {\n    var counter = 0;          // private\n    return function () { return ++counter; };\n})();\nSystem.log(next()); // 1\nSystem.log(next()); // 2\n"
            },
            {
                id: "cb-classes",
                title: "Custom class without `class`",
                code: "// CB10099: `class` is a reserved word in both 8.x and 9.x, so use constructors + prototypes.\nfunction Person(name, isDeveloper) {\n    this.name = name;\n    this.isDeveloper = isDeveloper || false;\n}\nPerson.prototype.writesCode = function () {\n    System.log(this.name + (this.isDeveloper ? \" writes code\" : \" does not write code\"));\n};\nnew Person(\"Bob\", true).writesCode();\nnew Person(\"Alice\").writesCode();\n\n// Properties four ways\nvar o = {};\no.a = 1;\no[\"b\"] = 2;\nObject.defineProperty(o, \"c\", { value: 3, enumerable: true });\nObject.defineProperties(o, { d: { value: 4, writable: false, enumerable: true } });\no.d = 99;               // ignored: not writable\nreturn JSON.stringify(o);\n"
            },
            {
                id: "cb-scope",
                title: "Labels, with, bind, __proto__",
                code: "// CB10099 snippets that behave the same on both engines.\nvar str = \"\";\nloop1:\nfor (var i = 0; i < 5; i++) {\n    if (i === 1) continue loop1;\n    str += i;\n}\nSystem.log(str); // 0234\n\nvar box = { dimensions: { width: 2, height: 3, length: 4 } };\nwith (box.dimensions) {\n    var volume = width * height * length;\n}\nSystem.log(volume); // 24\n\nvar mod = { x: 42, getX: function () { return this.x; } };\nvar unbound = mod.getX;\nSystem.log(unbound());           // undefined\nSystem.log(unbound.bind(mod)()); // 42\n\nvar p = { a: 1, b: 2, __proto__: { b: 3, c: 4 } };\nSystem.log([p.a, p.b, p.c, p.d].join()); // 1,2,4,\n"
            },
            {
                id: "cb-java-array",
                title: "JS → Java array limitation",
                code: "// vCenter data objects convert a JS array to a fixed-size Java array on assignment.\nvar spec = new VcVirtualMachineConfigSpec();\nspec.deviceChange = [];\nspec.deviceChange[0] = new VcVirtualDeviceConfigSpec();\nSystem.log(\"assign, then push by index: \" + spec.deviceChange[0]);   // undefined\n\n// Workaround: build the array locally, then assign it once.\nvar changes = [];\nchanges[0] = new VcVirtualDeviceConfigSpec();\nspec.deviceChange = changes;\nSystem.log(\"build locally, then assign: \" + spec.deviceChange[0]);  // VcVirtualDeviceConfigSpec\n"
            },
            {
                id: "cb-dates",
                title: "Date and time",
                code: "System.log(\"now (ms): \" + System.getCurrentTime());\n\nvar d1 = System.getDateFromFormat(\"2019-01-01T01:45:00.100\", \"yyyy-MM-dd'T'HH:mm:ss.SSS\");\nvar d2 = System.getDateFromFormat(\"20-Apr-2025 11:09:21\", \"dd-MMM-yyyy' 'HH:mm:ss\");\nvar d3 = System.getDateFromFormat(\"2023-05-08T16:58:34Z\", \"yyyy-MM-dd'T'HH:mm:ss'Z'\");\n[d1, d2, d3].forEach(function (d) {\n    System.log(System.formatDate(d, \"dd MMM yyyy HH:mm:ss\") + \"  |  \" + d.toISOString());\n});\n\nvar days = Math.round((d2.getTime() - d1.getTime()) / 86400000);\nreturn days + \" days between d1 and d2\";\n"
            },
            {
                id: "cb-serialization",
                title: "Serialization: XML, functions, this",
                code: "// System.log(this) is not the Rhino global object in Orchestrator:\nSystem.log(this);   // [object Object]\n\n// XML is not serialized between workflow elements, so return a string.\nvar vmXml = <vm name=\"web-01\"/>;\nSystem.log(\"as string: \" + vmXml.toXMLString());\n\n// Returning the XML object itself shows the NOTE below the return value.\nreturn vmXml;\n"
            }
        ]
    }
];
