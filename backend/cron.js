import { CronJob } from 'cron'
import axios from 'axios'
import * as db from './db.js'

export const OnlineStatsJob = new CronJob('0 0 * * * *', () => {
  console.log('Cron working...')
  const time = new Date().getTime()
  axios.get('https://api.minetools.eu/query/play.mcbrawl.ru/25565')
	.then((res) => {
		const number = res.data.Players
		db.addOnlineStat(number, time)
	})
	.catch((err) => {
		console.log(err)
	})
}, null, true, 'Europe/Moscow')
