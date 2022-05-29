const router = require('express').Router()
const passport = require('passport')
// const { updateUser } = require('../controllers/user.controller')

// router.post('/update/:id', updateUser)

router.get('/login/facebook', passport.authenticate('facebook', { scope: 'email' }))
router.get('/callback/facebook', passport.authenticate('facebook', {
	successRedirect: '/',
	failureRedirect: '/api/user/failed/facebook'
}))

router.get('/login/google', passport.authenticate('google', { scope: 'email' }))
router.get('/callback/google', passport.authenticate('google', {
	successRedirect: '/',
	failureRedirect: '/api/user/failed/google'
}))

router.get('/failed/facebook', (req, res) => res.json({ error: 'Failed to authenticate' }))
router.get('/failed/google', (req, res) => res.json({ error: 'Failed to authenticate' }))

module.exports = router