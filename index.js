import admin from 'firebase-admin'
import serviceAccountKey from './serviceAccountKey.js'
import fs from 'fs'
import { getAnnouncements } from './fetchers/announcements.js';
import cron from 'node-cron'

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
});

const announcementCachePath = "cache/announcement-cache.json"

console.log("RYW Latest Notifier Service")

const messaging = admin.messaging()

const fetchAnnouncements = async () => {
    let cacheTitles = JSON.parse(fs.readFileSync(announcementCachePath, "utf-8"))
    const announcements = await getAnnouncements()

    if (cacheTitles.length == 0) {
        for (const a of announcements) {
            cacheTitles.push(a.title)
        }
    } else {
        const newArticles = []

        for (const a of announcements) {
            if (cacheTitles.includes(a.title) == false) {
                newArticles.push(a)
            }
        }

        for (const newA of newArticles) {
            try {
                console.log("FORWADING ", newA.title)
                await messaging.send({
                    notification: {
                        title: "ข่าวประชาสัมพันธ์ใหม่",
                        body: newA.title
                    },
                    topic: "all"
                })
            } catch(err) {
                console.log(err)
            }

            cacheTitles.push(newA.title)
        }
    }

    fs.writeFileSync(announcementCachePath, JSON.stringify(cacheTitles))
}

async function mainLoop() {
    console.log("Fetching")
    await fetchAnnouncements()
}

cron.schedule("*/15 6-18 * * *", mainLoop)
mainLoop()

process.on("uncaughtException", (e) => {console.log(e)})