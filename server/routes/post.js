const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createPost, getPosts, reactToPost } = require('../controllers/post');

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination folder for uploads
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Define the file name
    cb(null, file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  // Check file types
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'video/mp4') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, or MP4 files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
  },
  fileFilter: fileFilter,
});

// Define the POST route for creating a new post
router.post('/', upload.single('file'), createPost);

// Define the GET route for retrieving all posts
router.get('/', getPosts);

// Define the POST route for reacting to a post
router.post('/:postId/react', reactToPost);

module.exports = router;
