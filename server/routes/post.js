const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createPost, getPosts } = require('../controllers/post');
const upload = multer({ dest: 'server/uploads/' });

// Define the POST route for creating a new post
router.post('/', upload.single('image'), createPost);

// Define the GET route for retrieving all posts
router.get('/', getPosts);

module.exports = router;
