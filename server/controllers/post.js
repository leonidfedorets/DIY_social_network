// controllers/postController.js
const Post = require('../models/Post');

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

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.reactToPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { reaction } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const validReactions = ['like', 'love', 'laugh', 'angry'];
    if (!validReactions.includes(reaction)) {
      return res.status(400).json({ message: 'Invalid reaction' });
    }

    if (!post.reactions.includes(reaction)) {
      post.reactions.push(reaction);
      await post.save();
    }

    res.status(200).json({ message: 'Reaction added successfully', reactions: post.reactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.title = req.body.title || post.title;
    post.description = req.body.description || post.description;
    post.instructions = req.body.instructions || post.instructions;
    post.image = req.body.image || post.image;
    post.video = req.body.video || post.video;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// exports.deletePost = async (req, res) => {
//   try {
//     const postId = req.params.postId;
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     await post.remove();
//     res.json({ message: 'Post deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting post:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// Delete a post by ID
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};