import { IgApiClient } from 'instagram-private-api';
import { config } from 'dotenv';
import fs from 'fs'

config()

const ig = new IgApiClient();
// You must generate device id's before login.
// Id's generated based on seed
// So if you pass the same value as first argument - the same id's are generated every time
ig.state.generateDevice(process.env.IG_USERNAME);
// Optionally you can setup proxy url
ig.state.proxyUrl = process.env.IG_PROXY;
(async () => {
    const testImg = fs.readFileSync("./g_3.jpg")

    await ig.simulate.preLoginFlow();
    const loggedInUser = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

    process.nextTick(async () => await ig.simulate.postLoginFlow());

    console.log("Logged in as ", loggedInUser.username)

    await ig.publish.photo({
        file: testImg,
        caption: "ทดสอบ"
    })

    console.log("Posted")
})();