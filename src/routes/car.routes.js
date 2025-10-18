const express = require("express");
const carController = require("../controllers/car.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const carValidator = require("../validators/car.validator");

const router = express.Router();

// Public routes
router.get("/", carController.getAllCars);
router.get("/search", carController.searchCars);
router.get("/:id", carController.getSingleCar);

// Protected routes
router.post(
  "/",
  authMiddleware,
  validationMiddleware(carValidator.createCar),
  carController.createCar
);

router.put(
  "/:id",
  authMiddleware,
  validationMiddleware(carValidator.updateCar),
  carController.updateCar
);

router.delete("/:id", authMiddleware, carController.deleteCar);

module.exports = router;
