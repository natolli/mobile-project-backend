const favoriteRepository = require("../repositories/favorite.repository");
const carRepository = require("../repositories/car.repository");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const getUserFavorites = (userId) => {
  return favoriteRepository.findUserFavorites(userId);
};

const addFavorite = async (userId, carId) => {
  const car = await carRepository.findById(carId);
  if (!car) {
    throw new AppError("Car not found", 404);
  }

  const existingFavorite = await favoriteRepository.findFavorite(userId, carId);
  if (existingFavorite) {
    throw new AppError("Car is already in favorites", 409); // 409 Conflict
  }

  return favoriteRepository.create({ userId, carId });
};

const removeFavorite = async (userId, carId) => {
  const result = await favoriteRepository.deleteFavorite(userId, carId);
  if (result === 0) {
    throw new AppError("Favorite not found", 404);
  }
  return result;
};

const checkFavorite = async (userId, carId) => {
  const favorite = await favoriteRepository.findFavorite(userId, carId);
  return !!favorite;
};

module.exports = {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
};
