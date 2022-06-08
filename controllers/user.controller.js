const jwt = require('jsonwebtoken')

// Authenticate user before using protected api routes 
const authenticate = (req, res, next) => {
	// Get saved token from requst cookies
	const token = req.cookies.token
	if (token) {
		// Get payload from jsonwebtoken
		const payload = jwt.verify(token, process.env.ACCESS_SECRET)
		if (payload) {
			req.user = payload
			next()
		} else {
			res.json({
				error: "Authantication failed",
				login: false
			})
		}
	} else {
		res.json({
			error: "Authantication failed",
			login: false
		})
	}
}

// Authorize user if exist
const authorize = (req, res, next) => {
	// Get token from request cookies
	const token = req.cookies.token
	if (token) {
		// Get payload if user exist
		const payload = jwt.verify(token, process.env.SECRET)
		if (payload) {
			req.user = payload
		}
	}
	next()
}

module.exports = {
	authenticate,
	authorize,
}