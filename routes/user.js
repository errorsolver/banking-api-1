const express = require('express')

const controller = require('../controller/c_index')

const usersRoutes = express.Router()

usersRoutes.get('/signup', (req, res) => {res.render('pages/signup/signup')})
usersRoutes.post('/signup', controller.usersController.signup_post)

usersRoutes.get('/login', (req, res) => {res.render('pages/login/login')})
usersRoutes.post('/login', controller.usersController.login_post)

module.exports = usersRoutes