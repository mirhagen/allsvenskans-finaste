#!/bin/bash
# Hämta officiella klubblogos för Allsvenskan-kronappen
# Källa: assets.footylogos.com (FootyLogos) + DLS CDN
# Logotyperna tillhör respektive klubb och får användas för identifiering

set -e

LOGO_DIR="public/logos"
mkdir -p "$LOGO_DIR"

echo "⬇️  Hämtar Allsvenskan-klubblogos..."
echo ""

# Funktion för att hämta och verifiera
download_logo() {
  local name="$1"
  local url="$2"
  local filename="$3"
  local filepath="$LOGO_DIR/$filename"
  
  printf "%-20s " "$name..."
  curl -sfL -o "$filepath" "$url"
  
  if [ -f "$filepath" ] && [ -s "$filepath" ]; then
    local size=$(wc -c < "$filepath" | tr -d ' ')
    echo "✅ ${size} bytes"
  else
    echo "❌ MISSLYCKADES"
    rm -f "$filepath"
    return 1
  fi
}

# SVG-loggor (13 klubbar)
download_logo "AIK" \
  "https://assets.footylogos.com/logos/aik/aik-logo-footylogos.svg" \
  "aik.svg"

download_logo "BK Hacken" \
  "https://assets.footylogos.com/logos/bk-hacken/bk-hacken-logo-footylogos.svg" \
  "bk-hacken.svg"

download_logo "Degerfors IF" \
  "https://assets.footylogos.com/logos/degerfors-if/degerfors-if-logo-footylogos.svg" \
  "degerfors-if.svg"

download_logo "Djurgårdens IF" \
  "https://assets.footylogos.com/logos/djurgardens-if/djurgardens-if-logo-footylogos.svg" \
  "djurgardens-if.svg"

download_logo "GAIS" \
  "https://assets.footylogos.com/logos/gais/gais-logo-footylogos.svg" \
  "gais.svg"

download_logo "Halmstads BK" \
  "https://assets.footylogos.com/logos/halmstads-bk/halmstads-bk-logo-footylogos.svg" \
  "halmstads-bk.svg"

download_logo "Hammarby IF" \
  "https://assets.footylogos.com/logos/hammarby-if/hammarby-if-logo-footylogos.svg" \
  "hammarby-if.svg"

download_logo "IF Brommapojkarna" \
  "https://assets.footylogos.com/logos/if-brommapojkarna/if-brommapojkarna-logo-footylogos.svg" \
  "if-brommapojkarna.svg"

download_logo "IF Elfsborg" \
  "https://assets.footylogos.com/logos/if-elfsborg/if-elfsborg-logo-footylogos.svg" \
  "if-elfsborg.svg"

download_logo "IFK Göteborg" \
  "https://assets.footylogos.com/logos/ifk-goteborg/ifk-goteborg-logo-footylogos.svg" \
  "ifk-goteborg.svg"

download_logo "IK Sirius" \
  "https://assets.footylogos.com/logos/ik-sirius/ik-sirius-logo-footylogos.svg" \
  "ik-sirius.svg"

download_logo "Malmö FF" \
  "https://assets.footylogos.com/logos/malmo-ff/malmo-ff-logo-footylogos.svg" \
  "malmo-ff.svg"

download_logo "Mjällby AIF" \
  "https://assets.footylogos.com/logos/mjallby-aif/mjallby-aif-logo-footylogos.svg" \
  "mjallby-aif.svg"

# PNG-loggor (3 klubbar - SVG ej tillgänglig på CDN)
download_logo "Kalmar FF" \
  "https://www.footylogos.com/dls/logo/rgba-v1/kalmar.png" \
  "kalmar-ff.png"

download_logo "Västerås SK" \
  "https://www.footylogos.com/dls/logo/rgba-v1/vasteras-sk.png" \
  "vasteras-sk.png"

download_logo "Örgryte IS" \
  "https://www.footylogos.com/dls/logo/rgba-v1/orgryte.png" \
  "orgryte-is.png"

echo ""
echo "✅ Alla 16 loggor hämtade!"
echo ""
echo "Format:"
echo "  SVG:  13 klubbar (vectorskalning)"
echo "  PNG:   3 klubbar (512x512)"
echo ""
echo "Källor: assets.footylogos.com, www.footylogos.com/dls"
echo "Logotyperna tillhör respektive klubb."
