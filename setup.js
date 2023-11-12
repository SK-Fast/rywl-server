import fs from 'fs'
try { fs.rmSync("cache", {recursive: true}) } catch{}
try { fs.mkdirSync("cache") } catch{}
try { fs.writeFileSync("cache/announcement-cache.json", "[]") } catch{}
try { fs.writeFileSync("cache/banners-cache.json", "[]") } catch{}
try { fs.writeFileSync("cache/banners-cache.json", "[]") } catch{}
try { fs.writeFileSync("/etc/systemd/system/rywld.service", `
[Unit]
Description=RYWL Service
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=1
ExecStart=node /rywl-server/index.js

[Install]
WantedBy=multi-user.target`) } catch(e) {console.log(e)}