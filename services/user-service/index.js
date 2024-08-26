require("dotenv").config();
const express = require("express");
const amqp = require("amqplib/callback_api");
const redis = require("redis");

const PORT = process.env.PORT || 4000;
const RABBIT_URL = process.env.RABBITMQ_URL || "";
const REDIS_HOST = process.env.REDIS_HOST || "";

const app = express();
const redisClient = redis.createClient({ host: REDIS_HOST });

redisClient.on("error", (err) => console.error("Redis error:", err));

app.use(express.json());
let users = [];

app.get("/", (req, res) => {
  res.send("User service running!");
});

app.post("/users", (req, res) => {
  const { id, name, email } = req.body;
  if (!id || !name) {
    return res.status(400).send({ error: "Missing required fields" });
  }
  const user = { id, name, email };
  users.push(user);
  res.status(201).json({ message: "User created successfully" });
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  redisClient.get(id, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (data) {
      return res.send(JSON.parse(data));
    } else {
      const user = users.find((user) => user.id === parseInt(id));

      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      redisClient.setex(id, 3600, JSON.stringify(user));
      res.send(user);
    }
  });
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  user.name = name;

  res.send(user);
});

app.post("/follow", (req, res) => {
  const { followerId, followeeId } = req.body;
  const follower = users.find((user) => user.id === followerId);
  const followee = users.find((user) => user.id === followeeId);

  if (!follower || !followee) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  amqp.connect(RABBIT_URL, (error0, conn) => {
    if (error0) {
      console.log(error0);
      throw error0;
    }

    console.log("Connected to RabbitMQ");
    conn.createChannel((error1, channel) => {
      if (error1) {
        console.log(error1);
        throw error1;
      }
      const queue = "follow_notifications";
      const message = JSON.stringify({ followerId, followeeId });
      channel.assertQueue(queue, { durable: false });
      channel.sendToQueue(queue, Buffer.from(message));
      console.log(`Sent message: ${message} to queue ${queue}`);
    });
  });

  res.status(201).json({ message: `User ${followerId} is now following user ${followeeId}` });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
