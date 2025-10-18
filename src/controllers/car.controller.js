const carService = require("../services/car.service");
const Response = require("../utils/response.util");

const getAllCars = async (req, res, next) => {
  try {
    const result = await carService.getAllCars(req.query);
    res.status(200).json(new Response("Cars retrieved successfully", result));
  } catch (error) {
    next(error);
  }
};

const getSingleCar = async (req, res, next) => {
  try {
    const car = await carService.getCarById(req.params.id);
    if (!car) {
      return res.status(404).json(new Response("Car not found", null, false));
    }
    res.status(200).json(new Response("Car retrieved successfully", car));
  } catch (error) {
    next(error);
  }
};

const createCar = async (req, res, next) => {
  try {
    const carData = { ...req.body, userId: req.user.id };
    const newCar = await carService.createCar(carData);
    res.status(201).json(new Response("Car created successfully", newCar));
  } catch (error) {
    next(error);
  }
};

const updateCar = async (req, res, next) => {
  try {
    const updatedCar = await carService.updateCar(
      req.params.id,
      req.body,
      req.user.id
    );
    res.status(200).json(new Response("Car updated successfully", updatedCar));
  } catch (error) {
    // Service layer handles not found and ownership errors
    next(error);
  }
};

const deleteCar = async (req, res, next) => {
  try {
    await carService.deleteCar(req.params.id, req.user.id);
    res.status(200).json(new Response("Car deleted successfully"));
  } catch (error) {
    next(error);
  }
};

const searchCars = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res
        .status(400)
        .json(new Response('Search query "q" is required', null, false));
    }
    const cars = await carService.searchCars(q);
    res.status(200).json(new Response("Car search successful", cars));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCars,
  getSingleCar,
  createCar,
  updateCar,
  deleteCar,
  searchCars,
};
