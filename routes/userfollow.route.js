const router = require('express').Router()
const authUser = require('../middleware/authUser');
const { follow, unfollow } = require('../controllers/userfollow.controller')

router.post('/follow/:id', authUser, follow)
router.post('/unfollow/:id', authUser, unfollow)

module.exports = router