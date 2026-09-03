pkill -f "cloudflared" || true
nohup cloudflared tunnel --url http://127.0.0.1:8000 > /sdcard/Download/tunnel.log 2>&1 &
sleep 6
grep -o "https://[a-zA-Z0-9-]*\.trycloudflare\.com" /sdcard/Download/tunnel.log | head -n 1
