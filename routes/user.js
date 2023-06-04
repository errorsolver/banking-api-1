const express = require('express')

const controller = require('../controller/c_index')

const usersRoutes = express.Router()

usersRoutes.post('/signup', controller.usersController.signup_post)
usersRoutes.post('/login', controller.usersController.login_post)

module.exports = usersRoutes