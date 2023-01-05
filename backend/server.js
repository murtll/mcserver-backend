import express from 'express'
import cors from 'cors'
import * as db from './db.js'
import fileUpload from 'express-fileupload'
import dotenv from 'dotenv'
import session from 'express-session'

import adminRouter from './routes/admin.js'
import serverInfoRouter from './routes/serverinfo.js'
import mcServerRouter from './routes/mcserver.js'
import { connectToRcon } from './rcon.js'
import { OnlineStatsJob } from './cron.js'

dotenv.config()

const PORT = process.env.PORT || 3001

db.openDb()
connectToRcon()
OnlineStatsJob.start()

const app = express()

// to disable x-powered-by header
app.disable('x-powered-by')

// for application/json parsing
app.use(session({
    // store: ,
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: {
        sameSite: 'strict',
        maxAge: 3600000, 
        path: '/api/admin', 
    },
    saveUninitialized: false
}))

// for application/json parsing
app.use(express.json())

// for application/form-data parsing (uploading images)
app.use(express.urlencoded({ extended: true }))

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: 'public/images'
}))

// for image sharing
app.use(express.static('public'))

// for cors support
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));

app.get('/', (req, res) => {
    res.json({ status: 'OK' })
})

app.get('/categories', async (req, res) => {
    try {
        const ans = await db.selectCategories()
        res.json(ans)
    } catch (error) {
        res.status(400).json({ error: error.toString() })
    }
})

app.get('/item', async (req, res) => { 
    try {
        const item = await db.getPublicItemById(req.query.id)
        res.json(item)
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.toString() })
    }
})

app.get('/last-donates', async (req, res) => { 
    try {
        const donates = await db.getLastDonates() || []

        res.json(donates)
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.toString() })
    }
})


app.get('/check-promo', async (req, res) => { 
    try {
        const promoInfo = await db.getPromo(req.query.promo)
	if (promoInfo)
            res.json({ multiplier: promoInfo.multiplier })
	else
	    res.status(400).json({ error: 'No such promo.' })
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.toString() })
    }
})

app.get('/:category', async (req, res) => {
    try {
        const ans = await db.selectPublicItems(req.params.category)
        res.json(ans)
    } catch (error) {
        res.status(400).json({ error: error.toString() })
    }
})

app.use('/admin', adminRouter)
app.use('/mcserver', mcServerRouter)
app.use('/serverinfo', serverInfoRouter)

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})

