'use strict'

import http from 'http'
import socketIo from 'socket.io'
import logger from './lib/logger'
import app from './index'
import init from 'app/broker/channel'

const httpPort = process.env.PORT || 4000
const msg = `Drive State API - Running on port ${httpPort}`

const server = http.Server(app)
http.globalAgent.maxSockets = Infinity

server.listen(httpPort, () => {
    logger.info(msg)
});

const io = socketIo(server);

init(io)

module.exports = {
    server
}