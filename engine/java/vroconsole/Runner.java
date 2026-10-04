package vroconsole;

import java.util.ArrayList;
import java.util.List;

import org.mozilla.javascript.BaseFunction;
import org.mozilla.javascript.ClassShutter;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.ContextFactory;
import org.mozilla.javascript.EcmaError;
import org.mozilla.javascript.EvaluatorException;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.JavaScriptException;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.RhinoException;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Undefined;
import org.mozilla.javascript.WrappedException;

/**
 * Runs one vRO script on the Rhino engine this class was compiled against.
 *
 * This same source is compiled once against Rhino 1.7R4 (Orchestrator 8.x)
 * and once against Rhino 1.7.15 (Orchestrator 9.x). The Launcher loads each
 * build in its own class loader so both engines can live in one JVM.
 *
 * What it reproduces from Orchestrator:
 *  - Class shutter: scripts can only reach java.util.* (the vRO default).
 *  - Actions are wrapped in a function, so `return` works and inputs are
 *    function parameters.
 *  - Scriptable tasks run in a scope that is not the Rhino root scope, so
 *    `return` is a syntax error and top-level vars become task outputs.
 *  - Interpreted mode with an instruction budget, so runaway loops stop.
 *
 * Contract (kept to strings so the JavaScript/Java boundary stays simple):
 *   run(String requestJson) -> String resultJson
 */
public final class Runner {

    private Runner() {}

    // ---------------------------------------------------------------- context

    static final class Factory extends ContextFactory {
        final int languageVersion;
        final long deadline;
        final java.util.Set<Integer> enabled;

        Factory(int languageVersion, long deadline, java.util.Set<Integer> enabled) {
            this.languageVersion = languageVersion;
            this.deadline = deadline;
            this.enabled = enabled;
        }

        @Override
        protected boolean hasFeature(Context cx, int featureIndex) {
            if (featureIndex == Context.FEATURE_E4X) return true;
            // Profile-specific Rhino features by index (e.g. 21 = FEATURE_ENABLE_JAVA_MAP_ACCESS
            // in 1.7.14+). Indices unknown to an engine are simply never asked for.
            if (enabled.contains(Integer.valueOf(featureIndex))) return true;
            return super.hasFeature(cx, featureIndex);
        }

        @Override
        protected void onContextCreated(Context cx) {
            super.onContextCreated(cx);
            cx.setLanguageVersion(languageVersion);
            cx.setOptimizationLevel(-1); // interpreted: needed for the instruction observer
            cx.setInstructionObserverThreshold(5000);
            cx.setMaximumInterpreterStackDepth(2000);
        }

        @Override
        protected void observeInstructionCount(Context cx, int instructionCount) {
            if (System.currentTimeMillis() > deadline) {
                throw new Error("TIMEOUT");
            }
        }
    }

    /** vRO default: only java.util.* is visible to scripts. */
    static final class VroShutter implements ClassShutter {
        final String[] extraPrefixes;

        VroShutter(String[] extraPrefixes) {
            this.extraPrefixes = extraPrefixes;
        }

        public boolean visibleToScripts(String name) {
            if (name.startsWith("java.util.")) return true;
            for (int i = 0; i < extraPrefixes.length; i++) {
                String p = extraPrefixes[i];
                if (p.length() == 0) continue;
                if (p.endsWith("*")) {
                    if (name.startsWith(p.substring(0, p.length() - 1))) return true;
                } else if (name.equals(p)) {
                    return true;
                }
            }
            return false;
        }
    }

    // ------------------------------------------------------------- host glue

    /** Log lines collected from the script (System.log & co. call into this). */
    static final class LogSink {
        final List<String[]> lines = new ArrayList<String[]>();
        final long start = System.currentTimeMillis();
        int max = 5000;
        boolean truncated;
    }

    static abstract class HostFn extends BaseFunction {
        abstract Object invoke(Object[] args);

        @Override
        public Object call(Context cx, Scriptable scope, Scriptable thisObj, Object[] args) {
            return invoke(args);
        }
    }

    static String str(Object[] args, int i) {
        if (args.length <= i) return "";
        Object v = args[i];
        if (v == null || v instanceof Undefined) return String.valueOf(v == null ? "null" : "undefined");
        return Context.toString(v);
    }

