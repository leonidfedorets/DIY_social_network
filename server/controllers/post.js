const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.createPost = async (req, res) => {
  try {
    const { username, title, description, instructions, category, difficulty, tags } = req.body;
    const image = req.file ? req.file.filename : null;
    const video = req.body.video || null;

    const newPost = new Post({
      username,
      title,
      description,
      instructions,
      image,
      video,
      category: category || 'other',
      difficulty: difficulty || 'beginner',
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { category, sort, search } = req.query;
    let query = {};
    if (category && category !== 'all') query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    let sortOpt = { createdAt: -1 };
    if (sort === 'rating') sortOpt = { avgRating: -1, createdAt: -1 };
    if (sort === 'popular') sortOpt = { viewCount: -1, createdAt: -1 };

    const posts = await Post.find(query).sort(sortOpt);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.reactToPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const { reaction } = req.body;
    const validReactions = ['like', 'love', 'laugh', 'angry'];
    if (!validReactions.includes(reaction)) return res.status(400).json({ message: 'Invalid reaction' });

    if (!post.reactions.includes(reaction)) {
      post.reactions.push(reaction);
      await post.save();
    }

    res.status(200).json({ message: 'Reaction added', reactions: post.reactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.ratePost = async (req, res) => {
  try {
    const { score } = req.body;
    const userId = req.userId;

    if (score === undefined || score < 0 || score > 100) {
      return res.status(400).json({ message: 'Score must be between 0 and 100' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const existingIdx = post.ratings.findIndex(r => r.userId === userId);
    if (existingIdx >= 0) {
      post.ratings[existingIdx].score = score;
    } else {
      post.ratings.push({ userId, score });
    }

    await post.save();
    res.status(200).json({ avgRating: post.avgRating, totalRatings: post.ratings.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content, username } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ message: 'Comment cannot be empty' });

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = new Comment({
      postId: req.params.postId,
      username: username || 'Anonymous',
      content: content.trim(),
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.title = req.body.title || post.title;
    post.description = req.body.description || post.description;
    post.instructions = req.body.instructions || post.instructions;
    post.category = req.body.category || post.category;
    post.difficulty = req.body.difficulty || post.difficulty;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    await Comment.deleteMany({ postId: req.params.postId });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllPostsAdmin = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).select('title username category avgRating viewCount createdAt');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
