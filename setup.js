import fs from 'fs'
fs.mkdirSync("cache")
fs.writeFileSync("cache/announcement-cache.json", "[]")