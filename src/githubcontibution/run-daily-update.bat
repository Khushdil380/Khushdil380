@echo off
REM 🤖 Windows Daily Automation Script for GitHub Contribution Graph
REM This script can be scheduled to run daily via Windows Task Scheduler

echo.
echo 🤖 GitHub Contribution Graph Auto-Updater
echo ==========================================

REM Change to script directory
cd /d "%~dp0"

REM Run the Node.js updater
echo 🔄 Running contribution graph updater...
node daily-updater.js

REM Check if the update was successful
if %errorlevel% equ 0 (
    echo.
    echo ✅ Update completed successfully!
    echo 📅 Next scheduled update: tomorrow at the same time
) else (
    echo.
    echo ❌ Update failed with error code %errorlevel%
    echo 🔧 Check the log file for details
)

REM Optional: Uncomment the line below to keep the window open for debugging
REM pause

echo.
echo 🕒 Update finished at %date% %time%