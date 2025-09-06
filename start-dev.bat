@echo off
echo Starting Multilingual Form Translator Development Environment...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd Backend && npm install && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd Frontend && npm install && npm run dev"

echo.
echo Both servers are starting up...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
pause
