const express = require('express');
const {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const { getComments, addComment } = require('../controllers/commentController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, getPosts);
router.get('/:slug', getPostBySlug);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

// Comments are nested under a post by its Mongo ID
router.get('/:postId/comments', getComments);
router.post('/:postId/comments', protect, addComment);

module.exports = router;
