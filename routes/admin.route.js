const router = require('express').Router()
const { authenticate } = require('../controllers/user.controller')
const {
	loginAdmin,
	getUsers,
	isAdmin,
	getPosts,
	getGroups,
	getUserById,
	getPostById,
	getGroupById,
	getStats,
	updateUser,
	updatePost,
	updateGroup,
	deleteUser,
	deletePost,
	deleteGroup
} = require('../controllers/admin.controller')

router.post('/login', loginAdmin)

router.get('/get/stats', authenticate, isAdmin, getStats)

router.get('/get/users', authenticate, isAdmin, getUsers)
router.get('/get/posts', authenticate, isAdmin, getPosts)
router.get('/get/groups', authenticate, isAdmin, getGroups)

router.get('/get/users/:id', authenticate, isAdmin, getUserById)
router.get('/get/posts/:id', authenticate, isAdmin, getPostById)
router.get('/get/groups/:id', authenticate, isAdmin, getGroupById)

router.post('/set/users/:id', authenticate, isAdmin, updateUser)
router.post('/set/posts/:id', authenticate, isAdmin, updatePost)
router.post('/set/groups/:id', authenticate, isAdmin, updateGroup)

router.post('/delete/users/:id', authenticate, isAdmin, deleteUser)
router.post('/delete/posts/:id', authenticate, isAdmin, deletePost)
router.post('/delete/groups/:id', authenticate, isAdmin, deleteGroup)

module.exports = router