package vroconsole;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Minimal JSON reader/writer so the engine needs no extra jars. */
final class Json {

    private Json() {}

    static final class Obj {
        final Map<String, Object> map;

        Obj(Map<String, Object> map) { this.map = map; }

        String str(String k, String def) {
            Object v = map.get(k);
            return v == null ? def : String.valueOf(v);
        }

        double num(String k, double def) {
            Object v = map.get(k);
            return v instanceof Number ? ((Number) v).doubleValue() : def;
        }

        Arr arr(String k) {
            Object v = map.get(k);
            return v instanceof Arr ? (Arr) v : new Arr(new ArrayList<Object>());
        }

        String[] strArray(String k) {
            Arr a = arr(k);
            String[] r = new String[a.size()];
            for (int i = 0; i < r.length; i++) r[i] = String.valueOf(a.list.get(i));
            return r;
        }
    }

    static final class Arr {
        final List<Object> list;

        Arr(List<Object> list) { this.list = list; }

        int size() { return list.size(); }

        Obj obj(int i) {
            Object v = list.get(i);
            return v instanceof Obj ? (Obj) v : new Obj(new LinkedHashMap<String, Object>());
        }
    }

    static Obj parseObject(String s) {
        Parser p = new Parser(s);
        Object v = p.value();
        if (!(v instanceof Obj)) throw new IllegalArgumentException("request must be a JSON object");
        return (Obj) v;
    }

    static String quote(String s) {
        if (s == null) return "null";
        StringBuilder b = new StringBuilder(s.length() + 2);
        b.append('"');
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"': b.append("\\\""); break;
                case '\\': b.append("\\\\"); break;
                case '\n': b.append("\\n"); break;
                case '\r': b.append("\\r"); break;
                case '\t': b.append("\\t"); break;
                default:
                    if (c < 0x20 || c == 0x2028 || c == 0x2029) {
                        String h = Integer.toHexString(c);
                        b.append("\\u");
                        for (int k = h.length(); k < 4; k++) b.append('0');
                        b.append(h);
                    } else {
                        b.append(c);
                    }
            }
        }
        b.append('"');
        return b.toString();
    }

    private static final class Parser {
        final String s;
        int i;

        Parser(String s) { this.s = s; }

        void ws() {
            while (i < s.length() && Character.isWhitespace(s.charAt(i))) i++;
        }

        Object value() {
            ws();
            if (i >= s.length()) throw new IllegalArgumentException("unexpected end of JSON");
            char c = s.charAt(i);
            if (c == '{') return object();
            if (c == '[') return array();
            if (c == '"') return string();
            if (s.startsWith("true", i)) { i += 4; return Boolean.TRUE; }
            if (s.startsWith("false", i)) { i += 5; return Boolean.FALSE; }
            if (s.startsWith("null", i)) { i += 4; return null; }
            return number();
        }

        Obj object() {
            Map<String, Object> m = new LinkedHashMap<String, Object>();
            i++;
            ws();
            if (s.charAt(i) == '}') { i++; return new Obj(m); }
            while (true) {
                ws();
                String k = string();
                ws();
                expect(':');
                m.put(k, value());
                ws();
                char c = s.charAt(i++);
                if (c == '}') return new Obj(m);
                if (c != ',') throw new IllegalArgumentException("expected , or } at " + (i - 1));
            }
        }

        Arr array() {
            List<Object> l = new ArrayList<Object>();
            i++;
            ws();
            if (s.charAt(i) == ']') { i++; return new Arr(l); }
            while (true) {
                l.add(value());
                ws();
                char c = s.charAt(i++);
                if (c == ']') return new Arr(l);
                if (c != ',') throw new IllegalArgumentException("expected , or ] at " + (i - 1));
            }
        }

        String string() {
            expect('"');
            StringBuilder b = new StringBuilder();
            while (true) {
                char c = s.charAt(i++);
                if (c == '"') return b.toString();
                if (c == '\\') {
                    char e = s.charAt(i++);
                    switch (e) {
                        case 'n': b.append('\n'); break;
                        case 'r': b.append('\r'); break;
                        case 't': b.append('\t'); break;
                        case 'b': b.append('\b'); break;
                        case 'f': b.append('\f'); break;
                        case 'u': b.append((char) Integer.parseInt(s.substring(i, i + 4), 16)); i += 4; break;
                        default: b.append(e);
                    }
                } else {
                    b.append(c);
                }
            }
        }

        Number number() {
            int st = i;
            while (i < s.length() && "+-0123456789.eE".indexOf(s.charAt(i)) >= 0) i++;
            if (st == i) throw new IllegalArgumentException("bad JSON at " + st);
            return Double.valueOf(s.substring(st, i));
        }

        void expect(char c) {
            if (s.charAt(i) != c) throw new IllegalArgumentException("expected '" + c + "' at " + i);
            i++;
        }
    }
}
