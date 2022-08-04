const express = require('express')
const { body, validationResult, check } = require('express-validator');
const validationMiddleware = require('../lib/validation')
const passport = require('passport')

const FarmerController = require('./farmer.controller')

const router = express.Router()

//Dashboard routes
//TODO Get dashboard if farmer return himself
router.get('/dashboard', passport.authenticate('jwt', {session: false}),
    FarmerController.getFarmersDashboard)

router.delete('/dashboard/agritourism/:farmerId/:bookingId', passport.authenticate('jwt', {session: false}), 
    [check('farmerId').isMongoId(), 
    check('bookingId').isMongoId()],
    validationMiddleware.validate,
    FarmerController.deleteBooking)

router.put('/dashboard/agritourism/:farmerId/:bookingId', passport.authenticate('jwt', {session: false}),
    [check('farmerId').isMongoId(), 
    check('bookingId').isMongoId()],
    validationMiddleware.validate,
    FarmerController.acceptBooking)
    
router.get('/dashboard/:id', passport.authenticate('jwt', {session: false}), 
    [check('id').isMongoId()],
    validationMiddleware.validate,    
    FarmerController.getFarmerByIdDashboard)

router.put('/dashboard/:id', passport.authenticate('jwt', {session: false}), 
    [check('id').isMongoId(), 
    check('email').isEmail().normalizeEmail(),
    check('name').not().isEmpty().trim().escape(),
    check('description').not().isEmpty().trim().escape(),
    check('profile_picture').not().isEmpty().trim().escape(),
    check('pictures.*').not().isEmpty().trim().escape(),
    check('tourism.description').if(body('tourism.description').exists()).not().isEmpty().trim().escape(),
    check('tourism.region_title').if(body('tourism.region_title').exists()).not().isEmpty().trim().escape(),
    check('tourism.region_description').if(body('tourism.region_description').exists()).not().isEmpty().trim().escape(),
    check('tourism.activity_description').if(body('tourism.activity_description').exists()).not().isEmpty().trim().escape(),
    check('tourism.title_picture').if(body('tourism.title_picture').exists()).not().isEmpty().trim().escape(),
    check('tourism.region_pictures.*').if(body('tourism.region_pictures').exists()).not().isEmpty().trim().escape(),
    check('tourism.accomodation_pictures.*').if(body('tourism.accomodation_pictures').exists()).not().isEmpty().trim().escape(),
    check('tourism.activity_pictures.*').if(body('tourism.activity_pictures').exists()).not().isEmpty().trim().escape(),
    check('tourism.roomCapacity').if(body('tourism.roomCapacity').exists()).isInt({min: 0}).withMessage('Rooms must be a positive Integer'),
    check('tourism.bookingRequests.*.startDate').if(body('tourism.bookingRequests').exists()).not().isEmpty().trim().escape(),
    check('tourism.bookingRequests.*.endDate').if(body('tourism.bookingRequests').exists()).not().isEmpty().trim().escape(),
    check('tourism.bookingRequests.*.numberPeople').if(body('tourism.bookingRequests').exists()).isInt({min: 0}).withMessage('Number people must be a positive Integer'),
    check('tourism.bookingRequests.*.numberRooms').if(body('tourism.bookingRequests').exists()).isInt({min: 0}).withMessage('Rooms must be a positive Integer'),
    check('tourism.bookingRequests.*.accepted').if(body('tourism.bookingRequests').exists()).isBoolean().withMessage('accepted must be a boolean')
    ],
    validationMiddleware.validate,    
    FarmerController.updateFarmer)

router.delete('/dashboard/:id', passport.authenticate('jwt', {session: false}), 
    [check('id').isMongoId()],
    validationMiddleware.validate,   
    FarmerController.deleteFarmer)

router.post('/dashboard', passport.authenticate('jwt', {session: false}),
    [
    check('email').isEmail().normalizeEmail(),
    check('name').not().isEmpty().trim().escape(),
    check('description').not().isEmpty().trim().escape(),
    check('profile_picture').not().isEmpty().trim().escape(),
    check('pictures.*').not().isEmpty().trim().escape(),
    check('password').not().isEmpty(),
    check('tourism.description').if(body('tourism.description').exists()).not().isEmpty().trim().escape(),
    check('tourism.region_title').if(body('tourism.region_title').exists()).not().isEmpty().trim().escape(),
    check('tourism.region_description').if(body('tourism.region_description').exists()).not().isEmpty().trim().escape(),
    check('tourism.activity_description').if(body('tourism.activity_description').exists()).not().isEmpty().trim().escape(),
    check('tourism.title_picture').if(body('tourism.title_picture').exists()).not().isEmpty().trim().escape(),
    check('tourism.region_pictures.*').if(body('tourism.region_pictures').exists()).not().isEmpty().trim().escape(),
    check('tourism.accomodation_pictures.*').if(body('tourism.accomodation_pictures').exists()).not().isEmpty().trim().escape(),
    check('tourism.activity_pictures.*').if(body('tourism.activity_pictures').exists()).not().isEmpty().trim().escape(),
    check('tourism.roomCapacity').if(body('tourism.roomCapacity').exists()).isInt({min: 0}).withMessage('Rooms must be a positive Integer'),
    check('tourism.bookingRequests.*.startDate').if(body('tourism.bookingRequests').exists()).not().isEmpty().trim().escape(),
    check('tourism.bookingRequests.*.endDate').if(body('tourism.bookingRequests').exists()).not().isEmpty().trim().escape(),
    check('tourism.bookingRequests.*.numberPeople').if(body('tourism.bookingRequests').exists()).isInt({min: 0}).withMessage('Number people must be a positive Integer'),
    check('tourism.bookingRequests.*.numberRooms').if(body('tourism.bookingRequests').exists()).isInt({min: 0}).withMessage('Rooms must be a positive Integer'),
    check('tourism.bookingRequests.*.numberRooms').if(body('tourism.bookingRequests').exists()).isBoolean().withMessage('accepted must be a boolean')
    ],
    validationMiddleware.validate, 
    FarmerController.createFarmer)

// Public routes
router.post('/agritourism/:id', 
    [check('id').isMongoId(), 
    check('email').isEmail().normalizeEmail(),
    check('firstName').not().isEmpty().trim().escape(),
    check('lastName').not().isEmpty().trim().escape(),
    check('startDate').isISO8601().toDate().withMessage('Start Date must be a valid Date'),
    check('endDate').isISO8601().toDate().withMessage('End Date must be a valid Date'),
    check('numberRooms').isFloat({min: 0}).withMessage('Rooms must be a positive number')],
    validationMiddleware.validate,
    FarmerController.requestTourism)

router.get('/:id',
    [check('id').isMongoId()],
    validationMiddleware.validate,
    FarmerController.getFarmerById)


router.get('/', FarmerController.getFarmers)

router.post('/login', 
    [ check('username').isEmail().normalizeEmail(),
    check('password').not().isEmpty()],
    validationMiddleware.validate, 
    FarmerController.logIn)

module.exports = router