const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Review = new Schema(
    {
        description: { type: String, required: true },
        stars: { type: Number, required: true },
        author: { type: String, required: true },
        picture: { type: String, required: false },
    },
    { timestamps: true },
)

module.exports = mongoose.model('review', Review)