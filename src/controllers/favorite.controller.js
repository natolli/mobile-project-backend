const favoriteService = require("../services/favorite.service");
const Response = require("../utils/response.util");

const getUserFavorites = async (req, res, next) => {
  try {
    const favorites = await favoriteService.getUserFavorites(req.user.id);
    res
      .status(200)
      .json(new Response("Favorites retrieved successfully", favorites));
  } catch (error) {
    next(error);
  }
};

const addFavorite = async (req, res, next) => {
  try {
    const { carId } = req.body;
    const favorite = await favoriteService.addFavorite(req.user.id, carId);
    res.status(201).json(new Response("Car added to favorites", favorite));
  } catch (error) {
    next(error);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    await favoriteService.removeFavorite(req.user.id, req.params.carId);
    res.status(200).json(new Response("Car removed from favorites"));
  } catch (error) {
    next(error);
  }
};

const checkFavorite = async (req, res, next) => {
  try {
    const isFavorited = await favoriteService.checkFavorite(
      req.user.id,
      req.params.carId
    );
    res
      .status(200)
      .json(new Response("Favorite status checked", { isFavorited }));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
};
