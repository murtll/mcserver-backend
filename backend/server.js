import express from 'express'
import fs from 'fs'
import cors from 'cors'
import * as db from './db.js'

const PORT=3001

const app = express()

db.openDb()

app.use(express.json())
app.use(cors())
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

app.post('/admin/item', async (req, res) => {
    try {
        if (!(await db.checkAuthKey(req.headers.authorization))) {
            res.status(400).json({
                error: 'Invalid key'
            })
            return
        }

        await db.addItem(req.body)

        res.json({ added: req.body })

    } catch (error) {
        res.status(400).json({ error: error })
    }
})

app.put('/admin/item', async (req, res) => {
    try {
        if (!(await db.checkAuthKey(req.headers.authorization))) {
            res.status(400).json({
                error: 'Invalid key'
            })
            return
        }

        await db.updateItem(req.body)

        res.json({ updated: req.body })

    } catch (error) {
        res.status(400).json({ error: error })
    }
})

app.delete('/admin/item', async (req, res) => {
    try {
        if (!(await db.checkAuthKey(req.headers.authorization))) {
            res.status(400).json({
                error: 'Invalid key'
            })
            return
        }

        await db.deleteItem(req.body)

        res.json({ deleted: req.body })

    } catch (error) {
        res.status(400).json({ error: error })
    }
})

app.post('/admin/category', async (req, res) => {
    try {
        if (!(await db.checkAuthKey(req.headers.authorization))) {
            res.status(400).json({
                error: 'Invalid key'
            })
            return
        }

        await db.addCategory(req.body)

        res.json({ added: req.body })

    } catch (error) {
        res.status(400).json({ error: error })
    }
})

app.put('/admin/category', async (req, res) => {
    try {
        if (!(await db.checkAuthKey(req.headers.authorization))) {
            res.status(400).json({
                error: 'Invalid key'
            })
            return
        }

        await db.updateCategory(req.body)

        res.json({ updated: req.body })

    } catch (error) {
        res.status(400).json({ error: error })
    }
})

app.delete('/admin/category', async (req, res) => {
    try {
        if (!(await db.checkAuthKey(req.headers.authorization))) {
            res.status(400).json({
                error: 'Invalid key'
            })
            return
        }

        await db.deleteCategory(req.body)

        res.json({ deleted: req.body })

    } catch (error) {
        res.status(400).json({ error: error })
    }
})

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})
