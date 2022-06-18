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
        type: Date,
        default: ''
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
        type: String,
        default: 'None'
    },
    workExperience: {
        type: String,
        default: 'None'
    },
    interests: {
        type: [String]
    },
    socialNetworks: {
        facebook: {
            type: String,
            default: ''
        },
        instagram: {
            type: String,
            default: ''
        },
        linkedin: {
            type: String,
            default: ''
        },
        youtube: {
            type: String,
            default: ''
        }
    },
    country: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    followers: {
        type: [String],
        ref: 'users'
    },
    following: {
        type: [String],
        ref: 'users'
    },
    about: {
        type: String,
        default: ''
    },				// User's bio
    joined: {
        type: Date,
        default: Date.now
    },
    hobbies: {
        type: String,
        default: 'None'
    },
    password:
    {
        type: String,
        required: [true, "Please enter your password"]
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;