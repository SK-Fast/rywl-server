import axios from 'axios'

export async function updateData(pin, data) {
    await axios.get(`https://blynk.cloud/external/api/update?token=${process.env.BLYNK_TOKEN}&pin=${pin}&value=${data}`)
}

export async function getData(pin) {
    const res = await axios.get(`https://blynk.cloud/external/api/get?token=${process.env.BLYNK_TOKEN}&pin=${pin}`)
    return toString(res.data)
}