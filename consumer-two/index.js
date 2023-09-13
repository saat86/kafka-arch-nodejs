const { Kafka } = require('kafkajs');
const config = require('./config');

const kafka = new Kafka({
  clientId: 'consumer',
  brokers: config.kafkaBrokers,
});

const consumer = kafka.consumer({ groupId: `${config.kafkaTopic}-group-one` });


const run = async () => {
  

    await consumer.connect();

    
    await consumer.subscribe({ topic: config.kafkaTopic, fromBeginning: true });

    
    await consumer.run({
        
    
      eachMessage: async ({ topic, partition, message }) => {
        
        console.log(` Partition: ${partition}, Offset: ${message.offset}, Value: ${message.value.toString()}`);
        
      },
      
    });

};


run().catch(console.error);
// 