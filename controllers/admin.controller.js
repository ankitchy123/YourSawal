const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user.model')
const Post = require('../models/post.model')
const Group = require('../models/group.model')

const loginAdmin = async (req, res) => {
	const { email, password } = req.body
	if (!email || !password) {
		return res.json({
			error: "Required fields can not be empty."
		})
	}

	try {
		const user = await User.findOne({ email }, { __v: 0 })
		if (user) {
			if (user.is_admin) {
				if (await bcrypt.compare(password, user.password)) {
					const token = jwt.sign({
						email: user.email,
						uid: user._id
					}, process.env.SECRET)
					res.cookie('token', token, { httpOnly: true });
					res.json({
						message: "Logged in successfully.",
						token
					})
				} else {
					res.json({
						error: "Invalid username or password."
					})
				}
			} else {
				res.json({
					error: "You are not an admin"
				})
			}
		} else {
			res.json({
				error: "Invalid username or password."
			})
		}
	} catch (error) {
		res.json({
			error: "Something went wrong."
		})
	}
}

const getUsers = async (req, res) => {
	const { page } = req.query
	const USER_PER_PAGE = 10
	const offset = ((Math.max(page, 1) - 1) * USER_PER_PAGE)

	try {
		const totalUsers = await User.find({}, { __v: 0 }).count()
		const users = await User.find({}).skip(offset).limit(USER_PER_PAGE)
		for (const user of users) {
			delete user._doc.password
		}
		res.json({
			total_page: Math.ceil(totalUsers / USER_PER_PAGE),
			total_items: totalUsers,
			current: `${offset + 1}-${offset + users.length}`,
			users
		})
	} catch (error) {
		res.json({
			error: "Something went wrong."
		})
	}
}

const getPosts = async (req, res) => {
	const page = Number(req.query.page) || 1
	const POST_PER_PAGE = 10
	const offset = ((Math.max(page, 1) - 1) * POST_PER_PAGE)

	try {
		const totalPosts = await Post.find({}, { __v: 0 }).count()
		const posts = await Post.find({}).skip(offset).limit(POST_PER_PAGE)
		res.json({
			total_page: Math.ceil(totalPosts / POST_PER_PAGE),
			total_items: totalPosts,
			current: `${offset + 1}-${offset + posts.length}`,
			posts
		})
	} catch (error) {
		res.json({
			error: "Something went wrong."
		})
	}
}

const getGroups = async (req, res) => {
	const page = Number(req.query.page) || 1
	const GROUP_PER_PAGE = 10
	const offset = ((Math.max(page, 1) - 1) * GROUP_PER_PAGE)
	try {
		const totalGroups = await Group.find({}, { __v: 0 }).count()
		const groups = await Group.find({}).skip(offset).limit(GROUP_PER_PAGE)
		res.json({
			total_page: Math.ceil(totalGroups / GROUP_PER_PAGE),
			total_items: totalGroups,
			current: `${offset + 1}-${offset + groups.length}`,
			groups
		})
	} catch (error) {
		res.json({
			error: "Something went wrong."
		})
	}
}

const isAdmin = async (req, res, next) => {
	const uid = req.user.uid
	User.findById(uid, { __v: 0 }, (error, doc) => {
		if (error) {
			return res.json({
				error: "Semething went wrong"
			})
		}
		if (doc.is_admin) {
			next()
		} else {
			res.json({
				error: "Operation not permited."
			})
		}
	})
}

const getUserById = async (req, res) => {
	const { id: user_id } = req.params
	try {
		const user = await User.findById(user_id, { __v: 0 })
		if (user) {
			delete user._doc.password
			res.json(user)
		} else {
			res.json({
				error: "User not found."
			})
		}
	} catch (error) {
		res.json({
			error: "Something went wrong."
		})
	}
}

const getPostById = async (req, res) => {
	const { id: post_id } = req.params
	try {
		const post = await Post.findById(post_id, { __v: 0 })
		post ? res.json(post) : res.json({ error: "Post not found." })
	} catch (error) {
		res.json({
			error: "Something went wrong."
		})
	}
}