    static ScriptableObject installHost(Context cx, Scriptable global, final LogSink sink, final long deadline) {
        ScriptableObject host = (ScriptableObject) cx.newObject(global);

        host.defineProperty("log", new HostFn() {
            Object invoke(Object[] a) {
                if (sink.lines.size() >= sink.max) {
                    sink.truncated = true;
                    return Undefined.instance;
                }
                String ts = String.valueOf(System.currentTimeMillis() - sink.start);
                sink.lines.add(new String[] { str(a, 0), str(a, 1), ts });
                return Undefined.instance;
            }
        }, ScriptableObject.DONTENUM);

        host.defineProperty("now", new HostFn() {
            Object invoke(Object[] a) {
                return Double.valueOf(System.currentTimeMillis());
            }
        }, ScriptableObject.DONTENUM);

        // System.sleep: honours the run deadline instead of blocking forever.
        host.defineProperty("sleep", new HostFn() {
            Object invoke(Object[] a) {
                long ms = (long) Context.toNumber(a.length > 0 ? a[0] : Double.valueOf(0));
                long until = Math.min(System.currentTimeMillis() + Math.max(0, ms), deadline);
                while (System.currentTimeMillis() < until) {
                    try { Thread.sleep(Math.min(50, until - System.currentTimeMillis())); }
                    catch (InterruptedException e) { break; }
                }
                if (System.currentTimeMillis() >= deadline) throw new Error("TIMEOUT");
                return Undefined.instance;
            }
        }, ScriptableObject.DONTENUM);

        host.defineProperty("engineVersion", Context.getCurrentContext().getImplementationVersion(),
                ScriptableObject.DONTENUM | ScriptableObject.READONLY);
        host.defineProperty("languageVersion", Integer.valueOf(cx.getLanguageVersion()),
                ScriptableObject.DONTENUM | ScriptableObject.READONLY);

        global.put("__vroHost", global, host);
        return host;
    }

    // ------------------------------------------------------------------- run

    static final boolean[] TRACE = { false };
    static final long[] TRACE_T0 = { 0 };

    static void trace(String step) {
        if (TRACE[0]) System.err.println("[vroconsole] +" + (System.currentTimeMillis() - TRACE_T0[0]) + "ms " + step);
    }

