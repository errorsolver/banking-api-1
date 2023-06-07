const jwt = require('jsonwebtoken')

const Users = require("../config/model/users")
const { Op } = require('sequelize')

const usersController = {}

const errorHandler = async (res, err, customText) => {
    let eMsg, eCode

    // try {
    //     eMsg = err.errors[0].message
    // } catch (err) {
    //     console.log(err);
    // }
    // try {
    //     eCode = err.original.code
    // } catch (err) {
    //     console.log(err);
    // }

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

const handlerErrors = (err) => {
    let errors = { email: '', password: '' }

    // if(err.message.includes('user validation failed')) {
    //     Object.values(err.errors).forEach( ({properties}) => {
    //         errors[properties.path] = properties.message
    //     })
    // }
    return err
}

function createToken(id) {
    const passcode = process.env.PASSCODE

    const token = jwt.sign({ id }, passcode, { expiresIn: '3d' })
    return token
}

// async function login(username, password) {
//     const login = await Users.findOne({ where: { username, password } })
//     if (login) {
//         return createToken(login.id)
//     }
//     throw 'user not found'
// }

function decodeToken(token) {
    const decodedToken = jwt.decode(token)
    return decodedToken
}

usersController.getAllExcept = async (req, res) => {
    const token = req.cookies._jwt
    const decodedToken = decodeToken(token)
    console.log('decodedToken: ',decodedToken);
    try {
        const users = await Users.findAll({
            where: {
                id: {
                    [Op.ne]: decodedToken.id
                }
            },
            order: [['username', 'ASC']]
        })

        compactData = []
        users.forEach( u => {
            const userData = {
                id: u.dataValues.id,
                username: u.dataValues.username,
            }
            compactData.push(userData)
        })
        // const jsonString = JSON.stringify(compactData)

        res.status(200).json({
            message: 'Success get users',
            users: compactData,
            // users: jsonString
        })
    } catch (err) {
        console.log('err: ',err);
        const errors = handlerErrors(err)
        res.status(400).json({
            errors
        })
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

        // const token = await login(username, password)
        const login = await Users.findOne({ where: { username, password } })
        if (login) {
            const token = createToken(login.id)
            
            const age = 3 * 12 * 60 * 60 * 1000
            await res.cookie('_jwt', token, {
                httpOnly: true,
                maxAge: age
            })
        }

        res.status(200).json({
            message: 'login success',
            user: login.id
        })
    } catch (err) {
        // errorHandler(res, err, 'failed to login')
        // const errors = handlerErrors(err)
        res.status(400).json({
            "message": "fail",
            "errors": err
        })
    }
}

module.exports = usersController