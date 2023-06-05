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

app.use(express.static('public'))
app.use('/css', express.static(__dirname + '/css'))
app.use('/js', express.static(__dirname + '/js'))
app.use('/img', express.static(__dirname + '/img'))

app.use('/user', usersRoutes)
app.use('/transaction', transferRoutes)

app.set('views', './views');
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome'
    })
})

module.exports = app