import express from 'express'
import fs from 'fs'
import * as db from '../db.js'

const router = express.Router()

router.get('/graphinfo', async (req, res) => {
	const info = await db.getOnlineStats()
	info.reverse()
	// finding maximum of players
	const max = Math.max.apply(null, info.map((e) => e.number))
	res.json({max: max, data: info})
})

export default router
