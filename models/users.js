const mongoose = require('mongoose')
const usersSchema = new mongoose.Schema({
    name: {
        type: String
    },
    /*
    email: {
        type: String
    },
    password: {
        type: String
    },
    */
})

module.exports = mongoose.model('Users', usersSchema)