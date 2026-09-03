killall -9 python || true
nohup python /sdcard/Download/server.py > /sdcard/Download/server.log 2>&1 &
sleep 1
cat /sdcard/Download/server.log
