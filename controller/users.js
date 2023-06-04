const jwt = require('jsonwebtoken')

const Users = require("../config/model/users")

const usersController = {}

const errorHandler = async (res, err, customText) => {
    let eMsg, eCode
    try {
        eMsg = err.errors[0].message
    } catch (err) {
        console.log(err);
    }
    try {
        eCode = err.original.code
    } catch (err) {
        console.log(err);
    }

    if (eCode == 23505) {
        eMsg = 'user already exist'
    }

    // "code": "23505",
    // "detail": "username must be unique"

    return res.status(404).json({
        incident: customText,
        code: eCode,
        detail: eMsg,
        error: err
    })
}

function createToken(id) {
    const passcode = process.env.PASSCODE

    const token = jwt.sign({ id }, passcode, { expiresIn: '3d' })
    return token
}

async function login(res, username, password) {
    try {
        const login = await Users.findOne({ where: { username, password } })
        if (login === null) { throw 'user not found' }

        const token = createToken(login.id)
        const age = 3 * 12 * 60 * 60 * 1000

        res.cookie('_jwt', token, {
            httpOnly: true,
            maxAge: age
        })
    } catch (err) {
        console.log('login error: ', err)
    }
}

usersController.signup_post = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await Users.create({
            username: username,
            password: password
        })

        await login(res, username, password)

        res.status(200).json({
            message: 'Success input user & logged in',
            data: user,
            token: req.cookies._jwt
        })
    } catch (err) {
        errorHandler(res, err, 'signup failed')
    }
}

usersController.login_post = async (req, res) => {
    const { username, password } = req.body

    try {
        if (!username) throw 'username required'
        if (!password) throw 'password required'

        await login(res, username, password)

        res.status(200).json({
            message: 'login success',
            detail: token,
            token: req.cookies._jwt
        })
    } catch (err) {
        errorHandler(res, err, 'failed to login')
    }
}

module.exports = usersController