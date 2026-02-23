@echo off
echo 🛡️  BCH Agent Nexus - Launcher
echo ===============================

cd c:\python\bch-agent-app
start cmd /k "echo Starting API Server... && npm run api"
start cmd /k "echo Starting Frontend... && npm run dev"

echo 🚀 Services are starting!
echo 🌐 Web Dashboard: http://localhost:5173
echo 🛰️ API Endpoint:   http://localhost:4000
echo.
echo Use 'bch-agent login' in your CLI to connect.
echo After deployment, use 'bch-agent sync' to see agents on the dashboard.
echo.
pause
