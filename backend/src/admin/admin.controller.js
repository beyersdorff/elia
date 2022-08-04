const Admin = require('./admin.model')
const utils = require('../lib/utils');

logIn = (req, res) => {
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'You must provide username and password',
        })
    }

    Admin.findOne({email: username}, (err, admin) => {
        if (
            err || 
            !admin || 
            !utils.validPassword(req.body.password, admin.password_hash, admin.salt)
            ) {
            return res.status(200).json({
                success: false,
                message: 'Wrong username or password',
            })
        }

        const token = utils.issueJWT(admin, "admin");

        return res.status(200).json({
            success: true,
            user: admin,
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

    const newAdmin = new Admin({
        username: req.body.username,
        password_hash: hash,
        salt: salt,
    })

    newAdmin
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: newAdmin._id,
                message: 'Admin created!',
            })
        })
        .catch(err => {
            console.error(err);
            return res.status(400).json({
                err,
                message: 'Admin not created!',
            })
        })
}

/**
 * Dashboard
 */


getAdminById = async (req, res) => {
    if (req.user.role != "admin") {
        return res.status(401).json({sucess: false, message: "Unauthorized"})
    }

    await Admin.findOne({ _id: req.params.id }, (err, admin) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!admin) {
            return res
                .status(404)
                .json({ success: false, error: `Admin not found` })
        }

        return res.status(200).json({ success: true, data: {
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
        }})
    })
        .clone()
        .catch(err => console.error(err))
}

getAdmins = async (req, res) => {
    if (req.user.role != "admin") {
        return res.status(401).json({sucess: false, message: "Unauthorized"})
    }

    await Admin.find({}, (err, admins) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        return res.status(200).json({ success: true, data: admins })
    })
        .clone()
        .catch(err => console.error(err))
}

updateAdmin = async (req, res) => {
    // Return unauthorized if no access rights
    if (req.user.role != "admin") {
        return res.status(401).json({sucess: false, message: "Unauthorized"})
    }

    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    await Admin.findOne({ _id: req.params.id }, (err, admin) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Admin not found!',
            })
        }
        
        // Recompting the password data
        const saltHash = utils.genPassword(req.body.password);
        const salt = saltHash.salt
        const hash = saltHash.hash

        admin.email = body.email
        admin.password_hash = hash
        admin.salt = salt

        admin
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: admin._id,
                    message: 'Admin updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Admin not updated!',
                })
            })
    })
        .clone()
        .catch(err => console.error(err))
}

deleteAdmin = async (req, res) => {
    // Return unauthorized if no access rights
    if (req.user._id != req.params.id) {
        return res.status(401).json({sucess: false, message: "Unauthorized"})
    }

    await Admin.findOneAndDelete({ _id: req.params.id }, (err, admin) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!admin) {
            return res
                .status(404)
                .json({ success: false, error: `Admin not found` })
        }

        return res.status(200).json({ success: true, data: admin })
    })
        .clone()
        .catch(err => console.error(err))
}

module.exports = {
    logIn,
    register,
    updateAdmin,
    deleteAdmin,
    getAdmins,
    getAdminById,
}