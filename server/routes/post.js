const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPost, reactToPost, updatePost, deletePost } = require('../controllers/post');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'video/mp4') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, or MP4 files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter: fileFilter,
});

router.post('/', authMiddleware, upload.single('file'), createPost); // Ensure authenticated users can create posts
router.get('/', getPosts); // Public route to get posts
router.get('/:postId', getPost); // Public route to get a single post
router.post('/:postId/react', authMiddleware, reactToPost); // Ensure authenticated users can react to posts
router.put('/:postId', authMiddleware, upload.single('file'), updatePost); // Ensure authenticated users can update posts
router.delete('/:postId', authMiddleware, adminMiddleware, deletePost); // Ensure only admins can delete posts

module.exports = router;
