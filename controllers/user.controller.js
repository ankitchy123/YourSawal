const jwt = require('jsonwebtoken')
// const updateUser = async (req, res) => {
// 	const { id: user_id } = req.params
// 	const uid = req.user.uid

// 	const {
// 		name,
// 		about,
// 		occupation,
// 		country,
// 		gander,
// 		birthday,
// 		hobbies,
// 		interests,
// 		experience,
// 		education,
// 		avatar,
// 		banner
// 	} = req.body

// 	try {
// 		if (user_id === uid) {
// 			const user = await User.findById(user_id)
// 			await User.updateOne(
// 				{ _id: user_id },
// 				{
// 					name: (name || user.name),
// 					about: (about || user.about),
// 					occupation: (occupation || user.occupation),
// 					country: (country || user.country),
// 					gander: (gander || user.gander),
// 					birthday: (birthday || user.birthday),
// 					hobbies: (hobbies || user.hobbies),
// 					interests: (interests || user.interests),
// 					experience: (experience || user.experience),
// 					education: (education || user.education),
// 					avatar: (avatar || user.avatar),
// 					banner: (banner || user.banner)
// 				}
// 			)
// 			res.json({
// 				error: "User info has been updated."
// 			})
// 		}
// 	} catch (error) {
// 		res.json({
// 			error: "Something went wrong."
// 		})
// 	}
// }

// Authenticate user before using protected api routes 
const authenticate = (req, res, next) => {
	// Get saved token from requst cookies
	const token = req.cookies.token
	if (token) {
		// Get payload from jsonwebtoken
		const payload = jwt.verify(token, process.env.SECRET)
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