# Cloudblogger Editor

**A vRO / VCF Orchestrator script console that runs your JavaScript on the real Rhino engines, in the browser.**

| Orchestrator | Engine | Language level |
|---|---|---|
| Aria Automation Orchestrator 8.x | Mozilla Rhino **1.7R4** | JavaScript 1.7 |
| VCF Operations Orchestrator 9.0 | Mozilla Rhino **1.7.15** | ES6 mode (+ Java Map access) |
| VCF Operations Orchestrator 9.1 | Mozilla Rhino **1.9.1** | ES6 mode, profile measured on a real 9.1.1 server |

Earlier versions of this project emulated vRO with the browser's own JavaScript engine and regex checks. That could never reproduce Rhino's behaviour (Java strings, `for each`, E4X, exactly which ES6+ syntax parses). Version 2 compiles the actual Rhino release tags (1.7.x to Java 8 bytecode, 1.9.1 to Java 11) and runs them in [CheerpJ](https://cheerpj.com), a WebAssembly JVM. The page is fully static, so it hosts on Vercel and nothing is sent to a server.

## What behaves like Orchestrator

- **Syntax and built-ins come from the real parser and runtime.** Arrow functions fail on 8.x and work on 9.x. `class` fails everywhere; spread in calls and `for (const x of ...)` still fail on 9.1, while `?.`, `??`, default parameters and destructuring with defaults work on 9.1 but not 9.0. See the [measured feature matrix](docs/feature-matrix.md).
- **The 9.1 profile is checked against a real server.** All 58 language probes give the same result as Orchestrator 9.1.1 (build 25643527), and the test suite fails if that ever changes.
- **Class shutter:** only `java.util.*` is reachable, which is the vRO default. `new java.io.File(...)` fails the way it does on a real server.
- **Scripts run like an action.** They are wrapped in a function, so `return` gives the return value, and the Inputs tab supplies the parameters.
- **Your own scripts.** "+ New script" starts a blank one and "Save current" keeps it under My scripts in your browser.
- **Version-specific runtime.** 9.0 enables `FEATURE_ENABLE_JAVA_MAP_ACCESS` (`map.key`) and a `console` object; 8.x has neither. 9.1 copies what a 9.1.1 server does: `java.util.ArrayList` becomes a JavaScript array, `java.util.HashMap` becomes `Properties`, there is no `console`, `Command.execute` is disabled, and file reads outside `/var/run/vco` and the temp directory are denied with the server's message.
- **Errors and line numbers come straight from Rhino.** They're labelled the way Orchestrator labels an action: `(Dynamic Script Module name : myAction#3)`.
- **Runaway loops are stopped** by Rhino's instruction observer after 15 s.
- **Serialization rules are flagged.** Returning an XML object or a function gets a note, because Orchestrator can't pass those between workflow elements.
- **vCenter plug-in array conversion is reproduced.** Assigning `[]` to `spec.deviceChange` and then writing `spec.deviceChange[0]` is silently lost, while building the array first works. See [the post](https://cloudblogger.co.in/2022/04/03/javascript-to-java-conversion-limitation-in-vro/).

## API catalog, explorer and autocomplete

The editor carries the scripting API of the core plug-in and 12 plug-ins from [modernvroapi.in](https://modernvroapi.in): **6,260 classes, 6,252 methods and 38,163 attributes** (vCenter, vAPI, REST, SQL, SSH, PowerShell, Active Directory, Aria Automation, VCF Automation, Infoblox, XML, Mail; AWS, F5 and Avi are not included yet).

- **API Explorer** (left, next to Scripts): plug-in → class tree, search across classes and members, and an **API** tab with constructors, attributes and methods, type links and *Insert* into the editor. Right-click a class name in the editor for *Open in API Explorer*.
- **Autocomplete, hover docs and signature help** come from generated TypeScript declarations. Small plug-ins load with the editor; vCenter, vAPI and Aria Automation load the first time a script names one of their classes.
- **Runtime stubs**: any catalog class without a hand-written mock (below) still works in a script. Constructors and static calls (`ActiveDirectory.search(...)`, `new SSHSession(...)`) work, attributes return a typed default, and every method call writes a `[stub] Class.method() → Type` debug line and returns a placeholder: `""`, `0`, `false`, `[]`, `null` for Any, a new `Properties`/`Date`, a finished `VcTask`, or a stub of the documented return type, so chains like `XMLManager.fromString(x).getDocumentElement()` keep going. Mock vCenter objects and hand-written classes keep their behaviour and only gain the members they lack. Stubs let a script run end to end; they do not produce real results.

The catalog is generated, not hand-edited:

```sh
npm run build:catalog -- ../modern-vroapi   # reads vro-doc-site/src/data/plugins/*.json
```

It writes `public/catalog/catalog.json` and a content-hashed `public/catalog/v-<hash>/` with per-plug-in details, `.d.ts` files and `stubs.txt`. The page sends the engine only the classes a script can reach (the names it uses plus every type reachable from them), once per engine.

## Mocked vRO APIs

Implemented in [`public/engine/vro-mocks.js`](public/engine/vro-mocks.js), which is plain ES5 loaded into Rhino before your script:

- **`System`**: the full o11n-core API — logging, `sleep`, `getModule`/`getAllModules`, `getContext`, `nextUUID`, dates (`formatDate`, `getDateFromFormat`, `getDate`), formatting (`formatNumber`, `formatDuration`, `formatBinaryValue`, `decimalToHex`/`hexToDecimal`), `compareVersionNumber`, path helpers, `getTempDirectory`/`createTempFile`, object helpers (`getObjectClassName`, `getObjectType`…), DNS helpers backed by the mock inventory, custom events. Outputs match a 9.1.1 server.
- **`Server`**: configuration and resource elements, `findForType`, `findAllForType`
- **`VcPlugin`** and VC objects:
  - VMs, hosts, clusters, datastores, networks
  - VM power operations, reconfigure, rename, snapshots, destroy
  - `VcTask`, plus `com.vmware.library.vc.basic/vim3WaitTaskEnd`
- **`RESTHost`, `RESTHostManager`, `RESTRequest`, `RESTResponse`**: canned responses from route rules
- **`URL`**: the real attributes and methods (`addPath`, `addParameter`, host/IP validation and escaping); `getContent`/`post` use the REST routes
- **`File`, `FileReader`, `FileWriter`, `ZipWriter`**: an in-memory file system that lasts for one run
- **`Properties`, `LockingSystem`, `ByteBuffer`, `MimeAttachment`, `Command`** (never executes anything)
- **Your own mocked actions**, called through `System.getModule("com.acme").myAction(...)`

Several core classes (System helpers, URL, File, ZipWriter, ByteBuffer, MimeAttachment, Command) started from [Stefan Schnell's VCF Automation emulator](https://github.com/StSchnell/Data-Center-Automation) (MIT, see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)). They were adapted to run without Java access inside the engine, limited to methods that exist in the real API, and changed to return what a real server returns.

All of this reads an editable JSON inventory: the **Mocks** tab, defaulting to [`fixture.default.json`](public/engine/fixture.default.json). Nothing connects to real infrastructure.

## Run locally

```sh
npm run dev          # serves public/ on http://localhost:8080
```

or `docker build -t cloudblogger-editor . && docker run -p 8080:80 cloudblogger-editor`.

The server must support HTTP Range requests, because CheerpJ loads the jars in chunks. `serve`, nginx and Vercel all do; `python -m http.server` does not.

## Deploy to Vercel

Import the repo. `vercel.json` sets `public/` as the output directory with no build step. The prebuilt jars in `public/engines/v-<hash>/` are committed; the folder name is a hash of their contents, so a changed jar always gets a new URL.

## Rebuilding the engines

```sh
npm run build:engine   # needs git + JDK 11+; clones Rhino tags, compiles 1.7.x to Java 8 and 1.9.1 to Java 11
npm test               # 317 tests on a desktop JVM (same jars as the browser), incl. real 9.1.1 outputs
npm run matrix         # regenerates docs/feature-matrix.md
```

Layout:

```
engine/java/vroconsole/Runner.java     compiled once per Rhino version (shutter, wrapping, timeouts)
engine/launcher/vroconsole/Launcher.java  loads each engine in its own class loader
public/engines/v-<hash>/*.jar          rhino-1.7R4, rhino-1.7.15, rhino-1.9.1, runner-8x/9x/91x, launcher
public/engine/                         mocks, default inventory, version profiles, request builder
engine/catalog/build-catalog.js        builds public/catalog/ from the modern-vroapi data
public/catalog/                        API catalog: index, per-plug-in details, .d.ts, stubs.txt
public/index.html, app.js, api.js      the console UI (Monaco editor, API Explorer)
```

Version settings (language level, Rhino feature flags) live in [`public/engine/profiles.json`](public/engine/profiles.json). Add a profile there plus a `runner-<id>.jar` to support another Orchestrator release (e.g. 9.2).

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## Limits

- Only the vCenter, REST and core classes listed above are simulated with data; other plug-in classes are stubs that return placeholders. Polyglot (Python, Node.js, PowerShell) actions aren't supported.
- Mocked objects cover common properties and methods, not the full vSphere API.
- The first visit downloads the CheerpJ Java 11 runtime and about 4 MB of engine jars, which takes around 30-40 seconds. The first run on each engine takes a few seconds while it warms up; later runs take under a second.

## Licences

- This project: MIT.
- Rhino: MPL 2.0. The jars are compiled unmodified from [mozilla/rhino](https://github.com/mozilla/rhino) tags `Rhino1_7R4_RELEASE`, `Rhino1_7_15_Release` and `Rhino1_9_1_Release` (core and E4X modules).
- Parts of the mock library are adapted from Stefan Schnell's emulator, MIT: see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
- The API catalog is generated from [modern-vroapi](https://github.com/imtrinity94/modern-vroapi) data, MIT.
- CheerpJ is loaded from Leaning Technologies' CDN under its [Community licence](https://cheerpj.com/licensing/) (free for personal and open-source projects).
- Not affiliated with Broadcom or VMware.
