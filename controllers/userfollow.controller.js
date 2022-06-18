const User = require('../models/UserModel');

const follow = async (req, res) => {
    try {
        let userId = req.params.id
        let id = req.user.data._id
        const userData1 = await User.findById(id)
        let following = []
        userData1.following.forEach((ele) => {
            following.push(ele)
        })

        following.push(userId)
        const firstuser = await User.findByIdAndUpdate(id, { following: following })

        const userData2 = await User.findById(userId)
        let followers = []
        userData2.followers.forEach((ele) => {
            followers.push(ele)
        })

        followers.push(id)
        const seconduser = await User.findByIdAndUpdate(userId, { followers: followers })

        res.json({ success: true })
    } catch (error) {
        res.json({ success: false })
    }
}

const unfollow = async (req, res) => {
    try {
        const userId = req.params.id
        const id = req.user.data._id

        const userData1 = await User.findById(id)
        const following = userData1.following
        const ind1 = following.indexOf(userId)
        var removed1 = following.splice(ind1);

        const firstuser = await User.findByIdAndUpdate(id, { following: following })

        const userData2 = await User.findById(userId)
        const followers = userData2.followers
        const ind2 = followers.indexOf(id)
        var removed2 = followers.splice(ind2);

        const seconduser = await User.findByIdAndUpdate(userId, { followers: followers })

        res.json({ success: true })
    } catch (error) {
        res.json({ success: false })
    }
}

module.exports = {
    follow, unfollow
}