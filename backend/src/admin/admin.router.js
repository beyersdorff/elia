const express = require("express");
const passport = require("passport");
const {  check } = require("express-validator");

const validationMiddleware = require("../lib/validation");

const AdminController = require("./admin.controller");

const router = express.Router();

router.post(
  "/login",
  [
    check("username")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("password")
      .not()
      .isEmpty()
  ],
  validationMiddleware.validate,
  AdminController.logIn
);
// This router must be protected in production
router.post(
  "/",
  [
    check("username")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("password")
      .not()
      .isEmpty()
  ],
  validationMiddleware.validate,
  AdminController.register
);

//Dashboard routes
router.get(
  "/dashboard/:id",
  passport.authenticate("jwt", { session: false }),
  [check("id").isMongoId()],
  validationMiddleware.validate,
  AdminController.getAdminById
);
router.get(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  AdminController.getAdmins
);
router.put(
  "/dashboard/:id",
  passport.authenticate("jwt", { session: false }),
  [
    check("password")
      .not()
      .isEmpty(),
    check("id")
      .isMongoId()
  ],
  validationMiddleware.validate,
  AdminController.updateAdmin
);
router.delete(
  "/dashboard/:id",
  passport.authenticate("jwt", { session: false }),
  [check("id").isMongoId()],
  validationMiddleware.validate,
  AdminController.deleteAdmin
);

module.exports = router;