const jwt = require('jsonwebtoken')

passcode = process.env.PASSCODE

const userAuth = (req, res,  next) => {
    const token = req.cookies._jwt

    if(token) {
        jwt.verify(token, passcode, (err, decodedToken) => {
            if(err) {
                // console.log(err)
                res.redirect('/user/login')
            } else {
                // console.log(decodedToken)
                next()
            }
        })
    } else {
        res.redirect('/user/login')
    }
}

module.exports = userAuth