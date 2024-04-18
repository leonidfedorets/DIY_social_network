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

// React to a post
exports.reactToPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { reaction } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the reaction is valid
    const validReactions = ['like', 'love', 'laugh', 'angry'];
    if (!validReactions.includes(reaction)) {
      return res.status(400).json({ message: 'Invalid reaction' });
    }

    // Add the reaction to the post if not already present
    if (!post.reactions.includes(reaction)) {
      post.reactions.push(reaction);
      await post.save();
    }

    res.status(200).json({ message: 'Reaction added successfully', reactions: post.reactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
