const { Favorite, Car } = require("../models");

const findUserFavorites = (userId) => {
  return Favorite.findAll({
    where: { userId },
    include: [
      {
        model: Car,
        // attributes to include from the Car model
      },
    ],
  });
};

const findFavorite = (userId, carId) => {
  return Favorite.findOne({ where: { userId, carId } });
};

const create = (data) => {
  return Favorite.create(data);
};

const deleteFavorite = (userId, carId) => {
  return Favorite.destroy({ where: { userId, carId } });
};

module.exports = {
  findUserFavorites,
  findFavorite,
  create,
  deleteFavorite,
};
