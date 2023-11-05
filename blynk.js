import axios from 'axios'
import config from './config.js'

export async function updateData(pin, data) {
    await axios.get(`https://blynk.cloud/external/api/update?token=${config.BLYNK_TOKEN}&pin=${pin}&value=${data}`)
}

export async function getData(pin) {
    const res = await axios.get(`https://blynk.cloud/external/api/get?token=${config.BLYNK_TOKEN}&pin=${pin}`)
    return toString(res.data)
}