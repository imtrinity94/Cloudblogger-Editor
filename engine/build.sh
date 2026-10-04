#!/usr/bin/env bash
# Builds the browser engine jars into public/engines/.
#
#   rhino-1.7R4.jar   Rhino as shipped in Orchestrator 8.x   (tag Rhino1_7R4_RELEASE)
#   rhino-1.7.15.jar  Rhino as shipped in Orchestrator 9.x   (tag Rhino1_7_15_Release)
#   runner-8x.jar     vroconsole.Runner compiled against 1.7R4
#   runner-9x.jar     vroconsole.Runner compiled against 1.7.15
#   launcher.jar      vroconsole.Launcher (loads each engine in its own class loader)
#
# Rhino is compiled from the official GitHub release tags, so no Maven access is needed.
# Everything targets Java 8 bytecode, which is what CheerpJ runs by default.
#
# Requires: git, a JDK 11+ (javac --release 8), jar.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
OUT="$ROOT/public/engines"
WORK="${WORK:-$HERE/.build}"
mkdir -p "$OUT" "$WORK"

JAVAC_OPTS=(-nowarn -encoding UTF-8 --release 8)

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
  jar cfm "$OUT/rhino-$ver.jar" "$mf" -C "$cls" .
  echo "built rhino-$ver.jar"
}

build_runner() { # <engineId> <rhinoVersion>
  local id=$1 ver=$2 cls="$WORK/classes-runner-$1"
  rm -rf "$cls" && mkdir -p "$cls"
  javac "${JAVAC_OPTS[@]}" -cp "$OUT/rhino-$ver.jar" -d "$cls" "$HERE"/java/vroconsole/*.java
  rm -f "$OUT/runner-$id.jar"
  jar cf "$OUT/runner-$id.jar" -C "$cls" .
  echo "built runner-$id.jar"
}

build_rhino Rhino1_7R4_RELEASE 1.7R4
build_rhino Rhino1_7_15_Release 1.7.15
build_runner 8x 1.7R4
build_runner 9x 1.7.15

cls="$WORK/classes-launcher"
rm -rf "$cls" && mkdir -p "$cls"
javac "${JAVAC_OPTS[@]}" -d "$cls" "$HERE"/launcher/vroconsole/Launcher.java
rm -f "$OUT/launcher.jar"
jar cf "$OUT/launcher.jar" -C "$cls" .
echo "built launcher.jar"
ls -la "$OUT"
