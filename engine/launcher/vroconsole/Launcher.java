package vroconsole;

import java.io.File;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.HashMap;
import java.util.Map;

/**
 * Entry point the web page calls through CheerpJ.
 *
 * Both Rhino builds use the same package names (org.mozilla.javascript), so
 * each engine gets its own URLClassLoader with [rhino-X.jar, runner-X.jar].
 * This class itself has no Rhino dependency.
 *
 *   Launcher.run("8x", requestJson)  -> Rhino 1.7R4  (Orchestrator 8.x)
 *   Launcher.run("9x", requestJson)  -> Rhino 1.7.15 (Orchestrator 9.x)
 */
public final class Launcher {

    private static final Map<String, Method> ENGINES = new HashMap<String, Method>();

    /** Folder holding the jars; "/app/engines" under CheerpJ, overridable for desktop tests. */
    private static String baseDir = "/app/engines";

    private Launcher() {}

    public static void setBaseDir(String dir) {
        baseDir = dir;
    }

    private static String rhinoJar(String engine) {
        if ("8x".equals(engine)) return "rhino-1.7R4.jar";
        if ("9x".equals(engine)) return "rhino-1.7.15.jar";
        throw new IllegalArgumentException("unknown engine " + engine);
    }

    private static synchronized Method engine(String engine) throws Exception {
        Method m = ENGINES.get(engine);
        if (m != null) return m;
        URL[] urls = new URL[] {
            new File(baseDir, rhinoJar(engine)).toURI().toURL(),
            new File(baseDir, "runner-" + engine + ".jar").toURI().toURL()
        };
        // Parent is the bootstrap loader, so nothing leaks between the two engines.
        ClassLoader cl = new URLClassLoader(urls, null);
        Class<?> runner = Class.forName("vroconsole.Runner", true, cl);
        m = runner.getMethod("run", String.class);
        ENGINES.put(engine, m);
        return m;
    }

    /** Loads an engine ahead of the first run so the first click is fast. */
    public static String warm(String engine) {
        try {
            engine(engine);
            return "ok";
        } catch (Throwable t) {
            return "error: " + t;
        }
    }

    public static String run(String engine, String requestJson) {
        try {
            return (String) engine(engine).invoke(null, requestJson);
        } catch (Throwable t) {
            Throwable c = t.getCause() != null ? t.getCause() : t;
            String msg = String.valueOf(c);
            return "{\"ok\":false,\"logs\":[],\"error\":{\"name\":\"EngineError\",\"message\":\""
                    + msg.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", " ") + "\"}}";
        }
    }

    /**
     * Desktop use (tests):
     *   java -cp launcher.jar vroconsole.Launcher <jarDir> <engine> <requestFile>
     *   java -cp launcher.jar vroconsole.Launcher <jarDir> batch <file.jsonl>   (lines: {"engine":..,"request":{..}})
     * Batch mode prints one result per input line, so a whole suite runs in one JVM.
     */
    public static void main(String[] args) throws Exception {
        setBaseDir(args[0]);
        if ("batch".equals(args[1])) {
            java.io.BufferedReader r = new java.io.BufferedReader(new java.io.InputStreamReader(
                    new java.io.FileInputStream(args[2]), "UTF-8"));
            java.io.PrintStream out = new java.io.PrintStream(System.out, true, "UTF-8");
            String line;
            while ((line = r.readLine()) != null) {
                if (line.trim().length() == 0) continue;
                int e = line.indexOf("\"engine\":\"") + 10;
                String engine = line.substring(e, line.indexOf('"', e));
                int q = line.indexOf("\"request\":") + 10;
                String req = line.substring(q, line.lastIndexOf('}'));
                out.println(run(engine, req));
            }
            r.close();
            return;
        }
        String req = new String(java.nio.file.Files.readAllBytes(new File(args[2]).toPath()), "UTF-8");
        System.out.println(run(args[1], req));
    }
}
