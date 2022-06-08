const router = require('express').Router()
const { createPost, updatePost, deletePost, getUserPosts, likePost, getLikes, votePoll, getPosts } = require('../controllers/post.controller')
const { authenticate, authorize } = require('../controllers/user.controller')

router.post('/create', authenticate, createPost)
router.get('/getposts', authenticate, getPosts)
router.post('/update/:id', authenticate, updatePost)
router.post('/delete/:id', authenticate, deletePost)
router.post('/like/:id', authenticate, likePost)
router.post('/vote/:id/:option', authenticate, votePoll)
router.get('/like/:id', authorize, getLikes)
router.get('/user/:id', authorize, getUserPosts)

module.exports = router