const Customer = require('./customer.model')
const utils = require('../lib/utils');

logIn = (req, res) => {
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'You must provide username and password',
        })
    }

    Customer.findOne({email: username}, (err, customer) => {
        if (
            err || 
            !customer || 
            !utils.validPassword(req.body.password, customer.password_hash, customer.salt)
            ) {
            return res.status(200).json({
                success: false,
                message: 'Wrong username or password',
            })
        }

        const token = utils.issueJWT(customer, "customer");

        return res.status(200).json({
            success: true,
            user: customer,
            token: token.token,
            expiresIn: token.expires
        })
        
    })

}

register = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide all required data',
        })
    }

    const saltHash = utils.genPassword(req.body.password);
    const salt = saltHash.salt
    const hash = saltHash.hash

    const newCustomer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password_hash: hash,
        salt: salt,
    })

    newCustomer
        .save()
        .then((customer) => {
            const token = utils.issueJWT(customer, "customer");
            return res.status(201).json({
                success: true,
                id: customer._id,
                message: 'Customer created!',
                token: token.token,
                user: customer,
                expiresIn: token.expires,
            })
        })
        .catch(err => {
            console.error(err);
            return res.status(400).json({
                err,
                message: 'Customer not created!',
            })
        })
}

/**
 * Dashboard
 */


getCustomerById = async (req, res) => {
    if (req.user._id != req.params.id && req.user.role != "admin") {
        return res.status(401).json({sucess: false, message: "Unauthorized"})
    }

    await Customer.findOne({ _id: req.params.id }, (err, customer) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!customer) {
            return res
                .status(404)
                .json({ success: false, error: `Customer not found` })
        }

        return res.status(200).json({ success: true, data: {
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
        }})
    })
        .clone()
        .catch(err => console.error(err))
}

getCustomers = async (req, res) => {
    // Only allowed for admins
    if (req.user.role != "admin") {
        return res.status(401).json({sucess: false, message: "Unauthorized"})
    }

    await Customer.find({}, (err, customers) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        return res.status(200).json({ success: true, data: customers })
    })
        .clone()
        .catch(err => console.error(err))
}

updateCustomer = async (req, res) => {
    // Return unauthorized if no access rights
    if (req.user._id != req.params.id && req.user.role != "admin") {
        return res.status(401).json({sucess: false, message: "Unauthorized"})
    }

    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    await Customer.findOne({ _id: req.params.id }, (err, customer) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Customer not found!',
            })
        }
        
        // Recompting the password data
        const saltHash = utils.genPassword(req.body.password);
        const salt = saltHash.salt
        const hash = saltHash.hash

        customer.firstName= body.firstName
        customer.lastName = body.lastName
        customer.email = body.email
        customer.password_hash = hash
        customer.salt = salt

        customer
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: customer._id,
                    message: 'Customer updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Customer not updated!',
                })
            })
    })
        .clone()
        .catch(err => console.error(err))
}

deleteCustomer = async (req, res) => {
    // Return unauthorized if no access rights
    if (req.user._id != req.params.id && req.user.role != "admin") {
        return res.status(401).json({sucess: false, message: "Unauthorized"})
    }

    await Customer.findOneAndDelete({ _id: req.params.id }, (err, customer) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!customer) {
            return res
                .status(404)
                .json({ success: false, error: `Customer not found` })
        }

        return res.status(200).json({ success: true, data: customer })
    })
        .clone()
        .catch(err => console.error(err))
}


module.exports = {
    logIn,
    register,
    updateCustomer,
    deleteCustomer,
    getCustomers,
    getCustomerById,
}