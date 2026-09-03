pkill -9 -f 'python.*server.py' || true
nohup python /sdcard/Download/server.py > /sdcard/Download/server.log 2>&1 &
sleep 2
cat /sdcard/Download/server.log
