Write-Host "Shutting down FootPulse services..." -ForegroundColor Yellow
$sshKey = "$env:USERPROFILE\.ssh\id_ed25519"

# 1. PC의 Next.js node 프로세스 종료
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next*" -or $_.Path -like "*node*" } | Stop-Process -Force -ErrorAction SilentlyContinue

# 2. 스마트폰 내부 백엔드 및 터널 프로세스 종료
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" forward tcp:8022 tcp:8022
ssh -p 8022 -o StrictHostKeyChecking=no -i $sshKey u0_a33@127.0.0.1 "pkill -f 'python.*server.py'; pkill -f 'cloudflared'; echo 'Phone edge servers stopped.'"

Write-Host "FootPulse all services successfully stopped." -ForegroundColor Green