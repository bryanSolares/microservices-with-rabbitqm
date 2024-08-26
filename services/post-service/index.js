require("dotenv").config();
const express = require("express");
const amqp = require("amqplib/callback_api");
const { Sequelize } = require("sequelize");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL || "";

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const CommentSchema = new mongoose.Schema({
  postId: Number,
  userId: Number,
  content: String,
});

const CommentMongoose = mongoose.model("Comment", CommentSchema);

app.use(express.json());

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: false,
});

const Post = sequelize.define("post", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: Sequelize.STRING,
  content: Sequelize.TEXT,
  userId: Sequelize.INTEGER,
});

const Comment = sequelize.define("Comment", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

sequelize.sync();

app.get("/", (req, res) => {
  res.send("Post service running!");
});

app.post("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const { userId, content } = req.body;

  try {
    const comment = await Comment.create({ postId, userId, content });
    const commentMongoose = new CommentMongoose({ postId, userId, content });
    await commentMongoose.save();
    res.status(201).send(comment);
  } catch (error) {
    res.status(500).send({ error: "Failed to create comment" });
  }
});

app.post("/posts", async (req, res) => {
  const { title, content, userId } = req.body;
  const post = { title, content, userId };
  try {
    await Post.create(post);
    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
