        
const { Kafka } = require('kafkajs');
const config = require('./config');
const mongoose = require("mongoose");
const { connectDb } = require("../dbconnection");

const kafka = new Kafka({
  clientId: 'consumer',
  brokers: config.kafkaBrokers,
});

const consumer = kafka.consumer({ groupId: `${config.kafkaTopic}-group-two` });

connectDb();

const MessageSchema = new mongoose.Schema({
  partition: Number,
  offset: Number,
  value: String,
});

const MessageModel = mongoose.model("Message", MessageSchema);

const run = async () => {
  

    await consumer.connect();

    
    await consumer.subscribe({ topic: config.kafkaTopic, fromBeginning: true });

    
    await consumer.run({
        
    
      eachMessage: async ({ topic, partition, message }) => {
        
        console.log(` Partition: ${partition}, Offset: ${message.offset}, Value: ${message.value.toString()}`);

        const newMessage = new MessageModel({
          partition: partition,
          offset: message.offset,
          value: message.value.toString(),
        });
      
        try {
          await newMessage.save();
          console.log('Message saved to MongoDB');
        } catch (error) {
          console.error('Error saving message to MongoDB:', error);
        }
        
      },
      
    });
   
};


run().catch(console.error);

// const { Kafka } = require('kafkajs')
// const config = require('./config') 
// //const group=process.argv[2];

// const kafka = new Kafka({
//   clientId: 'consumer-teste',
//   brokers: config.kafkaBrokers
// })

// const consumer = kafka.consumer({ groupId: 'your-consumer-group' });

 
// const run = async () => {
//   // Consuming
//   await consumer.connect()
//   await consumer.subscribe({ topic: config.kafkaTopic, fromBeginning: true })
 
//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       console.log({
//         group,
//         partition,
//         offset: message.offset,
//         value: message.value.toString(),
//       })
//     },
//   })
// }
 
// run().catch(console.error)   