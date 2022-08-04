const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StockOrder = new Schema(
    {
        quantity: { type: Number, required: true },
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true

        },
        stock: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Stock",
            required: true
          },
    },
    { timestamps: true },
)

module.exports = mongoose.model('stockOrder', StockOrder)