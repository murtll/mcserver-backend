import express from 'express'
import fs from 'fs'
import * as db from '../db.js'

const router = express.Router()

router.post('/item', async (req, res) => {
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

router.put('/item', async (req, res) => {
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

router.delete('/item', async (req, res) => {
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

router.post('/category', async (req, res) => {
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

router.put('/category', async (req, res) => {
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

router.delete('/category', async (req, res) => {
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

router.get('/images', async (req, res) => {
    try {
        const data = []
        for (const folder of (await fs.promises.readdir('public/images'))) {
            if (fs.statSync(`public/images/${folder}`).isFile()) continue

			const images = []

            for (const file of (await fs.promises.readdir(`public/images/${folder}`)))
            	images.push(`/images/${folder}/${file}`)

           	data.push({folder: folder, images: images})

        }
        res.json(data)   
    } catch (error) {
        res.status(400).json({ error: error.toString() })
    }
})

router.post('/image', async (req, res) => {
    try {
        if (!(await db.checkAuthKey(req.headers.authorization))) {
            res.status(400).json({
                error: 'Invalid key'
            })
            return
        }
    
        if (req.files.picture) {
            const image = req.files.picture;
            const category = req.body.category ? req.body.category : await db.getCategoryNameById(req.body.category_id)

            if (!fs.existsSync(`public/images/${category}`)) {
                fs.mkdirSync(`public/images/${category}`)
            }
    
            image.mv(`public/images/${category}/${image.name}`, (err) => {
                if (err) {
                    console.log(error);
                    return res.status(400).json({ error: err });
                }
            });

            // await db.addItem({ ...req.body, picture: `/images/${req.body.category}/${image.name}`})
            res.json({ picture: `/images/${category}/${image.name}`})
        } else {
            res.status(400).json({error: 'No picture provided'})
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({error: error})
    }
})


export default router
