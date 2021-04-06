// install ioredis
const Redis = require('ioredis')
const redis = new Redis()

async function handler() {
	// do the tasks as said
	await redis.flushall()
	await redis.set('best/platform', 'codedamn')
	await redis.set('best/developer', 'mehul')

	redis.quit()
}

// Note: To check functionality, call it here yourself and run `node index.js` in cloud terminal
// handler()

// handler function
module.exports = handler
