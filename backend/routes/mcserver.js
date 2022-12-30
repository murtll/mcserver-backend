import express from 'express'
import fs from 'fs'
import * as db from '../db.js'
import md5 from 'md5'
import { rcon } from '../rcon.js'

const router = express.Router()

const calculateSale = (number) => Math.round(50 / (Math.pow(Math.E, 3 - (number / Math.pow(Math.PI, 2))) + 1))
const calculatePrice = (price, number) => number > 1 ? number * Math.round(price * ((100 - calculateSale(number)) / 100)) : price

router.post('/kassa-redirect', async(req, res) => {    
    const item = await db.getItemById(Number(req.body.itemId))
    let promo = null
    if (req.body.promo)
    	promo = await db.getPromo(req.body.promo)

    if (item.price !== req.body.price || item.max_number < req.body.number || item.min_number > req.body.number) {
        res.status(400).json({error: 'Invalid price for item'})
        return
    }

    const donateId = `${req.body.username}-${item.id}-${new Date().getTime()}`

    if (req.body.kassa === 'interkassa') {
        const redirectUrl = `https://sci.interkassa.com?ik_co_id=620be9b760703a40c27176e2&ik_pm_no=${donateId}&ik_am=${calculatePrice(item.price, req.body.number)}&ik_cur=rub&ik_desc=${item.name + ' x' + req.body.number}&ik_suc_u=${req.body.successRedirect}&ik_suc_m=get&ik_ia_u=https://mcbrawl.ru:3002/mcserver/process-payment&ik_ia_m=post&ik_x_donate=${item.id}&ik_x_username=${req.body.username}&ik_x_number=${req.body.number}&ik_cli=${req.body.email}`

        res.json({redirectUrl: redirectUrl})
        return    
    } else if (req.body.kassa === 'freekassa') {
	    const resultPrice = Math.round((promo ? promo.multiplier : 1) * calculatePrice(item.price, req.body.number))
        const redirectUrl = `https://pay.freekassa.ru?m=12389&oa=${resultPrice}&currency=RUB&o=${donateId}&em=${req.body.email}&lang=ru&us_donate=${item.id}&us_username=${req.body.username}&us_number=${req.body.number}&us_promo=${req.body.promo || ''}&s=${md5(`12389:${resultPrice}:${process.env.FK_SIGN}:RUB:${donateId}`)}`

        res.json({redirectUrl: redirectUrl})
        return    
    } else {
        res.status(400).json({error: 'Invalid kassa'})
        return
    }
})

router.post('/process-payment', async (req, res) => {
    
    return res.status(400).json({ error: 'Not available' })

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    console.log('from: ' + ip)
    const trustedInterkassaIp = '35.233.69.55'
    
    const info = req.body
    console.log(info)
    
    try {
        const item = await db.getItemById(Number(info.ik_x_donate))
		if (calculatePrice(item.price, info.ik_x_number) !== Number(info.ik_am)) {
			console.log('Invalid amount: ' + info.ik_am + ' Real price: ' + calculatePrice(item.price, info.ik_x_number))
			return res.status(400).json({ error: 'Invalid amount' })
		}

		if (item.command) {
            var command = item.command.replaceAll('%user%', info.ik_x_username)

            if (info.ik_x_number)
    		   command = command.replaceAll('%number%', info.ik_x_number)
        
		   console.log(`sending ${command} to server`)
		   await rcon.connect()
           await rcon.send(command)
           rcon.end()
		} else {
		   console.log('No command for item')
		}

        await db.addDonateInfo(Number(info.ik_x_donate), info.ik_x_username, Number(info.ik_x_number))

        res.json({ok: true})

    } catch(error) {
        console.log(error);
        res.status(400).json({ error: error.toString() })
    }
})

router.post('/process-payment-fk', async (req, res) => {
    const trustedIps = ['168.119.157.136', '168.119.60.227', '138.201.88.124', '178.154.197.79']

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    
    console.log('from: ' + ip)

    if (!trustedIps.includes(ip)) {
        res.status(400).json({ error: 'Bad IP' })
    }

    const info = req.body
    console.log(info)
    
    if (await db.checkIfPaymentExists(info.intid)) return res.status(400).json({ error: 'Payment already exists.' })
    
    let promo = null
    if (req.body.us_promo)
    	promo = await db.getPromo(req.body.us_promo)
    
    try {
        const item = await db.getItemById(Number(info.us_donate))
		if (Math.round((promo ? promo.multiplier : 1) * calculatePrice(item.price, info.us_number)) !== Number(info.AMOUNT)) {
			console.log('Invalid amount: ' + info.AMOUNT + ' Real price: ' + calculatePrice(item.price, info.us_number))
			return res.status(400).json({ error: 'Invalid amount' })
		}

		if (item.command) {
	    	var command = item.command.replaceAll('%user%', info.us_username)
            if (info.us_number)
    		   command = command.replaceAll('%number%', info.us_number)
		
            console.log(`sending "${command}" to server`)
		    await rcon.connect()
            await rcon.send(command)
            rcon.end()
		} else {
		    console.log('No command for item')
		}

        await db.addDonateInfo(Number(info.us_donate), info.us_username, Number(info.us_number), Date.now(), info.MERCHANT_ORDER_ID, Number(info.AMOUNT))

        res.json({ok: true})

    } catch(error) {
        console.log(error);
        res.status(400).json({ error: error.toString() })
    }
})

export default router
