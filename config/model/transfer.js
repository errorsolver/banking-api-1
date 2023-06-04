const { DataTypes } = require('sequelize')

const sq = require('../database/db')
const Users = require('./users')

const Transfer = sq.define('tx_transaction', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
});

Transfer.belongsTo(Users, {
    foreignKey: 'sender_id'
})

Transfer.belongsTo(Users, {
    foreignKey: 'receiver_id'
})

Transfer.sync({ alter: true })
    .then(() => console.log('transfer table sync'))

module.exports = Transfer