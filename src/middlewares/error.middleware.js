const logger = require("../utils/logger");
const Response = require("../utils/response.util");

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected error occurred";

  logger.error(
    `${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );
  logger.error(err.stack);

  res.status(statusCode).json(new Response(message, null, false));
};

module.exports = {
  errorMiddleware,
};
