@echo off
title Antigravity Omni-Meter - Multi-Tenant Cloud Command Center
echo ======================================================================
echo   ANTIGRAVITY OMNI-METER: MULTI-TENANT PAAS MONITORING PLATFORM
echo ======================================================================
echo.
echo [1/3] Checking Node.js runtime environment...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not found. Please install Node.js v18+.
    pause
    exit /b 1
)

echo [2/3] Starting Antigravity Omni-Meter Multi-Tenant Service...
cd /d "%~dp0"

:: Check if port 3000 is active
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo [*] Omniverse Service is already running on port 3000.
) else (
    echo [*] Launching Next.js service daemon...
    start /b npm run dev >nul 2>&1
    timeout /t 3 /nobreak >nul
)

echo [3/3] Opening Omniverse Authentication & Monitoring Portal...
start http://localhost:3000

echo.
echo ======================================================================
echo  Platform is LIVE!
echo  - User Dashboard: http://localhost:3000
echo  - Universal Admin Console: http://localhost:3000/admin
echo ======================================================================
timeout /t 5
