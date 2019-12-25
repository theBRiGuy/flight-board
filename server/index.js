const express = require('express'),
			cors = require('cors')

const PORT = 4000
const app = express()

app.use(cors())

app.get('/hello', (req, res) => {
	res.send('Hello world')
})

app.get('/arrivals', (req, res) => {
	const arrivals = require('./arrivals')
	res.send(arrivals)
})

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`)
})