import admin from 'firebase-admin'
import serviceAccountKey from './serviceAccountKey.js'
import fs from 'fs'
import { getAnnouncements, getBanners } from './fetchers/announcements.js';
import cron from 'node-cron'
import * as IG from './ig.js'
import axios from "axios"
import * as Blynk from './blynk.js'
import path from 'path'
import {fileURLToPath} from 'url';

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
});

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const announcementCachePath = path.resolve(__dirname, "cache/announcement-cache.json")
const bannerCachePath = path.resolve(__dirname, "cache/banners-cache.json")

const dtFormat = new Intl.DateTimeFormat('en',
    {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h23'
    })

const messaging = admin.messaging()

Blynk.writeConsole(`RYW Latest Ready at ${dtFormat.format(new Date())}`)

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
                Blynk.writeConsole(`New article detected ${a.title}`)

                newArticles.push(a)
            }
        }

        if ((await Blynk.getData("V2")) == 1) {
            for (const newA of newArticles) {
                try {
                    Blynk.writeConsole(`Forwarding Article ${newA.title}`)
                    await messaging.send({
                        notification: {
                            title: "ข่าวประชาสัมพันธ์ใหม่",
                            body: newA.title
                        },
                        topic: "all"
                    })
                } catch (err) {
                    console.log(err)
                }

                cacheTitles.push(newA.title)
            }
        }
    }

    fs.writeFileSync(announcementCachePath, JSON.stringify(cacheTitles))
}

const fetchBanners = async () => {
    let cacheTitles = JSON.parse(fs.readFileSync(bannerCachePath, "utf-8"))
    const banners = await getBanners()

    if (cacheTitles.length == 0) {
        cacheTitles = banners
    } else {
        const newBanners = []

        for (const a of banners) {
            if (cacheTitles.includes(a) == false) {
                Blynk.writeConsole(`New banner detected ${a}`)
                newBanners.push(a)
            }
        }

        const igEnabled = await Blynk.getData("V1")

        if (igEnabled == 1) {
            for (const newA of newBanners) {
                const buf = await axios.get(newA, {
                    responseType: "arraybuffer"
                })
                const buffer = Buffer.from(buf.data, 'base64');

                await IG.postImg(buffer, "📢 ประกาศภาพใหม่บนหน้าเว็บ https://rayongwit.ac.th/")

                Blynk.writeConsole("Wrote to IG")

                cacheTitles.push(newA)
                fs.writeFileSync(bannerCachePath, JSON.stringify(cacheTitles))
            }
        }
    }
}

async function mainLoop() {
    await fetchAnnouncements()
    await fetchBanners()
    Blynk.updateData("V0", dtFormat.format(new Date()))
}

cron.schedule("*/5 5-22 * * *", mainLoop)
async function main() {
    await IG.init()
    mainLoop()
}

setTimeout(() => {
    main()
}, 5000);

process.on("uncaughtException", (e) => { console.log(e) })
process.on("unhandledRejection", (e) => { console.log(e) })