import admin from 'firebase-admin'
import serviceAccountKey from './serviceAccountKey.js'

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
});

console.log("RYW Latest Notifier")

const messaging = admin.messaging()

messaging.send({
    notification: {
        title: "Test",
        body: "Test RYW"
    },
    topic: "all"
})