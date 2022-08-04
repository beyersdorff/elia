const Farmer = require('./farmer.model')
const utils = require('../lib/utils');

logIn = (req, res) => {
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'You must provide username and password',
        })
    }

    Farmer.findOne({email: username}, (err, farmer) => {
        if (
            err || 
            !farmer || 
            !utils.validPassword(req.body.password, farmer.password_hash, farmer.salt)
            ) {
            return res.status(200).json({
                success: false,
                message: 'Wrong username or password',
            })
        }

        const token = utils.issueJWT(farmer, "farmer");

        return res.status(200).json({
            success: true,
            user: farmer,
            token: token.token,
            expiresIn: token.expires
        })
        
    })

}

getFarmerById = async (req, res) => {
    await Farmer.findOne({ _id: req.params.id }, (err, farmer) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!farmer) {
            return res
                .status(404)
                .json({ success: false, error: `Farmer not found` })
        }

        // Only return those field that are public
        return res.status(200).json({ success: true, data: stripFarmerFromPersonalInfo(farmer)})
    })
        .clone()
        .catch(err => console.error(err))
}

getFarmers = async (req, res) => {
    await Farmer.find({}, (err, farmers) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        var strippedFarmers = farmers.map((farmer, index) => stripFarmerFromPersonalInfo(farmer));
        return res.status(200).json({ success: true, data: strippedFarmers })
    })
        .clone()
        .catch(err => console.error(err))
}

requestTourism = async (req, res) => {
    // Check if request is made by user
    if (req.user && req.user.role != "customer") {
        return res.status(400).json({sucess: false, message: "Only customers can book agritourism trips"})
    } else if (!req.body.firstName || !req.body.lastName || !req.body.email) {
        return res.status(400).json({sucess: false, message: "Personal Info must be provided"})
    }

    return Farmer.findOne({ _id: req.params.id }, (err, farmer) => {
        // Check if farmer is offering agritourism
        if (!farmer.tourism) {
            return res.status(400).json({sucess: false, message: "Farmer not offering agritourism"})
        }

        // Check availability
        req.body.startDate = new Date(req.body.startDate)
        req.body.endDate = new Date(req.body.endDate)
        var blocked = false;
        farmer.tourism.bookingRequests.every(bookingRequest => {
            if (
                bookingRequest.accepted &&
                (req.body.startDate >= bookingRequest.startDate && req.body.startDate <= bookingRequest.endDate ||
                req.body.endDate >= bookingRequest.startDate && req.body.endDate <= bookingRequest.endDate ||
                bookingRequest.startDate >= req.body.startDate && bookingRequest.startDate <= req.body.endDate ||
                bookingRequest.endDate >= req.body.startDate && bookingRequest.endDate <= req.body.endDate)
                ){
                blocked = true;
                return false;
            }
        });
        if (blocked) {
            return res.status(400).json({sucess: false, message: "The requested date is not available"})
        }

        // Check capacity
        if (req.body.numberRooms > farmer.tourism.roomCapacity) {
            return res.status(400).json({sucess: false, message: "The requested capacity is not available"})
        }

        // Set user if booking was done by registrated user
        if (req.user) {
            body.user = req.user.id
        }

        farmer.tourism.bookingRequests.push(req.body);

        farmer
            .save()
            .then((farmer) => {
                return res.status(200).json({
                    success: true,
                    id: farmer.tourism.bookingRequests[farmer.tourism.bookingRequests.length - 1]._id,
                    message: 'Request send',
                })
            })
            .catch(error => {
                console.error(error)
                return res.status(400).json({
                    error,
                    message: 'Could not send request!',
                })
            })

    })
        .clone()
        .catch(err => console.error(err))
}

stripFarmerFromPersonalInfo = (farmer) => {
    if (farmer.tourism) {
        farmer.tourism.bookingRequests = farmer.tourism.bookingRequests.filter(bookingRequest => bookingRequest.accepted);
        farmer.tourism.bookingRequests = farmer.tourism.bookingRequests.map(bookingRequest => {
            return {
                startDate: bookingRequest.startDate,
                endDate: bookingRequest.endDate
            }
        })
    }

    return {
        _id: farmer._id,
        name: farmer.name,
        description: farmer.description,
        tourism: farmer.tourism,
        profile_picture: farmer.profile_picture,
        pictures: farmer.pictures,
    }
}

/**
 * Dashboard
 */

getFarmerByIdDashboard = async (req, res) => {
    // Return unauthorized if no access rights
    if (req.user._id != req.params.id && req.user.role != "admin") {
        return res.status(401).json({sucess: false, message: "Unauthorized"})
    }

    await Farmer.findOne({ _id: req.params.id }, (err, farmer) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!farmer) {
            return res
                .status(404)
                .json({ success: false, error: `Farmer not found` })
        }

        return res.status(200).json({ success: true, data: {
            _id: farmer._id,
            name: farmer.name,
            email: farmer.email,
            description: farmer.description,
            tourism: farmer.tourism,
            profile_picture: farmer.profile_picture,
            pictures: farmer.pictures,
        }})
    })
        .clone()
        .catch(err => console.error(err))
}

