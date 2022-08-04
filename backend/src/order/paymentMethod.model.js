const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PaymentMethod = new Schema(
    {
        name: { type: String, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('paymentMethod', PaymentMethod)