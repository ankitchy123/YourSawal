const express = require('express');
const User = require('../models/UserModel');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const sendEmail = require('../controllers/sendMail');
const authUser = require('../middleware/authUser');
const { login, getUser, forgotPassword, resetPassword, reset } = require('../controllers/user.controller');

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_SECRET, { expiresIn: '5m' })
}

// ROUTE 1: Create a user using : POST "/api/auth/createuser"
router.post('/createuser', async (req, res) => {
    try {
        // Check whether the user with this email exists already
        let success = false
        const { fname, lname, email, password } = req.body

        let user = await User.findOne({ email });
        if (user) {
            req.flash("error", "Please enter a unique email")
            return res.redirect('/register')
        }

        if (password.length < 5) {
            req.flash("error", "Password must be atleast 5 characters")
            return res.redirect('/register')
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);

        // Create a new user
        user = ({
            firstname: fname,
            lastname: lname,
            email: email,
            password: secPass
        })

        const activation_token = createActivationToken(user)
        const url = `${process.env.CLIENT_URL}/api/auth/user/activate/${activation_token}`
        sendEmail(email, url, "Just click the button below to validate your email address.", "Verify email")
        success = true;
        req.flash("success", "Register Success! Please verify your email to start.")
        res.redirect('/register')
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

// ROUTE 2: Verify email address using: POST "/api/auth/verification"
router.get('/user/activate/:token', async (req, res) => {
    try {
        let success = false;
        const activation_token = req.params.token
        const user = jwt.verify(activation_token, process.env.ACTIVATION_SECRET)
        const { firstname, lastname, email, password } = user

        // Create and save user
        const newUser = User.create({
            firstname, lastname, email, password
        })
        success = true

        req.flash("success", "Account has been activated! Please login.")
        return res.redirect('/')
    } catch (error) {
        res.status(500).send("Internal server error")
    }
})

// ROUTE 3: Authenticate a user using: POST "/api/auth/login"
router.post('/login', login)

// Update User Details
router.patch('/update', authUser, async (req, res) => {
    try {
        const userId = req.user.data._id;
        const { firstname, lastname, email, gender, occupation, interests, country, about, location, education, workExperience, socialNetworks, hobbies } = req.body
        const dob = req.body.dob

        let user = await User.findOneAndUpdate({ _id: userId }, {
            firstname, lastname, email,
            gender, occupation, interests,
            dob, country, about, education, workExperience, location, socialNetworks, hobbies
        })

        req.flash('success', 'Details updated')
        return res.json({ success: true })
    } catch (error) {
        req.flash('error', 'Something went wrong')
        return res.json({ success: false })
    }
})

// Log Out
router.get('/logout', async (req, res) => {
    try {
        res.clearCookie("token")
        req.flash("success", "Logged out successfully.")

        return res.json({ success: true })
    } catch (error) {
        return res.json({ success: false })
    }
})

// Fetch Logged in User Details
router.post('/getuser', authUser, getUser)

// Fetch User by ID
router.get('/getuser/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).select("-password");
        res.status(200).json(user)
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

router.get('/getuser/name/:name', async (req, res) => {
    try {
        const { name } = req.params
        var str = name.split(" ");

        if (str[1] == null) {
            // const user = await User.find({ firstname: str[0] }).select("-password");
            const user = await User.find({ firstname: { $regex: '.*' + str[0] + '.*' } }).select("-password");
            res.status(200).json(user)
        }
        else {
            const user = await User.find({ firstname: { $regex: '.*' + str[0] + '.*' }, lastname: { $regex: '.*' + str[1] + '.*' } }).select("-password");
            res.status(200).json(user)
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

router.post('/forgotpassword', forgotPassword)

router.get('/user/reset/:token', resetPassword)

router.post('/reset', reset)

module.exports = router;