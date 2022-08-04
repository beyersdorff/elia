const express = require('express')
const { body, validationResult, check } = require('express-validator');
const passport = require('passport')

const validationMiddleware = require('../lib/validation')

const CustomerController = require('./customer.controller')

const router = express.Router()

router.post('/login',
    [check('username').isEmail().normalizeEmail(),
    check('password').not().isEmpty()],
    validationMiddleware.validate,
    CustomerController.logIn
)

router.post('/',
    [check('email').isEmail().normalizeEmail(),
    check('firstName').not().isEmpty().trim().escape(),
    check('lastName').not().isEmpty().trim().escape(),
    check('password').not().isEmpty()],
    validationMiddleware.validate,
    CustomerController.register
)

//Dashboard routes
router.get('/dashboard/:id',
    passport.authenticate('jwt', {session: false}),
    [check('id').isMongoId()],
    validationMiddleware.validate,
    CustomerController.getCustomerById
)

router.get('/dashboard', passport.authenticate('jwt', {session: false}),CustomerController.getCustomers)

router.put('/dashboard/:id',
    passport.authenticate('jwt', {session: false}),
    [check('id').isMongoId(),
    check('email').isEmail().normalizeEmail(),
    check('firstName').not().isEmpty().trim().escape(),
    check('lastName').not().isEmpty().trim().escape(),
    check('password').not().isEmpty()],
    validationMiddleware.validate,
    CustomerController.updateCustomer)

router.delete('/dashboard/:id',
    passport.authenticate('jwt', {session: false}),
    [check('id').isMongoId()],
    validationMiddleware.validate,
    CustomerController.deleteCustomer)

module.exports = router