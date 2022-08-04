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

const Stock = new Schema(
    {
        size: { type: Number, required: true },
        available_bottles: { type: Number, required: true },
        price: { type: Number, required: true },
    },
)

const Product = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        region: { type: String, required: true, enum: ["Crete", "Peloponnese", "Attica", "West- & Middle", "Thessaly", "Epirus", "Macedonia", "Thrace"] }, //might make sense to make en Enum for all regions
        growth_height: { type: Number, required: true },
        filtration: { type: Boolean, required: true },
        harvesting_date: { type: Date, required: true },
        picture: { type: String, required: true },
        reviews: { type: [Review], required: true},
        stocks: { type: [Stock], required: true},
        variety: {type: String, required: true, enum: ["Mono", "Multi"]},
        farmerID: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Farmer",
            required: true
        }, 
    },
    { timestamps: true },
)
module.exports = mongoose.model('products', Product)