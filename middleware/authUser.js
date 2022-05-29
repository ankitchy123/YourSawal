const jwt = require('jsonwebtoken')

const authUser = (req, res, next) => {
    const token = req.cookies.token;
    try {
        if (!token) {
            return res.redirect('/')
            // return res.status(400).json({ msg: 'Invalid Authentication' })
        }

        jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
            if (err) {
                return res.redirect('/')
                // return res.status(400).json({ msg: 'Invalid Authentication' })
            }
            req.user = user
            next()
        })
    } catch (error) {
        res.clearCookie("token")
        return res.redirect('/')
    }
}

module.exports = authUser