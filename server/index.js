const express = require('express')

const PORT = 4000
const app = express()

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