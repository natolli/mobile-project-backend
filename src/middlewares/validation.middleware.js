const Joi = require("joi");

const validationMiddleware = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(", ");
    return res
      .status(400)
      .json({ message: `Validation Error: ${errorMessage}` });
  }
  return next();
};

module.exports = validationMiddleware;
