import admin from 'firebase-admin'
import serviceAccountKey from './serviceAccountKey.js'
import fs from 'fs'
import { getAnnouncements } from './fetchers/announcements.js';

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
});

const announcementCachePath = "cache/announcement-cache.json"

console.log("RYW Latest Notifier")
console.log(app)

const messaging = admin.messaging()

/*
messaging.send({
    notification: {
        title: "Test",
        body: "Test RYW"
    },
    topic: "all"
})
*/

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
    await fetchAnnouncements()
    setTimeout(() => {
        mainLoop()
    }, 2000);
}

mainLoop()

process.on("uncaughtException", (e) => {console.log(e)})