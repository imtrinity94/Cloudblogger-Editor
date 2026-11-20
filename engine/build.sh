#!/usr/bin/env bash
# Builds the browser engine jars into public/engines/.
#
#   rhino-1.7R4.jar   Rhino as shipped in Orchestrator 8.x   (tag Rhino1_7R4_RELEASE)
#   rhino-1.7.15.jar  Rhino as shipped in Orchestrator 9.0   (tag Rhino1_7_15_Release)
#   rhino-1.9.1.jar   Rhino as shipped in Orchestrator 9.1.1 (tag Rhino1_9_1_Release, core + E4X)
#   runner-8x.jar     vroconsole.Runner compiled against 1.7R4
#   runner-9x.jar     vroconsole.Runner compiled against 1.7.15
#   runner-91x.jar    vroconsole.Runner compiled against 1.9.1
#   launcher.jar      vroconsole.Launcher (loads each engine in its own class loader)
#
# Rhino is compiled from the official GitHub release tags, so no Maven access is needed.
# 1.7.x and the launcher target Java 8 bytecode; Rhino 1.9 needs Java 11, so the
# 1.9.1 jar and its runner target Java 11 and the page starts CheerpJ's Java 11 runtime.
#
# Requires: git, a JDK 11+ (javac --release 8), jar.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
OUT="$HERE/.build/out"
WORK="${WORK:-$HERE/.build}"
mkdir -p "$WORK" && rm -rf "$OUT" && mkdir -p "$OUT"

JAVAC_OPTS=(-nowarn -encoding UTF-8 --release 8)
# Fixed timestamps make rebuilt jars byte-identical, so browsers' cached copies stay valid.
JAR_DATE=(--date=2024-01-01T00:00:00Z)

build_rhino() { # <tag> <version>
  local tag=$1 ver=$2 src="$WORK/rhino-$2" cls="$WORK/classes-rhino-$2"
  if [ ! -d "$src" ]; then
    git clone -q --depth 1 --branch "$tag" https://github.com/mozilla/rhino "$src"
  fi
  rm -rf "$cls" && mkdir -p "$cls"
  find "$src/src" "$src/xmlimplsrc" -name '*.java' > "$WORK/files-$ver.txt"
  javac "${JAVAC_OPTS[@]}" -d "$cls" @"$WORK/files-$ver.txt"
  # Resource bundles (error messages etc.)
  (cd "$src/src" && find org -type f ! -name '*.java' -exec install -D -m 644 {} "$cls/{}" \;)
  if [ -d "$src/src/META-INF" ]; then
    (cd "$src/src" && find META-INF -type f -exec install -D -m 644 {} "$cls/{}" \;)
  fi
  (cd "$src/xmlimplsrc" && find . -type f ! -name '*.java' -exec install -D -m 644 {} "$cls/{}" \;)

  # Stamp the version string exactly as the official release jars report it,
  # so Context.getImplementationVersion() matches what Orchestrator logs.
  local built; built="$(git -C "$src" log -1 --format=%cs)"
  local mf="$WORK/manifest-$ver.mf"
  rm -f "$cls/META-INF/MANIFEST.MF"
  if [ "$ver" = "1.7R4" ]; then
    sed -i "s/@IMPLEMENTATION.VERSION@/Rhino 1.7 release 4 ${built//-/ }/" \
      "$cls/org/mozilla/javascript/resources/Messages.properties"
    printf 'Implementation-Title: Mozilla Rhino\nImplementation-Version: 1.7R4\n' > "$mf"
  else
    printf 'Implementation-Title: Mozilla Rhino\nImplementation-Version: %s\nBuilt-Date: %s\n' "$ver" "$built" > "$mf"
  fi

  rm -f "$OUT/rhino-$ver.jar"
  jar --create --file "$OUT/rhino-$ver.jar" --manifest "$mf" "${JAR_DATE[@]}" -C "$cls" .
  echo "built rhino-$ver.jar"
}

