require("dotenv").config();
const express = require("express");
const amqp = require("amqplib/callback_api");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Notification service running!");
});

amqp.connect("amqp://administrator:administrator@rabbitmq:5672", (err0, conn) => {
  if (err0) {
    console.log(err0);
    throw err0;
  }
  console.log("Connected to RabbitMQ");

  const queue = "follow_notifications";
  conn.createChannel((err1, channel) => {
    if (err1) {
      console.log(err1);
      throw err1;
    }

    const queue = "follow_notifications";
    channel.assertQueue(queue, { durable: false });

    console.log("Waiting form message in %s", queue);

    channel.consume(
      queue,
      (msg) => {
        const content = JSON.parse(msg.content.toString());
        console.log("Notification Service received:", content);
      },
      {
        noAck: true,
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
