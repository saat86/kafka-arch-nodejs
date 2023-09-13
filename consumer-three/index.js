const { Kafka } = require('kafkajs');
const config = require('./config');
const fs =require('fs');


const kafka = new Kafka({
    clientId: 'consumer',
    brokers: config.kafkaBrokers,
});

const consumer = kafka.consumer({ groupId: `${config.kafkaTopic}-group-three` });


const run = async () => {


    await consumer.connect();


    await consumer.subscribe({ topic: config.kafkaTopic, fromBeginning: true });


    await consumer.run({


        eachMessage: async ({ topic, partition, message }) => {

            const data = {
                partition,
                offset: message.offset,
                value: message.value.toString(),
            }

            fs.writeFile('data.json',JSON.stringify(data),(err)=>{
                if(err) throw err;
                console.log('json saved succesfully :)');
              })

        },

    });

};


run().catch(console.error);