const express = require("express");

const OrderController = require("./order.controller");

const { check } = require("express-validator");

const validationMiddleware = require("../lib/validation");

const passport = require("passport");

const router = express.Router();

//order
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  OrderController.getOrders
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  [
    check("customer").isMongoId(),
    check("stockOrders.*.quantity")
      .isInt({ min: 1 })
      .withMessage("minimum of 1 product"),
    check("stockOrders.*.product").isMongoId(),
    check("stockOrders.*.stock").isMongoId(),
    check("paymentMethod.name")
      .not()
      .isEmpty()
      .trim(),
    check("purchaseOption")
      .not()
      .isEmpty()
      .trim(),
    check("price")
      .isFloat({ min: 0.01 })
      .withMessage("price must be a minimum of 0.01"),
    check("tax")
      .isFloat({ min: 0.001 })
      .withMessage("tax must be a minimum of 0.001"),
    check("total")
      .isFloat({ min: 0.01 })
      .withMessage("total must be a minimum of 0.01"),
    check("address")
      .not()
      .isEmpty()
      .trim(),
    check("additional_info"),
    check("zip")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("city")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("shipping_first_name")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("shipping_last_name")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("shipping_address")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("shipping_additionalInfo"),
    check("shipping_zip")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("shipping_city")
      .not()
      .isEmpty()
      .trim()
      .escape()
  ],
  validationMiddleware.validate,
  OrderController.createOrder
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  [check("id").isMongoId()],
  validationMiddleware.validate,
  OrderController.deleteOrder
);
router.get(
  "/:id",
  [check("id").isMongoId()],
  validationMiddleware.validate,
  OrderController.getOrderById
);


module.exports = router;