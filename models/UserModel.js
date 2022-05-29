const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstname:
    {
        type: String,
        required: [true, "Please enter first name"],
        trim: true
    },
    lastname:
    {
        type: String,
        required: [true, "Please enter last name"],
        trim: true
    },
    email:
    {
        type: String,
        required: [true, "Please enter email address"],
        unique: true,
        trim: true
    },
    dob:
    {
        type: Date
    },
    gender: {
        type: String,
        default: 'Male'
    },
    occupation: {
        type: String,
        default: 'None'
    },
    education: {
        course: {
            type: String,
        },
        institutionname: {
            type: String
        },
        location: {
            type: String
        }
    },
    employement: {
        company: {
            type: String,
        },
        role: {
            type: String
        },
        experience: {
            type: Number
        }
    },
    interests: {
        type: [String]
    },
    socialNetworks: {
        facebook: {
            type: String
        },
        instagram: {
            type: String
        },
        linkedin: {
            type: String
        },
        youtube: {
            type: String
        },
        pinterest: {
            type: String
        }
    },
    country: String,			// User's country
    about: String,				// User's bio
    joined: {					// Date user joined
        type: Date,
        default: Date.now
    },
    hobbies: String,			// User's hobbies, comma seprated
    password:
    {
        type: String,
        required: [true, "Please enter your password"]
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;