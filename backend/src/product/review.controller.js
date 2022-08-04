const Product = require('./product.model')
const Review = require('./review.model')

createReviewForProudct = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to create a new Review',
        })
    }

    await Product.findOne({ _id: req.params.id }, (err, product) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        
        if (!product) {
            return res
                .status(404)
                .json({ success: false, error: `Product not found` })
        }

         //check for bottle size so that it cannot be created two stocks with same bottle size

        const review = new Review(body)

        if (!review) {
            console.error("body did not fit review schema")
            return res.status(400).json({ success: false, error: err })
        }

        product.reviews.unshift(review)
        product
            .save()
            .then(() => {
                return res.status(200).json({ success: true, data: product})
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Product with new review could not be saved',
                })
            })
    })
    .clone()
    .catch(err => console.error(err))
}

module.exports = {
    createReviewForProudct,
}