# Rhino 1.8+ is a Gradle multi-module build; compile the core and E4X modules
# into one jar (without module-info, so it loads from a plain class path).
build_rhino19() { # <tag> <version>
  local tag=$1 ver=$2 src="$WORK/rhino-$2" cls="$WORK/classes-rhino-$2"
  if [ ! -d "$src" ]; then
    git clone -q --depth 1 --branch "$tag" https://github.com/mozilla/rhino "$src"
  fi
  rm -rf "$cls" && mkdir -p "$cls"
  find "$src/rhino/src/main/java" "$src/rhino-xml/src/main/java" -name '*.java' ! -name module-info.java \
    | sort > "$WORK/files-$ver.txt"
  javac -nowarn -encoding UTF-8 --release 11 -d "$cls" @"$WORK/files-$ver.txt"
  # Resources: error messages plus the ServiceLoader entries that plug in RegExp and E4X.
  (cd "$src/rhino/src/main/resources" && find . -type f -exec install -D -m 644 {} "$cls/{}" \;)
  (cd "$src/rhino-xml/src/main/resources" && find . -type f -exec install -D -m 644 {} "$cls/{}" \;)
  # Two modules both ship META-INF/services files with different names, so nothing clashes.
  # Orchestrator 9.1.1 reports plain "Rhino 1.9.1" (no build date), so no Built-Date here.
  local mf="$WORK/manifest-$ver.mf"
  printf 'Implementation-Title: Mozilla Rhino\nImplementation-Version: %s\n' "$ver" > "$mf"
  rm -f "$OUT/rhino-$ver.jar"
  jar --create --file "$OUT/rhino-$ver.jar" --manifest "$mf" "${JAR_DATE[@]}" -C "$cls" .
  echo "built rhino-$ver.jar"
}

build_runner() { # <engineId> <rhinoVersion> [javaRelease]
  local id=$1 ver=$2 rel=${3:-8} cls="$WORK/classes-runner-$1"
  rm -rf "$cls" && mkdir -p "$cls"
  javac -nowarn -encoding UTF-8 --release "$rel" -cp "$OUT/rhino-$ver.jar" -d "$cls" "$HERE"/java/vroconsole/*.java
  rm -f "$OUT/runner-$id.jar"
  jar --create --file "$OUT/runner-$id.jar" "${JAR_DATE[@]}" -C "$cls" .
  echo "built runner-$id.jar"
}

build_rhino Rhino1_7R4_RELEASE 1.7R4
build_rhino Rhino1_7_15_Release 1.7.15
build_rhino19 Rhino1_9_1_Release 1.9.1
build_runner 8x 1.7R4
build_runner 9x 1.7.15
build_runner 91x 1.9.1 11

cls="$WORK/classes-launcher"
rm -rf "$cls" && mkdir -p "$cls"
javac "${JAVAC_OPTS[@]}" -d "$cls" "$HERE"/launcher/vroconsole/Launcher.java
rm -f "$OUT/launcher.jar"
jar --create --file "$OUT/launcher.jar" "${JAR_DATE[@]}" -C "$cls" .
echo "built launcher.jar"

# Publish under a content-hashed folder so a changed jar always gets a new URL.
# (Browsers cache jar byte ranges; mixing ranges of an old and a new jar makes
# CheerpJ abort with "server does not support Range".)
HASH="$(cat "$OUT"/*.jar | sha256sum | cut -c1-12)"
PUB="$ROOT/public/engines"
for d in "$PUB"/v-*; do [ -d "$d" ] && [ "$d" != "$PUB/v-$HASH" ] && rm -rf "$d"; done
mkdir -p "$PUB/v-$HASH"
mv "$OUT"/*.jar "$PUB/v-$HASH/"
printf '{ "dir": "engines/v-%s" }\n' "$HASH" > "$ROOT/public/engine/engines.json"
echo "published engines/v-$HASH"
ls -la "$PUB/v-$HASH"
