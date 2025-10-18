const express = require("express");
const favoriteController = require("../controllers/favorite.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const favoriteValidator = require("../validators/favorite.validator");

const router = express.Router();

// All favorite routes are protected
router.use(authMiddleware);

router.get("/", favoriteController.getUserFavorites);
router.post(
  "/",
  validationMiddleware(favoriteValidator.addFavorite),
  favoriteController.addFavorite
);
router.delete("/:carId", favoriteController.removeFavorite);
router.get("/:carId/check", favoriteController.checkFavorite);

module.exports = router;
