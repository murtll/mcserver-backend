import express from 'express'
import fs from 'fs'
import cors from 'cors'

const PORT=3001

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.json({ status: 'OK' })
})

app.get('/:file', async (req, res) => {
    try {
        const ans = JSON.parse(await fs.promises.readFile(`./data/${req.params.file}.json`))
        res.json(ans)
    } catch (error) {
        res.status(400).json({ error: error })
    }
})

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})
