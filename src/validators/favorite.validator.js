const Joi = require("joi");

const addFavorite = Joi.object({
  carId: Joi.string().uuid().required(),
});

module.exports = {
  addFavorite,
};
