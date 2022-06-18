// const connectToMongo = require('./db');
const express = require('express');
const app = express()
var cors = require('cors')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');
const authUser = require('./middleware/authUser');
const cookieparser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
require('dotenv').config();
// const mongoose = require('mongoose')
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy
const User = require('./models/UserModel');

// Routes
const userRoute = require('./routes/user.route')
const groupRoute = require('./routes/group.route')
const postRoute = require('./routes/post.route');
const { Cookie } = require('express-session');

// const PORT = process.env.PORT
const DB_URI = process.env.DB_URI
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(require("express-session")({
	secret: "The milk would do that",
	resave: false,
	saveUninitialized: false
}));

app.use(session({
	secret: process.env.SECRET
}))

app.use(flash());
app.use(function (req, res, next) {
	res.locals.message = req.flash();
	next();
});

// Middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))

const connectToMongo = () => {
	mongoose.connect(DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	console.log("Connected");
}
// connect with database
connectToMongo();

app.use(passport.initialize())
app.use(passport.session())

passport.use(new GoogleStrategy(
	{
		clientID: process.env.GGL_CLIENT_ID,
		clientSecret: process.env.GGL_CLIENT_SECRET,
		callbackURL: '/api/user/callback/google',
		passReqToCallback: true,
		profileFields: ['id', 'displayName', 'gender', 'email', 'picture.type(large)']
	},
	async (request, token, refreshToken, profile, done) => {
		const { email, picture: avatar } = profile
		try {
			const user = await User.findOne({ email })
			if (user) {
				done(null, user)
			} else {
				const newUser = new User({
					email,
					avatar
				})
				await newUser.save()
				done(null, newUser)
			}
		} catch (error) {
			done(error)
		}
	}
))

passport.use(new FacebookStrategy(
	{
		clientID: process.env.FB_CLIENT_ID,
		clientSecret: process.env.FB_CLIENT_SECRET,
		callbackURL: '/api/user/callback/facebook',
		profileFields: ['id', 'displayName', 'gender', 'email', 'picture.type(large)']
	},
	async (token, refreshToken, profile, done) => {
		try {
			const email = profile.emails[0].value
			const user = await User.findOne({ email })
			if (user) {
				done(null, user)
			} else {
				const newUser = new User({
					name: profile.displayName,
					email: email,
					gender: profile.gender,
					birthday: profile.birthday,
					avatar: profile.photos[0].value
				})
				await newUser.save()
				done(null, user)
			}
		} catch (error) {
			done(error)
		}
	}
))

passport.serializeUser((user, done) => {
	done(null, user)
})

passport.deserializeUser((user, done) => {
	done(null, { ...user, uid: user._id })
})

app.use('/api/user', userRoute)
app.use('/api/group', groupRoute)
app.use('/api/post', postRoute)

app.get('/grouphome', (req, res) => {
	console.log(req.user)
	res.render("user-groups")
})

app.get('/grouptimeline', (req, res) => {
	console.log(req.user)
	res.render("groups-timeline")
})

app.get('/groupfollowers', (req, res) => {
	console.log(req.user)
	res.render("group-followers")
})

app.get('/userfollowers', (req, res) => {
	console.log(req.user)
	res.render("user-followers")
})

app.get('/usertimeline', authUser, (req, res) => {
	if (req.user) {
		return res.render('user-timeline',
			{
				user: req.user.data
			}
		)
	}
	req.flash("success", "Please login")
	return res.redirect('/')
})

app.get('/viewprofile', authUser, (req, res) => {
	if (req.user) {
		return res.render('view-profile',
			{ user: req.user.data }
		)
	}
	req.flash("success", "Please login")
	return res.redirect('/')
})

app.get('/user/:id', authUser, async (req, res) => {
	if (req.user) {
		res.render('user-profile')
	}
	else {
		req.flash("error", "Please login")
		res.redirect('/')
	}
})

app.get('/', (req, res) => {
	// if (req.user) {
	// 	return res.redirect('/usertimeline')
	// }

	res.render('login')
})

app.get('/forgotpassword', (req, res) => {
	res.render('forgot-password')
})
// app.get('/resetpassword', (req, res) => {
// 	res.render('reset-password')
// })

app.get('/register', (req, res) => {
	res.render('register')
})

app.get('/users', authUser, (req, res) => {
	if (req.user) {
		return res.render('userSearch',
			{ user: req.user.data }
		)
	}
	req.flash("error", "Please login")
	res.redirect('/')
})

app.get('/dashboard', authUser, (req, res) => {
	if (req.user) {
		return res.render('dashboard')
	}
	req.flash("success", "Please login")
	return res.redirect('/')
})


app.get('/editprofile', authUser, (req, res) => {
	if (req.user) {
		return res.render('edit-profile', {
			user: req.user.data
		})
	}
	req.flash("success", "Please login")
	return res.redirect('/')
})

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/userfollow.route'));

app.listen(port, () => {
	console.log(`App is listening on port http://localhost:${port}`);
})