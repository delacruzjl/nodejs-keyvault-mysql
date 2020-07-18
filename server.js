const express = require('express')
const sampler = require('./sampler')
const app = express()
const port = 8080

app.get('/', (req, res) => sampler(req, res))

app.listen(port, () => console.log(`App listening on port ${port}`))