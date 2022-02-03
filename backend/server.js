import express from 'express'
import fs from 'fs'
import cors from 'cors'
import * as db from './db.js'
import fileUpload from 'express-fileupload'

const PORT=3001

const app = express()

db.openDb()

// for application/json parsing
app.use(express.json())
// for urlencoded form parsing (uploading images)
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

// app.post('/admin/item', async (req, res) => {
//     try {
//         if (!(await db.checkAuthKey(req.headers.authorization))) {
//             res.status(400).json({
//                 error: 'Invalid key'
//             })
//             return
//         }

//         await db.addItem(req.body)

//         res.json({ added: req.body })

//     } catch (error) {
//         res.status(400).json({ error: error })
//     }
// })

// app.put('/admin/item', async (req, res) => {
//     try {
//         if (!(await db.checkAuthKey(req.headers.authorization))) {
//             res.status(400).json({
//                 error: 'Invalid key'
//             })
//             return
//         }

//         await db.updateItem(req.body)

//         res.json({ updated: req.body })

//     } catch (error) {
//         res.status(400).json({ error: error })
//     }
// })

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

app.get('/admin/images', async (req, res) => {
    try {
        // const data = (await fs.readdir(`public/images/${req.params.category}`))
        //                 .map((file) => `/images/${req.params.category}/${file}`)
        const data = []
        for (const folder of (await fs.promises.readdir('public/images'))) {
            for (const file of (await fs.promises.readdir(`public/images/${folder}`)))
            data.push(`/images/${folder}/${file}`)
        }
        res.json(data)   
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
    
        if (req.files.picture) {
            const image = req.files.picture;

            if (!fs.existsSync(`public/images/${req.body.category}`)) {
                fs.mkdirSync(`public/images/${req.body.category}`)
            }
    
            image.mv(`public/images/${req.body.category}/${image.name}`, (err) => {
                if (err) {
                    console.log(error);
                    return res.status(400).json({ error: err });
                }
            });

            await db.addItem({ ...req.body, picture: `/images/${req.body.category}/${image.name}`})
            res.json({ added: { ...req.body, picture: `/images/${req.body.category}/${image.name}`} })
        } else if (req.body.picture) {
            await db.addItem(req.body)
            res.json({ added: req.body })
        } else {
            res.status(400).json({error: 'No picture provided'})
        }

        // res.json({ ...req.body, picture: `/images/${req.body.category}/${image.name}`})

    } catch (error) {
        console.log(error);
        res.status(400).json({error: error})
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
  
            if (req.files.picture) {
                const image = req.files.picture;
                let category = req.body.category

                if (!category) category = await db.getCategoryNameByItemId(req.body.id)

                console.log(category);

                if (!fs.existsSync(`public/images/${category}`)) {
                    fs.mkdirSync(`public/images/${category}`)
                }

                image.mv(`public/images/${category}/${image.name}`, (err) => {
                    if (err) {
                        console.log(error);
                        return res.status(400).json({ error: err.toString() });
                    }
                });

                await db.updateItem({ ...req.body, picture: `/images/${category}/${image.name}`})
                res.json({ updated: { ...req.body, picture: `/images/${category}/${image.name}`} })
            } else  {
                await db.updateItem(req.body)
                res.json({ updated: req.body })    
            }    
        } catch (error) {
            res.status(400).json({ error: error.toString() })
        }
    })

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})
