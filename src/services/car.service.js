const carRepository = require("../repositories/car.repository");
const { User } = require("../models");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const getAllCars = (queryParams) => {
  return carRepository.findAllAndCount(queryParams);
};

const getCarById = (id) => {
  return carRepository.findById(id, {
    include: {
      model: User,
      as: "owner",
      attributes: ["id", "firstName", "lastName", "email"],
    },
  });
};

const createCar = (carData) => {
  return carRepository.create(carData);
};

const updateCar = async (carId, updateData, userId) => {
  const car = await carRepository.findById(carId);
  if (!car) {
    throw new AppError("Car not found", 404);
  }
  if (car.userId !== userId) {
    throw new AppError("Forbidden: You do not own this car", 403);
  }
  return carRepository.update(carId, updateData);
};

const deleteCar = async (carId, userId) => {
  const car = await carRepository.findById(carId);
  if (!car) {
    throw new AppError("Car not found", 404);
  }
  if (car.userId !== userId) {
    throw new AppError("Forbidden: You do not own this car", 403);
  }
  return carRepository.deleteById(carId);
};

const searchCars = (query) => {
  return carRepository.search(query);
};

module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  searchCars,
};
