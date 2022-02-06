import express from 'express'
import fs from 'fs'
import * as db from '../db.js'
import { Rcon } from 'rcon-client'

const router = express.Router()

var rcon = null

export const connectToRcon = () => {
    rcon = new Rcon({
        host: process.env.RCON_HOST, 
        port: Number(process.env.RCON_PORT), 
        password: process.env.RCON_PASS
    })

    rcon.on("connect", () => console.log("RCON connected"))
    rcon.on("authenticated", () => console.log("RCON authenticated"))
    rcon.on("end", () => console.log("RCON end"))
    rcon.on("error", (e) => {
        console.log("RCON error")
        console.log(e)
    })
}

router.get('/help', async (req, res) => {
    try {
        await rcon.connect()
        const ans = await rcon.send('help')
        rcon.end()
        res.json({ help: ans })
    } catch (error) {
        console.log(error)
        res.status(400).json({ help: error.toString() })
    }
})

router.get('/say', async (req, res) => {
    try {
        await rcon.connect()
        const ans = await rcon.send(`say ${req.query.phrase}`)
        rcon.end()
        res.json({ result: 'success' })
    } catch (error) {
        console.log(error)
        res.status(400).json({ help: error.toString() })
    }
})

router.post('/process-payment', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

    // res.json({
    //     header: req.headers['x-forwarded-for'],
    //     socket: req.socket.remoteAddress,
    //     req: req.ip
    // })

    // TODO change IP checking to normal 

    const trustedIps = [
        '185.71.76.0/27',
        '185.71.77.0/27',
        '77.75.153.0/25',
        '77.75.156.11',
        '77.75.156.35',
        '77.75.154.128/25',
        '2a02:5180:0:1509::/64',
        '2a02:5180:0:2655::/64',
        '2a02:5180:0:1533::/64',
        '2a02:5180:0:2669::/64'
    ]

    if (trustedIps.includes(ip)) {
        res.json({ok: true})
    } else {
        res.json({error: 'Bad IP address'})
    }
    
})

export default router