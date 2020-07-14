const mongoose = require('mongoose')
const Schema = mongoose.Schema//?
const usersSchema = new mongoose.Schema({
    name: {
        type: String
    },
    password: {
        type: String
    }
    /*
    email: {
        type: String
    },
    */
}, {timestamps: true})

module.exports = mongoose.model('Users', usersSchema)
//module.exports = users//?Users?
