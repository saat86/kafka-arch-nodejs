const { Kafka, Partitioners } = require('kafkajs');
const config = require('./config');
const data = require('../pupeteer/data.json');

const kafka = new Kafka({
  clientId: 'producer-teste',
  brokers: config.kafkaBrokers,
});

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

const run = async () => {
  // Producing
  await producer.connect();

  await producer.send({
    topic: config.kafkaTopic,
    messages: [
      { key: 'your-key', value: JSON.stringify(data), partition: 0 },
    ],
  });

  // Disconnect the producer when done
  await producer.disconnect();
};

run().catch(console.error);
