'use strict'

import express from 'express'

const app = express()

app.get('/', function(req, res) {
    res.send('Driver State API - v' + require('../package.json').version)
})

app.disable('x-powered-by')

export default app