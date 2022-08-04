const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Admin = new Schema(
    {
        username: { type: String, required: true },
        password_hash: { type: String, required: true },
        salt: {type: String, required: true},
    },
    { timestamps: true },
)

module.exports = mongoose.model('admins', Admin)