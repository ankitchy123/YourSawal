const { json } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const sendEmail = require('./sendMail');
const bcrypt = require('bcryptjs');

const createAccessToken = (payload) => {
	return jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: '5m' })
}

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		let user = await User.findOne({ email });
		if (!user) {
			req.flash('error', 'Try to login with correct credentials')
			return res.redirect('/')
		}

		const passwordCompare = await bcrypt.compare(password, user.password);
		if (!passwordCompare) {
			req.flash('error', 'Try to login with correct credentials')
			return res.redirect('/')
		}
		const token = jwt.sign({ data: user }, process.env.ACCESS_SECRET, { expiresIn: '24h' })

		res.cookie("token", token, {
			httpOnly: true
		})
		req.flash("success", "Logged in successfully")
		return res.redirect('/usertimeline')
	} catch (error) {
		// res.status(500).json({ msg: error.message });
		req.flash('error', 'Something went wrong')
		return res.redirect('/')
	}
}
const getUser = async (req, res) => {
	try {
		const userId = req.user.data._id;
		const user = await User.findById(userId).select("-password");
		res.status(200).send(user);
	} catch (error) {
		res.status(500).send("Internal server error");
	}
}

const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body
		const user = await User.findOne({ email })
		if (!user) {
			return res.json({ msg: "This email does not exist", success: false })
		}

		const access_token = createAccessToken({ _id: user._id })
		const url = `${process.env.CLIENT_URL}/api/auth/user/reset/${access_token}`

		sendEmail(email, url, "Just click the button below to reset your password.", "Reset Password")

		// req.flash("success", "Please check your mail to reset the password.")
		res.json({ success: true })
	} catch (error) {
		res.json({ success: false })
	}
}

const resetPassword = async (req, res) => {
	try {
		const access_token = req.params.token
		const _id = jwt.verify(access_token, process.env.ACCESS_SECRET)

		const user = await User.findById(_id)

		res.render('reset-password', { user })
	} catch (error) {
		req.flash("error", "Something went wrong")
		res.redirect('/')
	}
}

const reset = async (req, res) => {
	try {
		const { email, password } = req.body

		const salt = await bcrypt.genSalt(10);

		const secPass = await bcrypt.hash(password, salt);

		const user = await User.findOneAndUpdate({ email: email }, { password: secPass })

		req.flash("success", "Password updated, please login using new password")
		res.json({ success: true })
	} catch (error) {
		req.flash("error", "Something went wrong")
		res.redirect('/')
	}
}

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
	login,
	getUser,
	forgotPassword,
	resetPassword,
	reset,
	authenticate,
	authorize,
}