    public static String run(String requestJson) {
        Json.Obj req;
        try {
            req = Json.parseObject(requestJson);
        } catch (RuntimeException e) {
            return "{\"ok\":false,\"error\":{\"name\":\"RequestError\",\"message\":" + Json.quote(e.getMessage()) + "}}";
        }

        String code = req.str("code", "");
        String prelude = req.str("prelude", "");
        String mode = req.str("mode", "action");          // "action" | "task"
        String elementName = req.str("name", "myAction");
        int langVersion = (int) req.num("languageVersion", 170);
        long timeoutMs = (long) req.num("timeoutMs", 10000);
        String[] removeGlobals = req.strArray("removeGlobals");
        String[] shutterExtra = req.strArray("allowJava");
        Json.Arr inputs = req.arr("inputs");              // [{name, value(js expr), type}]
        String[] outputs = req.strArray("outputs");
        java.util.Set<Integer> enabled = new java.util.HashSet<Integer>();
        Json.Arr feats = req.arr("enableFeatures");
        for (int i = 0; i < feats.size(); i++) {
            Object f = feats.list.get(i);
            if (f instanceof Number) enabled.add(Integer.valueOf(((Number) f).intValue()));
        }

        final boolean trace = "true".equals(req.str("trace", "false"));
        final long tStart = System.currentTimeMillis();
        TRACE[0] = trace; TRACE_T0[0] = tStart;
        trace("request parsed (" + requestJson.length() + " chars)");
        final long deadline = System.currentTimeMillis() + timeoutMs;
        final LogSink sink = new LogSink();
        Factory factory = new Factory(langVersion, deadline, enabled);
        Context cx = factory.enterContext();
        final boolean[] compiling = { false };
        long t0 = System.currentTimeMillis();
        StringBuilder out = new StringBuilder(256);
        try {
            cx.setClassShutter(new VroShutter(shutterExtra));
            // Java strings/numbers/booleans returned from java.util calls (map.get(...))
            // come back as JavaScript primitives, as they do in Orchestrator.
            cx.getWrapFactory().setJavaPrimitiveWrap(false);
            ScriptableObject global = cx.initStandardObjects();
            installHost(cx, global, sink, deadline);

            for (int i = 0; i < removeGlobals.length; i++) {
                global.delete(removeGlobals[i]);
            }

            // Mocks (System, Server, VcPlugin...) are plain JavaScript loaded into the root scope.
            trace("context ready");
            if (prelude.length() > 0) {
                Script mocksScript = cx.compileString(prelude, "vro-mocks.js", 1, null);
                trace("mocks compiled");
                mocksScript.exec(cx, global);
                trace("mocks executed");
            }
            // The mocks captured these in closures; hide them from user scripts.
            global.delete("__vroHost");
            global.delete("__vroFixture");

            // Element scope: not the Rhino root, like Orchestrator.
            Scriptable elementScope = cx.newObject(global);
            elementScope.setPrototype(global);
            elementScope.setParentScope(null);

            // Inputs are given as JavaScript expressions evaluated with the mocks in scope,
            // so a VC:VirtualMachine input can be written as VcPlugin.getAllVirtualMachines()[0].
            String[] inNames = new String[inputs.size()];
            Object[] inValues = new Object[inputs.size()];
            for (int i = 0; i < inputs.size(); i++) {
                Json.Obj in = inputs.obj(i);
                inNames[i] = in.str("name", "in" + i);
                String expr = in.str("value", "");
                Object v = expr.trim().length() == 0
                        ? null
                        : cx.evaluateString(global, "(" + expr + ")", "input:" + inNames[i], 1, null);
                inValues[i] = v;
            }

            trace("inputs evaluated");
            Object result;
            String sourceName;
            if ("task".equals(mode)) {
                sourceName = "Workflow:" + req.str("workflow", "Test") + " / Scriptable task (" + elementName + ")";
                for (int i = 0; i < inNames.length; i++) {
                    elementScope.put(inNames[i], elementScope, inValues[i]);
                }
                compiling[0] = true;
                Script script = cx.compileString(code, sourceName, 1, null);
                compiling[0] = false;
                script.exec(cx, elementScope);
                result = Undefined.instance;
            } else {
                sourceName = "Dynamic Script Module name : " + elementName;
                StringBuilder header = new StringBuilder("(function(");
                for (int i = 0; i < inNames.length; i++) {
                    if (i > 0) header.append(',');
                    header.append(inNames[i]);
                }
                // Header and body share line 1 so reported line numbers match the editor.
                header.append("){").append(code).append("\n})");
                compiling[0] = true;
                Script script = cx.compileString(header.toString(), sourceName, 1, null);
                compiling[0] = false;
                Function fn = (Function) script.exec(cx, elementScope);
                trace("script compiled");
                result = fn.call(cx, elementScope, elementScope, inValues);
                trace("script finished");
            }

            Object inspectObj = ScriptableObject.getProperty(global, "__vroInspect");
            Function inspect = inspectObj instanceof Function ? (Function) inspectObj : null;

            out.append("{\"ok\":true");
            out.append(",\"result\":").append(Json.quote(describe(cx, global, inspect, result)));
            out.append(",\"resultType\":").append(Json.quote(typeOf(result)));
            out.append(",\"outputs\":{");
            for (int i = 0; i < outputs.length; i++) {
                if (i > 0) out.append(',');
                Object v = ScriptableObject.getProperty(elementScope, outputs[i]);
                if (v == Scriptable.NOT_FOUND) v = Undefined.instance;
                out.append(Json.quote(outputs[i])).append(':').append(Json.quote(describe(cx, global, inspect, v)));
            }
            out.append('}');
            // Types let the page flag values Orchestrator cannot pass between elements (XML, functions).
            out.append(",\"outputTypes\":{");
            for (int i = 0; i < outputs.length; i++) {
                if (i > 0) out.append(',');
                Object v = ScriptableObject.getProperty(elementScope, outputs[i]);
                out.append(Json.quote(outputs[i])).append(':').append(Json.quote(v == Scriptable.NOT_FOUND ? "undefined" : typeOf(v)));
            }
            out.append('}');
        } catch (WrappedException e) {
            // Must precede EvaluatorException: in 1.7R4 WrappedException extends it.
            out.setLength(0);
            out.append("{\"ok\":false,\"error\":");
            Throwable w = e.getWrappedException();
            appendError(out, "JavaException", w.getClass().getName() + ": " + w.getMessage(), e);
        } catch (EvaluatorException e) {
            out.setLength(0);
            out.append("{\"ok\":false,\"error\":");
            appendError(out, compiling[0] ? "SyntaxError" : "Error", e.details(), e);
        } catch (EcmaError e) {
            out.setLength(0);
            out.append("{\"ok\":false,\"error\":");
            appendError(out, e.getName(), e.getErrorMessage(), e);
        } catch (JavaScriptException e) {
            out.setLength(0);
            out.append("{\"ok\":false,\"error\":");
            Object thrown = e.getValue();
            String tName = "Error";
            String tMsg = Context.toString(thrown);
            if (thrown instanceof Scriptable) {
                Object m = ScriptableObject.getProperty((Scriptable) thrown, "message");
                Object n = ScriptableObject.getProperty((Scriptable) thrown, "name");
                if (m != Scriptable.NOT_FOUND) tMsg = Context.toString(m);
                if (n != Scriptable.NOT_FOUND) tName = Context.toString(n);
            }
            appendError(out, tName, tMsg, e);
        } catch (RhinoException e) {
            out.setLength(0);
            out.append("{\"ok\":false,\"error\":");
            appendError(out, "Error", e.details(), e);
        } catch (Error e) {
            out.setLength(0);
            out.append("{\"ok\":false,\"error\":");
            if ("TIMEOUT".equals(e.getMessage())) {
                out.append("{\"name\":\"Timeout\",\"message\":")
                   .append(Json.quote("Script stopped after " + timeoutMs + " ms (runaway loop or long sleep)"))
                   .append('}');
            } else if (e instanceof StackOverflowError) {
                out.append("{\"name\":\"InternalError\",\"message\":\"Too much recursion\"}");
            } else {
                out.append("{\"name\":\"InternalError\",\"message\":").append(Json.quote(String.valueOf(e))).append('}');
            }
        } catch (RuntimeException e) {
            out.setLength(0);
            out.append("{\"ok\":false,\"error\":{\"name\":\"InternalError\",\"message\":")
               .append(Json.quote(String.valueOf(e))).append('}');
        } finally {
            Context.exit();
        }

        out.append(",\"durationMs\":").append(System.currentTimeMillis() - t0);
        out.append(",\"engineVersion\":").append(Json.quote(engineVersion()));
        out.append(",\"languageVersion\":").append(langVersion);
        out.append(",\"logsTruncated\":").append(sink.truncated);
        out.append(",\"logs\":[");
        for (int i = 0; i < sink.lines.size(); i++) {
            String[] l = sink.lines.get(i);
            if (i > 0) out.append(',');
            out.append("{\"level\":").append(Json.quote(l[0]))
               .append(",\"msg\":").append(Json.quote(l[1]))
               .append(",\"t\":").append(l[2]).append('}');
        }
        out.append("]}");
        return out.toString();
    }

