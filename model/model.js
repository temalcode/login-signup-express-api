
const mongoose = require('mongoose')

const userSchama = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: () => Date.now()
    }
})
const userSh = mongoose.model('user', userSchama)
module.exports = userSh