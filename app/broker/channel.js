'use strict'

import amqp from 'amqplib'

let client 
const EXCHANGE = 'drivers'
const QUEUE = 'drivers.status.q'
const ROUTING_KEY = 'drivers.update'

const getApiAndEmit = async(socket, driversState) => {
  try {
    console.log('Driver: ', driversState)
    socket.emit("FromAPI", driversState) // Emitting a new message. It will be consumed by the client
  } catch (error) {
    console.error(`Error: ${error.code}`)
  }
};

async function init(io) {
  client = await amqp.connect( process.env.RABBITMQ_URL);
  client.channel = await client.createChannel();
  
  await client.channel.assertQueue(QUEUE, {});
  await client.channel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);
  
  await client.channel.consume(QUEUE, function(msg) {
    const driversState = JSON.parse(msg.content.toString('utf8'))

    //console.log('Driver: ', driversState)

    io.on("connection", socket => {
      console.log("New client connected");
      
     setInterval(() => getApiAndEmit(socket, driversState), 10000);
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
    client.channel.ack(msg);
  }, { noAck: false })  
}

export default init