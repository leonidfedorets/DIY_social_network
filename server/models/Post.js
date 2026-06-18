const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  score: { type: Number, min: 0, max: 100, required: true },
}, { _id: false });

const postSchema = new mongoose.Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructions: { type: String, required: true },
  image: { type: String },
  video: { type: String },
  category: {
    type: String,
    enum: ['building', 'construction', 'it-dev', 'hobbies', 'home-improvement', 'other'],
    default: 'other',
  },
  tags: [{ type: String }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  reactions: { type: [String], default: [] },
  ratings: { type: [ratingSchema], default: [] },
  avgRating: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

postSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    this.avgRating = Math.round(
      this.ratings.reduce((sum, r) => sum + r.score, 0) / this.ratings.length
    );
  } else {
    this.avgRating = 0;
  }
  next();
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
