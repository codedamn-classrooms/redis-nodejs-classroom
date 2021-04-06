const express = require('express')
const path = require('path')
const fetch = require('node-fetch')
const redis = require('./redis-client')

const app = express()

app.use(express.json())

app.post('/api/route', async (req, res) => {
	// add data here
	const ip = req.headers['x-forwarded-for'] || req.ip

	const reqs = await redis.incr(ip)
	await redis.expire(ip, 2)

	if (reqs > 15) {
		return res.json({
			status: 'rate-limited'
		})
	} else if (reqs > 10) {
		return res.json({
			status: 'about-to-rate-limit'
		})
	} else {
		res.json({
			status: 'ok'
		})
	}
})

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(process.env.PUBLIC_PORT, () => {
	console.log('Server ready')
})
