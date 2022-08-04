const Product = require('./product.model')

createProduct = async (req, res) => {
    if (req.user.role == "customer") {
        return res.status(401).json({sucess: false, message: "Unauthorized"})
    }

    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a product',
        })
    }

    const product = new Product(body)

    if (!product) {
        return res.status(400).json({ success: false, error: err })
    }

    product
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: product._id,
                message: 'Product created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Product not created!',
            })
        })
}

updateProduct = async (req, res) => {
    if (req.user.role == "customer") {
        return res.status(401).json({sucess: false, message: "Unauthorized"})
    }
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
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
        product.name = body.name
        product.description = body.description
        product.region = body.region
        product.growth_height = body.growth_height
        product.filtration = body.filtration
        product.harvesting_date = body.harvesting_date
        product.picture = body.picture
        product.reviews = body.reviews
        product.stocks = body.stocks
        product.variety = body.variety
        product.farmerID = body.farmerID
        product
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: product._id,
                    message: 'Product updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Product not updated!',
                })
            })
    })
        .clone()
        .catch(err => console.error(err))
}

deleteProduct = async (req, res) => {
    if (req.user.role == "customer") {
        return res.status(401).json({sucess: false, message: "Unauthorized"})
    }
    await Product.findOneAndDelete({ _id: req.params.id }, (err, product) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!product) {
            return res
                .status(404)
                .json({ success: false, error: `Product not found` })
        }
        return res.status(200).json({ success: true, data: product })
    })
        .clone()
        .catch(err => console.error(err))
}

getProductById = async (req, res) => {
    await Product.findOne({ _id: req.params.id }, (err, product) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!product) {
            return res
                .status(404)
                .json({ success: false, error: `Product not found` })
        }
        return res.status(200).json({ success: true, data: product })
    })
        .clone()
        .catch(err => console.error(err))
}

getProducts = async (req, res) => {
    await Product.find({}, (err, products) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        return res.status(200).json({ success: true, data: products })
    })
        .clone()
        .catch(err => console.error(err))
}

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProductById,
}