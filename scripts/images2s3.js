import * as s3 from '../backend/s3.js'
import fs from 'fs'

const script = async () => {
    for (const folder of (fs.readdirSync('public/images'))) {
        if (fs.statSync(`public/images/${folder}`).isFile()) continue
        console.log(`Transferring files from ${folder} folder`)
        for (const file of (fs.readdirSync(`public/images/${folder}`))) {
            console.log(`Uploading ${folder}/${file}...`)
            const buffer = fs.readFileSync(`public/images/${folder}/${file}`)
            await s3.upload(buffer, `${folder}/${file}`)
            console.log(`Success!`)
        }
    }
    console.log(`Finished transfer`)
}

script()