getFarmersDashboard = async (req, res) => {
    // Return unauthorized if no access rights
    if (req.user.role != "admin" && req.user.role != "farmer") {
        return res.status(401).json({sucess: false, message: "Unauthorized"})
    }

    await Farmer.find({}, (err, farmers) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        let strippedFarmers; 
        if(req.user.role == "admin"){
            strippedFarmers=farmers.map((farmer) => {
                return {
                    _id: farmer._id,
                    name: farmer.name,
                    email: farmer.email,
                    description: farmer.description,
                    tourism: farmer.tourism,
                    profile_picture: farmer.profile_picture,
                    pictures: farmer.pictures,
                }
            })
        }else {
            strippedFarmers = [farmers.find(farmer => farmer._id== req.user.id)]
        }
        return res.status(200).json({ success: true, data: strippedFarmers })
    })
        .clone()
        .catch(err => console.error(err))
}

createFarmer = async (req, res) => {
    // Return unauthorized if no access rights
    if (req.user.role != "admin") {
        return res.status(401).json({sucess: false, message: "Unauthorized"})
    }

    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a farmer',
        })
    }

    const saltHash = utils.genPassword(req.body.password);
    const salt = saltHash.salt
    const hash = saltHash.hash

    const newFarmer = new Farmer({
        name: req.body.name,
        email: req.body.email,
        password_hash: hash,
        salt: salt,
        description: req.body.description,
        tourism: req.body.tourism,
        profile_picture: req.body.profile_picture,
        pictures: req.body.pictures,
    })

    newFarmer
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: newFarmer._id,
                message: 'Farmer created!',
            })
        })
        .catch(err => {
            console.error(err);
            return res.status(400).json({
                err,
                message: 'Farmer not created!',
            })
        })
}

updateFarmer = async (req, res) => {
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

    await Farmer.findOne({ _id: req.params.id }, (err, farmer) => {
        if (err || !farmer) {
            return res.status(404).json({
                err,
                message: 'Farmer not found!',
            })
        }

        farmer.name = body.name
        farmer.email = body.email
        farmer.description = body.description
        farmer.tourism = body.tourism
        farmer.profile_picture = body.profile_picture
        farmer.pictures = body.pictures

        farmer
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: farmer._id,
                    message: 'Farmer updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Farmer not updated!',
                })
            })
    })
        .clone()
        .catch(err => console.error(err))
}

deleteFarmer = async (req, res) => {
    // Return unauthorized if no access rights
    if (req.user._id != req.params.id && req.user.role != "admin") {
        return res.status(401).json({sucess: false, message: "Unauthorized"})
    }

    await Farmer.findOneAndDelete({ _id: req.params.id }, (err, farmer) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!farmer) {
            return res
                .status(404)
                .json({ success: false, error: `Farmer not found` })
        }

        return res.status(200).json({ success: true, data: farmer })
    })
        .clone()
        .catch(err => console.error(err))
}

deleteBooking = async (req, res) => {
// Return unauthorized if no access rights
if (req.user._id != req.params.farmerId && req.user.role != "admin") {
    return res.status(401).json({sucess: false, message: "Unauthorized"})
}

await Farmer.findOne({ _id: req.params.farmerId }, (err, farmer) => {
    if (err || !farmer) {
        return res.status(404).json({
            err,
            message: 'Farmer not found!',
        })
    }
    
    farmer.tourism.bookingRequests = farmer.tourism.bookingRequests.filter(bookingRequest => bookingRequest._id != req.params.bookingId)

    farmer
        .save()
        .then(() => {
            return res.status(200).json({
                success: true,
                bookingRequests: farmer.tourism.bookingRequests,
                message: 'Farmer updated!',
            })
        })
        .catch(error => {
            return res.status(404).json({
                error,
                message: 'Farmer not updated!',
            })
        })
})
    .clone()
    .catch(err => console.error(err))
}

acceptBooking = async (req, res) => {
    // Return unauthorized if no access rights
    if (req.user._id != req.params.farmerId && req.user.role != "admin") {
        return res.status(401).json({sucess: false, message: "Unauthorized"})
    }
    
    await Farmer.findOne({ _id: req.params.farmerId }, (err, farmer) => {
        if (err || !farmer) {
            return res.status(404).json({
                err,
                message: 'Farmer not found!',
            })
        }
        
        const requestIndex = farmer.tourism.bookingRequests.findIndex(bookingRequest => bookingRequest._id == req.params.bookingId)
        farmer.tourism.bookingRequests[requestIndex].accepted = true;

        const startDate = farmer.tourism.bookingRequests[requestIndex].startDate
        const endDate = farmer.tourism.bookingRequests[requestIndex].endDate

        // Remove open requests with overlapping date
        farmer.tourism.bookingRequests = farmer.tourism.bookingRequests.filter(bookingRequest => {
            if (bookingRequest.accepted) 
                return true;
            
            return !(bookingRequest.startDate >= startDate && bookingRequest.startDate <= endDate
                || bookingRequest.endDate >= startDate && bookingRequest.endDate <= endDate
                || bookingRequest.startDate < startDate && bookingRequest.endDate > endDate)
        })
    
        farmer
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    bookingRequests: farmer.tourism.bookingRequests,
                    message: 'Farmer updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Farmer not updated!',
                })
            })
    })
        .clone()
        .catch(err => console.error(err))
    }

module.exports = {
    logIn,
    requestTourism,
    createFarmer,
    updateFarmer,
    deleteFarmer,
    getFarmers,
    getFarmerById,
    getFarmerByIdDashboard,
    getFarmersDashboard,
    deleteBooking,
    acceptBooking
}