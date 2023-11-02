import fs from 'fs'
try { fs.mkdirSync("cache") } catch{}
try { fs.writeFileSync("cache/announcement-cache.json", "[]") } catch{}
try { fs.writeFileSync("cache/banners-cache.json", "[]") } catch{}
