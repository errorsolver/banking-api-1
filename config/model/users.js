const { DataTypes } = require('sequelize')
const sq = require('../database/db')

const Users = sq.define('users', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    balance: {
        type: DataTypes.BIGINT,
        unsigned: false,
        defaultValue: 5000
    }
}, {
    freezeTableName: true
})

Users.sync({ alter: true })
    .then(()=>{console.log('user table sync')})

module.exports = Users