import { CronJob } from 'cron'
import axios from 'axios'
import * as db from './db.js'

export const OnlineStatsJob = new CronJob('0 */5 * * * *', () => {
  console.log('Cron working...')
  const date = new Date()
  const time = date.getTime()
  console.log(date)
  axios.get('https://api.minetools.eu/query/play.mcbrawl.ru/25565')
	.then(async (res) => {
		const number = res.data.Players

		const lastStat = await db.getLastStat()

		if (new Date(lastStat.time).getHours() === date.getHours()) {
			if (number > lastStat.number) {
				db.updateLastStat(lastStat.id, number, time)
			}
		} else {
			db.addOnlineStat(number, time)
		}
	})
	.catch((err) => {
		console.log(err)
	})
}, null, true, 'Europe/Moscow')
