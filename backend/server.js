import express from 'express'
import fs from 'fs'
import cors from 'cors'
import * as db from './db.js'
import fileUpload from 'express-fileupload'
import dotenv from 'dotenv'

import adminRouter from './routes/admin.js'
import mcServerRouter, { connectToRcon } from './routes/mcserver.js'

dotenv.config()

const PORT=process.env.PORT || 3001

db.openDb()
connectToRcon()

const app = express()

// for application/json parsing
app.use(express.json())
// for application/form-data parsing (uploading images)
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: 'public/images'
}))
// for cors support
app.use(cors())
// for image sharing
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.json({ status: 'OK' })
})

app.get('/categories', async (req, res) => {
    try {
        const ans = await db.selectCategories()
        res.json(ans)
    } catch (error) {
        res.status(400).json({ error: error })
    }
})

app.get('/:category', async (req, res) => {
    try {
        const ans = await db.selectItems(req.params.category)
        res.json(ans)
    } catch (error) {
        res.status(400).json({ error: error })
    }
})

app.use('/admin', adminRouter)
app.use('/mcserver', mcServerRouter)

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})
