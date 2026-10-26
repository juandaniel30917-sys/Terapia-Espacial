#!/bin/bash
# Mac: doble clic para iniciar el servidor de gráficas de Terapia Espacial
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "No se encontró Node.js. Instálalo desde https://nodejs.org (versión LTS) y vuelve a abrir este archivo."
  read -n 1
  exit 1
fi
open "http://localhost:8080/"
node servidor.js
