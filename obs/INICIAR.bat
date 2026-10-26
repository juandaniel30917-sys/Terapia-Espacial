@echo off
title TERAPIA ESPACIAL - Servidor de graficas
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  No se encontro Node.js. Instalalo desde https://nodejs.org  (version LTS^) y vuelve a abrir este archivo.
  echo.
  pause
  exit /b
)
start "" http://localhost:8080/
node servidor.js
pause
