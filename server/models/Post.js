const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  username: { type: String, required: true }, // New field for username
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructions: { type: String, required: true },
  image: { type: String },
  video: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
