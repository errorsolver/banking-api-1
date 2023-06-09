const jwt = require('jsonwebtoken')

const db = require('../config/database/db')
const Users = require('../config/model/users')
const Transfer = require('../config/model/transfer')

const transferController = {}

function getUserId(token) {
    const decodedToken = jwt.decode(token)
    return decodedToken.id
}

transferController.getLogsById = async (req, res) => {
    const token = req.cookies._jwt

    try {
        const logs = await Transfer.findAll({
            where: {
                sender_id: getUserId(token)
            },
            include: Users,
            attributes: [
                'amount', 'createdAt'
            ]
        })

        res.status(200).json({
            message: 'success get logs data',
            data: logs
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
}

transferController.getById = async (req, res) => {
    try {
        const { senderId, amount } = req.body
        const transaferData = Transfer.findAll({
            where: {
                sender_id: senderId
            }
        })

        res.status(200).json({
            message: 'Success get transfer data',
            data: transaferData
        })
    } catch (err) {
        res.status(400).json({
            error: err
        })
    }
}

transferController.transfer_post = async (req, res) => {
    const { amount, receiverId } = req.body
    const token = req.cookies._jwt


    const senderId = getUserId(token)
    try {
        if (!amount) throw 'amount require'
        if (!receiverId) throw 'receiverId require'
        if (senderId == receiverId) {
            throw 'Can not transfer to yourself'
        }

        const getSender = await Users.findByPk(senderId)

        const result = await db.transaction(async function (transaction) {
            try {
                await Users.update({
                    balance: getSender.balance - amount
                }, {
                    where: { id: senderId },
                    transaction
                })

                const receiver = await Users.findByPk(receiverId)

                await Users.update({
                    balance: receiver.balance + amount
                }, {
                    where: { id: receiverId },
                    transaction
                })

                const tf = await Transfer.create({
                    sender_id: senderId,
                    receiver_id: receiverId,
                    amount: amount
                }, {
                    where: { id: receiverId },
                    transaction
                })

                return tf
            } catch (err) {
                console.log('err: ', err)
            }
        })
        // const transfer = Transfer.create({})

        res.status(200).json({
            message: 'Transaction success',
            data: result
        })
    } catch (err) {
        res.status(404).json({
            message: 'Transaction failed',
            error: err
        })
    }
}

module.exports = transferController