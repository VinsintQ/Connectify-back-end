const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const disLikeSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const ReplySchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  like: [likeSchema],
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  like: [likeSchema],
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [ReplySchema],
});

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  like: [likeSchema],
  disLike: [disLikeSchema],
  comments: [commentSchema],
  image: {
    type: String,
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
