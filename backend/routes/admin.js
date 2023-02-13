import express from 'express'
import fs from 'fs'
import crypto from 'crypto'

import * as db from '../db.js'
import * as s3 from '../s3.js'
import { auth } from '../auth.js'
import { getRcon } from '../rcon.js'

const router = express.Router()
const rcon = getRcon()

 // bigadminpassword - default key
const adminKeyHash = process.env.ADMIN_KEY || 'aaa337acda132f1836775265ac68063a72b5800982495636f3463969de76376d'

router.post('/command', auth, async (req, res) => {
    console.log(req.body)
    try {
        const command = req.body.command
        console.log(`sending ${command} to server`)
        await rcon.connect()
        const response = await rcon.send(command)

        console.log(response)

        rcon.end()

        res.json({ ok: true, message: response })
    } catch (error) {
        res.status(400).json({ error: error.toString() })
    }
})

router.post('/login', async (req, res) => {
    try {
        if (!(crypto.createHash('sha256').update(req.headers.authorization).digest('hex') === adminKeyHash)) {
            res.status(400).json({
                error: 'Invalid key'
            })
            return
        }

        req.session.admin = true

        res.sendStatus(200)

    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.toString() })
    }
})

router.post('/item', auth, async (req, res) => {
    try {
        await db.addItem(req.body)

        res.json({ added: req.body })

    } catch (error) {
        res.status(400).json({ error: error })
    }
})

router.put('/item', auth, async (req, res) => {
    try {
        await db.updateItem(req.body)

        res.json({ updated: req.body })

    } catch (error) {
        res.status(400).json({ error: error })
    }
})

router.delete('/item', auth, async (req, res) => {
    try {
        await db.deleteItem(req.body)

        res.json({ deleted: req.body })

    } catch (error) {
        res.status(400).json({ error: error })
    }
})

router.get('/categories', auth, async (req, res) => {
    try {
        const ans = await db.selectCategories()
        res.json(ans)
    } catch (error) {
        res.status(400).json({ error: error.toString() })
    }
})

router.post('/category', auth, async (req, res) => {
    try {
        await db.addCategory(req.body)

        res.json({ added: req.body })

    } catch (error) {
        res.status(400).json({ error: error })
    }
})

router.put('/category', auth, async (req, res) => {
    try {
        await db.updateCategory(req.body)

        res.json({ updated: req.body })

    } catch (error) {
        res.status(400).json({ error: error })
    }
})

router.delete('/category', auth, async (req, res) => {
    try {
        await db.deleteCategory(req.body)

        res.json({ deleted: req.body })

    } catch (error) {
        res.status(400).json({ error: error })
    }
})

router.get('/images', auth, async (req, res) => {
    try {
        const data = await s3.list()
        res.json(data)   
    } catch (error) {
        res.status(400).json({ error: error.toString() })
    }
})

router.post('/image', auth, async (req, res) => {
    try {
        if (req.files.picture) {
            const image = req.files.picture;
            const category = req.body.category ? req.body.category : await db.getCategoryNameById(req.body.category_id)

            const imageKey = await s3.upload(image.data, `${category}/${image.name}`)

            res.json({ picture: `/images/${imageKey}`})
        } else {
            res.status(400).json({error: 'No picture provided'})
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.toString() })
    }
})

router.post('/promo', auth, async (req, res) => {
    try {

        if (!String(req.body.name) || 
            !Number(req.body.multiplier) || 
            Number(req.body.multiplier) >= 1 || 
            Number(req.body.multiplier) <= 0) {
                return res.sendStatus(400)
            }

        await db.addPromo(req.body)

        res.json({ added: req.body })

    } catch (error) {
        res.status(400).json({ error: error })
    }
})

router.delete('/promo', auth, async (req, res) => {
    try {
        await db.deletePromo(req.body)

        res.json({ deleted: req.body })

    } catch (error) {
        res.status(400).json({ error: error })
    }
})

router.get('/promos', auth, async (req, res) => {
    try {
        const result = await db.getAllPromos()

        res.json(result)

    } catch (error) {
        res.status(400).json({ error: error })
    }
})

router.get('/:category', auth, async (req, res) => {
	try {
		const ans = await db.selectItems(req.params.category)
		res.json(ans)
	} catch (error) {
		res.status(400).json({ error: error.toString() })
	}
})

export default router
