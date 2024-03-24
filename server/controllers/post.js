const Post = require('../models/Post');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { username, title, description, instructions } = req.body;
    const image = req.file ? req.file.filename : null;
    const video = req.body.video ? req.body.video : null;

    const newPost = new Post({
      username,
      title,
      description,
      instructions,
      image,
      video,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