const getGroupById = async (req, res) => {
	const { id: groups_id } = req.params
	try {
		const group = await Group.findById(groups_id, { __v: 0 })
		group ? res.json(group) : res.json({ error: "Group not found." })
	} catch (error) {
		res.json({
			error: "Something went wrong."
		})
	}
}

const updateUser = async (req, res) => {
	const { id: user_id } = req.params

	const username = req.body.username
	const gender = req.body.gender
	const hobbies = req.body.hobbies
	const interest = req.body.interest

	try {
		const user = await User.findById(user_id, { __v: 0 })
		if (user) {
			user.username = username || user.username
			user.gender = gender || user.gender
			user.hobbies = hobbies || user.hobbies
			user.interest = interest || user.interest
			await user.save()
			res.json({
				message: "User has been updated."
			})
		} else {
			res.json({
				error: "User not found."
			})
		}
	} catch (error) {
		res.json({
			error: "Something went wrong."
		})
	}
}

const updatePost = async (req, res) => {
	const { id: post_id } = req.params
	const body = req.body.body
	const ref = req.body.ref
	const type = req.body.type
	const is_sponsored = !!req.body.is_sponsored
	const group = req.body.group
	const external_link = req.body.external_link

	try {
		const post = await Post.findById(post_id, { __v: 0 })
		if (post) {
			post.body = body || post.body
			post.ref = ref || post.ref
			post.type = type || post.type
			post.is_sponsored = is_sponsored || post.is_sponsored
			post.group = group || post.group
			post.external_link = external_link || post.external_link
			await post.save()
			res.json({
				message: "Post has been updated."
			})
		} else {
			res.json({
				error: "Post not found."
			})
		}
	} catch (error) {
		res.json({
			error: "Something went wrong."
		})
	}
}

const updateGroup = async (req, res) => {
	const { id: group_id } = req.params
	const group_name = req.body.group_name
	const groups_icon = req.body.groups_icon

	try {
		const group = await Group.findById(group_id, { __v: 0 })
		if (group) {
			group.group_name = group_name || group.group_name
			group.groups_icon = groups_icon || group.groups_icon
			await group.save()
			res.json({
				message: "Group has been updated."
			})
		} else {
			res.json({
				error: "Group not found."
			})
		}
	} catch (error) {
		res.json({
			error: "Something went wrong."
		})
	}
}

const getStats = async (req, res) => {
	try {
		const totalPosts = await Post.find({}, { __v: 0 }).count()
		const totalGroups = await Group.find({}, { __v: 0 }).count()
		const totalUsers = await User.find({}, { __v: 0 }).count()

		res.json({
			total_users: totalUsers,
			total_posts: totalPosts,
			total_groups: totalGroups,
		})
	} catch (error) {
		res.json({
			error: "Something went wrong."
		})
	}
}

const deletePost = async (req, res) => {
	const { id: _id } = req.params
	try {
		await Post.deleteOne({ _id })
		res.json({
			message: "Post has been deleted."
		})
	} catch (error) {
		res.json({
			error: "Something went wrong."
		})
	}
}

const deleteGroup = async (req, res) => {
	const { id: _id } = req.params
	try {
		await Group.deleteOne({ _id })
		res.json({
			message: "Post has been deleted."
		})
	} catch (error) {
		res.json({
			error: "Something went wrong."
		})
	}
}

const deleteUser = async (req, res) => {
	const { id: _id } = req.params
	try {

		const user = await User.findById(_id)
		if (user.is_admin) return res.json({
			error: "Can not delete admin."
		})

		await User.deleteOne({ _id })
		res.json({
			message: "Post has been deleted."
		})
	} catch (error) {
		res.json({
			error: "Something went wrong."
		})
	}
}

module.exports = {
	isAdmin,
	loginAdmin,
	getUsers,
	getPosts,
	getGroups,
	getUserById,
	getGroupById,
	getPostById,
	updateUser,
	updatePost,
	updateGroup,
	deletePost,
	deleteGroup,
	deleteUser,
	getStats,
}