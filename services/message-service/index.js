require("dotenv").config();
const express = require("express");
const amqp = require("amqplib/callback_api");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Message service running!");
});

amqp.connect("amqp://administrator:administrator@rabbitmq:5672", function (error0, connection) {
  if (error0) {
    console.error("Error connecting to RabbitMQ:", error0.message);
    return setTimeout(() => process.exit(1), 1000);
  }

  connection.createChannel(function (error1, channel) {
    if (error1) {
      console.error("Error creating channel:", error1.message);
      return;
    }

    const queue = "follow_notifications";

    channel.assertQueue(queue, { durable: false });

    channel.consume(
      queue,
      function (msg) {
        const content = JSON.parse(msg.content.toString());
        console.log("Received message:", content);
      },
      { noAck: true }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
