const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users'
	},			// Author id
	body: String,			// Content of post
	ref: String,			// Id of reference post if any
	group: String,			// Group in which posted
	is_sponsored: Boolean,	// Post is sponsored or not, For admin use
	external_link: String,	// External link
	type: String,			// Type of the post poll, que, ans or normal
	options: [String],		// List of options, When post type is `poll`
	submissions: Map,		// Map of user and his response
	likes: [String],		// List of user that liked this post
	comment: [String],
	last_update: {			// Date post last updated
		type: Date,
		default: Date.now,
	},
	created_on: {			// Date post created
		type: Date,
		default: Date.now
	},
})
module.exports = mongoose.model('Post', postSchema)