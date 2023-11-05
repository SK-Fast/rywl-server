import { IgApiClient } from 'instagram-private-api';
import config from './config.js'

const ig = new IgApiClient()
ig.state.generateDevice(config.IG_USERNAME)

export async function init() {
    await ig.simulate.preLoginFlow()
    const loggedInUser = await ig.account.login(config.IG_USERNAME, config.IG_PASSWORD)

    console.log("Logged in as ", loggedInUser.username)
}

export async function postImg(buffer, caption) {
    await ig.publish.photo({
        file: buffer,
        caption: caption
    })

    console.log("IG Posted")
}