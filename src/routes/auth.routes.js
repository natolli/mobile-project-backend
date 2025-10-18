const express = require("express");
const authController = require("../controllers/auth.controller");
const validationMiddleware = require("../middlewares/validation.middleware");
const authValidator = require("../validators/auth.validator");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/register",
  validationMiddleware(authValidator.register),
  authController.register
);

router.post(
  "/login",
  validationMiddleware(authValidator.login),
  authController.login
);

router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;
