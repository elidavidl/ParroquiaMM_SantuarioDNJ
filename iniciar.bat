@echo off
chcp 65001 >nul
title Web Santuario Divino Nino Jesus - localhost
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js. Instalalo desde https://nodejs.org y vuelve a abrir este archivo.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Instalando dependencias, solo la primera vez...
  call npm install
)
echo.
echo Abriendo http://localhost:5173  (cierra esta ventana para detener el servidor)
call npm run dev
pause