    static String engineVersion() {
        Context cx = new ContextFactory().enterContext();
        try {
            return cx.getImplementationVersion();
        } finally {
            Context.exit();
        }
    }

    static String typeOf(Object v) {
        if (v == null) return "null";
        if (v instanceof Undefined) return "undefined";
        if (v instanceof String || v instanceof CharSequence) return "string";
        if (v instanceof Number) return "number";
        if (v instanceof Boolean) return "boolean";
        if (v instanceof NativeArray) return "Array";
        if (v instanceof Function) return "function";
        if (v instanceof Scriptable) return ((Scriptable) v).getClassName();
        return v.getClass().getName();
    }

    static String describe(Context cx, Scriptable global, Function inspect, Object v) {
        try {
            if (inspect != null) {
                return Context.toString(inspect.call(cx, global, global, new Object[] { v }));
            }
        } catch (RhinoException ignored) {
            // fall through
        }
        return v instanceof Undefined ? "undefined" : Context.toString(v);
    }

    static void appendError(StringBuilder out, String name, String message, RhinoException e) {
        out.append("{\"name\":").append(Json.quote(name));
        out.append(",\"message\":").append(Json.quote(message));
        out.append(",\"line\":").append(e.lineNumber());
        out.append(",\"column\":").append(e.columnNumber());
        out.append(",\"source\":").append(Json.quote(e.sourceName() == null ? "" : e.sourceName()));
        out.append(",\"lineSource\":").append(Json.quote(e.lineSource() == null ? "" : e.lineSource()));
        String stack = "";
        try { stack = e.getScriptStackTrace(); } catch (RuntimeException ignored) { }
        out.append(",\"scriptStack\":").append(Json.quote(stack));
        out.append('}');
    }
}
