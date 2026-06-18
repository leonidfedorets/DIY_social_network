const express = require('express');
const router = express.Router();
const {
  createPost, getPosts, getPost, reactToPost, ratePost,
  getComments, addComment, deleteComment,
  updatePost, deletePost, getAllPostsAdmin
} = require('../controllers/post');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
  cb(null, allowed.includes(file.mimetype));
};

const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 10 }, fileFilter });

router.get('/', getPosts);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllPostsAdmin);
router.get('/:postId', getPost);
router.post('/', authMiddleware, upload.single('file'), createPost);
router.put('/:postId', authMiddleware, upload.single('file'), updatePost);
router.delete('/:postId', authMiddleware, adminMiddleware, deletePost);
router.post('/:postId/react', authMiddleware, reactToPost);
router.post('/:postId/rate', authMiddleware, ratePost);
router.get('/:postId/comments', getComments);
router.post('/:postId/comments', authMiddleware, addComment);
router.delete('/:postId/comments/:commentId', authMiddleware, deleteComment);

module.exports = router;
