Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  FootPulse Edge System - One-Click Launcher   " -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

$adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
$sshKey = "$env:USERPROFILE\.ssh\id_ed25519"

# 1. 단말기 연결 확인
Write-Host "[1/5] Checking phone connection via ADB..." -ForegroundColor Yellow
$device = & $adb devices | Select-String "device$"
if (-not $device) {
    Write-Host "[ERROR] Smartphone not detected. Please connect USB and enable USB Debugging." -ForegroundColor Red
    exit 1
}
Write-Host "  -> Device connected: $device" -ForegroundColor Green

# 2. Termux 앱 깨우기 및 SSH 데몬 시작
Write-Host "[2/5] Starting Termux & SSH Daemon..." -ForegroundColor Yellow
& $adb shell am start -n com.termux/.app.TermuxActivity | Out-Null
Start-Sleep -Seconds 1
& $adb shell "input text 'sshd'; input keyevent 66" | Out-Null
Start-Sleep -Seconds 1

# 3. 포트 포워딩
Write-Host "[3/5] Setting up port forwards (8022: SSH, 8000: API)..." -ForegroundColor Yellow
& $adb forward tcp:8022 tcp:8022 | Out-Null
& $adb forward tcp:8000 tcp:8000 | Out-Null

# 4. 스마트폰 내부 서비스 (PostgreSQL, Bottle API, Cloudflare Tunnel) 기동
Write-Host "[4/5] Launching phone services (PostgreSQL, Backend API, Cloudflare)..." -ForegroundColor Yellow
ssh -p 8022 -o StrictHostKeyChecking=no -i $sshKey u0_a33@127.0.0.1 "pg_ctl -D `$PREFIX/var/lib/postgresql status >/dev/null 2>&1 || pg_ctl -D `$PREFIX/var/lib/postgresql start; pgrep -f 'python.*server.py' >/dev/null || nohup python /sdcard/Download/server.py > /sdcard/Download/server.log 2>&1 & sleep 1; pgrep -f 'cloudflared' >/dev/null || nohup cloudflared tunnel --url http://127.0.0.1:8000 > /sdcard/Download/tunnel.log 2>&1 &"

# 5. 프론트엔드 기동
Write-Host "[5/5] Starting Next.js Web Frontend on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd c:\Users\DooBokWie\Desktop\Project\FootPulse\frontend; npm run start"

Start-Sleep -Seconds 3
Write-Host "===============================================" -ForegroundColor Green
Write-Host "  FootPulse System is RUNNING!                 " -ForegroundColor Green
Write-Host "  Frontend: http://localhost:3000              " -ForegroundColor Green
Write-Host "  Backend:  http://localhost:8000/api/feed     " -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Start-Process "http://localhost:3000"