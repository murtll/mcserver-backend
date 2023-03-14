import { CronJob } from 'cron'
import axios from 'axios'
import * as db from './db.js'

export const OnlineStatsJob = new CronJob('0 * * * * *', () => {
  console.log('Cron working...')
  const date = new Date()
  const time = date.getTime()
  console.log(date)
  axios.get('https://api.minetools.eu/query/play.mcbrawl.ru/25565')
	.then(async (res) => {
		const number = res.data.Players
		
		console.log(`players: ${number}`)

		const lastStat = await db.getLastStat()

		if (lastStat && new Date(lastStat.time).getHours() == date.getHours()) {
			if (number > lastStat.number) {
				await db.updateStat(lastStat.id, number, time)
			}
		} else {
			await db.addOnlineStat(number, time)
		}
	})
	.catch((err) => {
		console.log(err)
	})
}, null, true, 'Europe/Moscow')
