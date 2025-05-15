# Cloudblogger Editor (vRO Scripting Emulator)

## Overview
Cloudblogger Editor is a web-based code editor that emulates the VMware Aria Automation Orchestrator (vRO) scripting environment. It is designed for learning, testing, and prototyping vRO-compatible JavaScript code in a modern browser, with a focus on ES5.1 (Rhino 1.7R4) compatibility.

## Use Case
- **vRO Scripting Practice:** Safely write and test vRO scripts using simulated vRO classes (System, File, Command, URL, ZipWriter, MimeAttachment, ByteBuffer, Properties) without needing a live vRO instance.
- **ES5.1 Compatibility Checking:** The editor enforces ES5.1 (Rhino 1.7R4) syntax, warning about unsupported or deprecated JavaScript features, so you can ensure your code will run in vRO.
- **Learning & Prototyping:** Explore vRO scripting concepts, class APIs, and logging in a sandboxed environment with instant feedback.

## Features
- **Monaco Editor:** Modern code editing experience with syntax highlighting, line numbers, and more.
- **vRO Class Emulation:** Simulated vRO classes and methods for realistic scripting.
- **Custom Logging:** Output panel with timestamped logs, warnings, and errors.
- **Sidebar with Class Samples:** Click on a class in the sidebar to insert sample code for that class.
- **Theme Toggle:** Switch between dark and light modes for comfortable coding.
- **Deprecated/Unsupported Feature Warnings:** Clear guidance when using features not supported by vRO's Rhino engine (e.g., ES6+ syntax, 'for each', 'class' keyword, etc.).
- **Docker Deployment:** Easily deployable via Docker and nginx for local or shared use.

## How to Use
1. **Write or Paste Code:** Use the Monaco editor to write your vRO-compatible JavaScript code.
2. **Insert Class Samples:** Click a class name in the sidebar to insert example code for that class.
3. **Run Code:** Click the "Run" button to execute your code. Output and logs appear in the output panel below.
4. **Switch Theme:** Use the theme toggle button in the header to switch between dark and light modes.
5. **Check Compatibility:** The editor will warn you if you use unsupported or deprecated JavaScript features.

## Requirements
- Modern web browser (Chrome, Edge, Firefox, etc.)
- (Optional) Docker for containerized deployment

## Deployment
To run locally with Docker:
```sh
docker build -t cloudblogger-editor .
docker run -d -p 8080:80 cloudblogger-editor
```
Then open [http://localhost:8080](http://localhost:8080) in your browser.

or 

To run locally using npx:
```powershell
npx serve
```

## Limitations
- This tool is an emulator and does not connect to a real vRO instance.
- Only a subset of vRO classes and methods are simulated.
- File and command operations are simulated and do not affect your real filesystem or OS.
- **No plugin support:** vRO plugins and their APIs are not available or emulated.
- **No infrastructure connectivity:** The tool cannot connect to external systems, APIs, or infrastructure (e.g., vCenter, REST endpoints, databases).
- **No support for complex or non-standard vRO code:** Custom vRO scripting features, non-standard JavaScript extensions, and advanced vRO workflow constructs are not supported.
- **No persistence:** Data and files are not saved between sessions.
- **No Polyglot Support:** Can't execute Polyglot Runtime code

## License
This project is provided for educational and prototyping purposes. No official affiliation with VMware or Aria Automation Orchestrator.
