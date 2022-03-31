import express from 'express'
import fs from 'fs'
import * as db from '../db.js'
import { auth } from '../auth.js'

const router = express.Router()

router.post('/login', async (req, res) => {
    try {
        if (!(await db.checkAuthKey(req.headers.authorization))) {
            res.status(400).json({
                error: 'Invalid key'
            })
            return
        }

        req.session.admin = true

        res.sendStatus(200)

    } catch (error) {
        res.status(400).json({ error: error })
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

router.post('/image', auth, async (req, res) => {
    try {
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
