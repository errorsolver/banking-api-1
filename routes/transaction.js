const express = require('express')

const controller = require('../controller/c_index')
const userAuth = require('../middleware/userAuth')

const transferRoutes = express.Router()

transferRoutes.get('/send', userAuth, (req, res) => {res.render('pages/transaction/send')})
transferRoutes.post('/send', userAuth, controller.transferController.transfer_post)

module.exports = transferRoutes