@echo off
title EAGLE BOOKS - Sivakasi
echo ===================================================
echo             EAGLE BOOKS - SIVAKASI
echo             Starting Local App Server...
echo ===================================================
cd /d "%~dp0"
timeout /t 2 /nobreak >nul
start "" "http://localhost:5173/"
npm run dev -- --host --port 5173
