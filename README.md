# Cloudblogger Editor

**A vRO / VCF Orchestrator script console that runs your JavaScript on the real Rhino engines, in the browser.**

| Orchestrator | Engine | Language level |
|---|---|---|
| Aria Automation Orchestrator 8.x | Mozilla Rhino **1.7R4** | JavaScript 1.7 |
| VCF Operations Orchestrator 9.0 | Mozilla Rhino **1.7.15** | ES6 mode (+ Java Map access) |

Earlier versions of this project emulated vRO with the browser's own JavaScript engine and regex checks. That could never reproduce Rhino's behaviour (Java strings, `for each`, E4X, exactly which ES6+ syntax parses). Version 2 compiles the actual Rhino release tags to Java 8 bytecode and runs them in [CheerpJ](https://cheerpj.com), a WebAssembly JVM. The page is fully static, so it hosts on Vercel and nothing is sent to a server.

## What behaves like Orchestrator

- **Syntax and built-ins come from the real parser and runtime.** Arrow functions fail on 8.x and work on 9.x. `class`, spread, default parameters, `?.` and `??` fail on both. `for (const x of ...)` is a syntax error on 9.x while `let`/`var` work. See the [measured feature matrix](docs/feature-matrix.md).
- **Class shutter:** only `java.util.*` is reachable, which is the vRO default. `new java.io.File(...)` fails the way it does on a real server.
- **Scripts run like an action.** They are wrapped in a function, so `return` gives the return value, and the Inputs tab supplies the parameters.
- **Version-specific runtime.** 9.x enables `FEATURE_ENABLE_JAVA_MAP_ACCESS` (`map.key`) and a `console` object; 8.x has neither.
- **Errors and line numbers come straight from Rhino.** They're labelled the way Orchestrator labels an action: `(Dynamic Script Module name : myAction#3)`.
- **Runaway loops are stopped** by Rhino's instruction observer after 15 s.
- **Serialization rules are flagged.** Returning an XML object or a function gets a note, because Orchestrator can't pass those between workflow elements.
- **vCenter plug-in array conversion is reproduced.** Assigning `[]` to `spec.deviceChange` and then writing `spec.deviceChange[0]` is silently lost, while building the array first works. See [the post](https://cloudblogger.co.in/2022/04/03/javascript-to-java-conversion-limitation-in-vro/).

## Mocked vRO APIs

Implemented in [`public/engine/vro-mocks.js`](public/engine/vro-mocks.js), which is plain ES5 loaded into Rhino before your script:

- **`System`**: `log`/`warn`/`error`/`debug`, `sleep`, `getModule`, `getContext`, `nextUUID`, `formatDate`, `getDateFromFormat`, `getCurrentTime`
- **`Server`**: configuration and resource elements, `findForType`, `findAllForType`
- **`VcPlugin`** and VC objects:
  - VMs, hosts, clusters, datastores, networks
  - VM power operations, reconfigure, rename, snapshots, destroy
  - `VcTask`, plus `com.vmware.library.vc.basic/vim3WaitTaskEnd`
- **`RESTHost`, `RESTHostManager`, `RESTRequest`, `RESTResponse`**: canned responses from route rules
- **`Properties`, `LockingSystem`, `File`/`FileReader`/`FileWriter`, `MimeAttachment`, `Command`** (never executes anything)
- **Your own mocked actions**, called through `System.getModule("com.acme").myAction(...)`

All of this reads an editable JSON inventory: the **Mocks** tab, defaulting to [`fixture.default.json`](public/engine/fixture.default.json). Nothing connects to real infrastructure.

## Run locally

```sh
npm run dev          # serves public/ on http://localhost:8080
```

or `docker build -t cloudblogger-editor . && docker run -p 8080:80 cloudblogger-editor`.

The server must support HTTP Range requests, because CheerpJ loads the jars in chunks. `serve`, nginx and Vercel all do; `python -m http.server` does not.

## Deploy to Vercel

Import the repo. `vercel.json` sets `public/` as the output directory with no build step. The prebuilt jars in `public/engines/` are committed.

## Rebuilding the engines

```sh
npm run build:engine   # needs git + JDK 11+; clones Rhino tags, compiles to Java 8 bytecode
npm test               # 81 runtime/mock tests on a desktop JVM, same jars as the browser
npm run matrix         # regenerates docs/feature-matrix.md
```

Layout:

```
engine/java/vroconsole/Runner.java     compiled once per Rhino version (shutter, wrapping, timeouts)
engine/launcher/vroconsole/Launcher.java  loads each engine in its own class loader
public/engines/*.jar                   rhino-1.7R4, rhino-1.7.15, runner-8x, runner-9x, launcher
public/engine/                         mocks, default inventory, version profiles, request builder
public/index.html, app.js, styles.css  the console UI (Monaco editor)
```

Version settings (language level, Rhino feature flags) live in [`public/engine/profiles.json`](public/engine/profiles.json). Add a profile there plus a `runner-<id>.jar` to support another Orchestrator release (e.g. 9.1).

## Limits

- Plugins other than the mocked vCenter/REST surface aren't available. Polyglot (Python, Node.js, PowerShell) actions aren't supported.
- Mocked objects cover common properties and methods, not the full vSphere API.
- The first load downloads the CheerpJ runtime and about 2 MB of engine jars. After that, runs take milliseconds.

## Licences

- This project: MIT.
- Rhino: MPL 2.0. The jars are compiled unmodified from [mozilla/rhino](https://github.com/mozilla/rhino) tags `Rhino1_7R4_RELEASE` and `Rhino1_7_15_Release`.
- CheerpJ is loaded from Leaning Technologies' CDN under its [Community licence](https://cheerpj.com/licensing/) (free for personal and open-source projects).
- Not affiliated with Broadcom or VMware.
