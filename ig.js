import { IgApiClient } from 'instagram-private-api';
import { config } from 'dotenv';
import fs from 'fs'

config()

const ig = new IgApiClient()
ig.state.generateDevice(process.env.IG_USERNAME)

ig.state.proxyUrl = process.env.IG_PROXY

export async function init() {
    await ig.simulate.preLoginFlow()
    const loggedInUser = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD)

    console.log("Logged in as ", loggedInUser.username)
}

export async function postImg(buffer, caption) {
    await ig.publish.photo({
        file: buffer,
        caption: caption
    })

    console.log("IG Posted")
}