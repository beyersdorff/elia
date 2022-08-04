const express = require('express')
const { body, validationResult, check } = require('express-validator');
const passport = require('passport')

const validationMiddleware = require('../lib/validation')

const ProductController = require('./product.controller')
const ReviewController = require('./review.controller')

const router = express.Router()

//product
router.get('/', ProductController.getProducts)

router.delete('/:id',
  [check('id').isMongoId()],
  validationMiddleware.validate,
  ProductController.deleteProduct
)

router.get('/:id',
  [check('id').isMongoId()],
  validationMiddleware.validate,
  ProductController.getProductById
)

//Product dashboard request
router.post('/dashboard/',
  passport.authenticate('jwt', {session: false}),
  [check('name').not().isEmpty().trim().escape(),
  check('description').not().isEmpty().trim().escape(),
  check('region').not().isEmpty().trim(),
  check('growth_height').isInt({min: 0}).withMessage('Growth height must be a positive Integer'),
  check('filtration').isBoolean().withMessage('Filtration must be a boolean'),
  check('harvesting_date').isISO8601().toDate().withMessage('Harvesting Date must be a valid date'),
  check('picture').not().isEmpty().trim().escape(),
  check('reviews').isArray(),
  check('stocks').isArray(),
  check('variety').not().isEmpty().trim().escape(),
  check('farmerID').isMongoId()],
  validationMiddleware.validate,
  ProductController.createProduct
)

router.get('/dashboard/:id',
  passport.authenticate('jwt', {session: false}),
  [check('id').isMongoId()],
  validationMiddleware.validate,
  ProductController.getProductById
)

router.put('/dashboard/:id',
  passport.authenticate('jwt', {session: false}),
  [check('id').isMongoId(),
  check('name').not().isEmpty().trim().escape(),
  check('description').not().isEmpty().trim().escape(),
  check('region').not().isEmpty().trim(),
  check('growth_height').not().isEmpty().isInt({min: 0}).withMessage('Growth height must be a positive Integer'),
  check('filtration').isBoolean().withMessage('Filtration must be a boolean'),
  check('harvesting_date').isISO8601().toDate().withMessage('Harvesting Date must be a valid date'),
  check('picture').not().isEmpty().trim().escape(),
  check('reviews').isArray(),
  check('stocks').isArray(),
  check('variety').not().isEmpty().trim().escape(),
  check('farmerID').isMongoId()],
  validationMiddleware.validate,
  ProductController.updateProduct
)

router.delete('/dashboard/:id',
  passport.authenticate('jwt', {session: false}),
  [check('id').isMongoId()],
  validationMiddleware.validate,
  ProductController.deleteProduct
)

//review requests
router.post('/:id/reviews',
  [check('id').isMongoId()],
  validationMiddleware.validate,
  ReviewController.createReviewForProudct
)

module.exports = router