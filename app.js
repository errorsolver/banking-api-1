const helmet = require('helmet')
const cors = require('cors')
const express = require('express')
const cookieParser = require('cookie-parser')

const usersRoutes = require('./routes/user')
const transferRoutes = require('./routes/transaction')

const app = new express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/user', usersRoutes)
app.use('/transfer', transferRoutes)

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Wellcome'
    })
})

module.exports = app