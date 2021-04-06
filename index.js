const express = require('express')
const path = require('path')
const fetch = require('node-fetch')
const redis = require('./redis-client')

const app = express()

app.use(express.json())

app.post('/data', async (req, res) => {
	const repo = req.body.repo

	const value = await redis.get(repo)

	if (value) {
		// means we got a cache hit
		res.json({
			status: 'ok',
			stars: value
		})

		return
	}

	const response = await fetch(`https://api.github.com/repos/${repo}`).then((t) => t.json())

	if (response.stargazers_count != undefined) {
		await redis.setex(repo, 60, response.stargazers_count)
	}

	res.json({
		status: 'ok',
		stars: response.stargazers_count
	})
})

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(process.env.PUBLIC_PORT, () => {
	console.log('Server ready')
})
