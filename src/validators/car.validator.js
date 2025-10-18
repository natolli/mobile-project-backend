const Joi = require("joi");

const carBody = {
  make: Joi.string().required(),
  model: Joi.string().required(),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .required(),
  price: Joi.number().precision(2).positive().required(),
  mileage: Joi.number().integer().min(0),
  color: Joi.string(),
  transmission: Joi.string().valid("automatic", "manual"),
  fuelType: Joi.string().valid("petrol", "diesel", "electric", "hybrid"),
  bodyType: Joi.string().valid("sedan", "suv", "truck", "coupe", "hatchback"),
  description: Joi.string(),
  features: Joi.array().items(Joi.string()),
  images: Joi.array().items(Joi.string().uri()),
  location: Joi.string(),
  status: Joi.string().valid("available", "sold"),
};

const createCar = Joi.object(carBody);

const updateCar = Joi.object({
  ...carBody,
  // Make all fields optional for update
}).fork(Object.keys(carBody), (schema) => schema.optional());

module.exports = {
  createCar,
  updateCar,
};
