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
    console.log('from: ' + ip)
    const trustedInterkassaIp = '35.233.69.55'
    
    const info = req.body
    console.log(info)
    
    try {
        const item = await db.getItemById(Number(info.ik_x_donate))
		if (item.price !== Number(info.ik_am)) {
			console.log('Invalid amount: ' + info.ik_am)
			return res.status(400).json({ error: 'Invalid amount' })
		}

		if (item.command) {
		   console.log(`sending ${item.command} to server`)
		   await rcon.connect()
           await rcon.send(item.command)
           rcon.end()
		} else {
		   console.log('No command for item')
		}

        await db.addDonateInfo(Number(info.ik_x_donate), info.ik_x_username)

        res.json({ok: true})

//		res.redirect('http://localhost:3000')
    } catch(error) {
        console.log(error);
        res.status(400).json({ error: error.toString() })
    }
})

export default router
