
echo 🚀 Starting DB4Fresh Project...

echo.
echo 🟡 Starting Zookeeper...
start cmd /k "cd /d C:\kafka\kafka_2.13-3.9.2 && .\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties"

timeout /t 5 >nul

echo.
echo 🔵 Starting Kafka...
start cmd /k "cd /d C:\kafka\kafka_2.13-3.9.2 && .\bin\windows\kafka-server-start.bat .\config\server.properties"

)echo ⏳ Waiting for Kafka to be ready...

:waitKafka
netstat -ano | findstr :9092 >nul
if errorlevel 1 (
    timeout /t 3 >nul
    goto waitKafka
)

echo ⏳ Kafka port open, waiting for full startup...
timeout /t 15 >nul
echo ✅ Kafka fully ready!

echo ✅ Kafka is ready!

echo.
echo 🟢 Starting Backend...
start cmd /k "cd /d %cd%\backend && npm start"

timeout /t 5 >nul

echo.
echo 🟣 Starting Frontend...
start cmd /k "cd /d %cd% && npm run dev"

echo.
echo ✅ All services started!
pause