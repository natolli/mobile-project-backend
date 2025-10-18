const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const routes = require("./routes");
const { errorMiddleware } = require("./middlewares/error.middleware");

const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable Cross-Origin Resource Sharing
app.use(cors());
app.options("*", cors());

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Main API routes
app.use("/api", routes);

// Centralized error handling
app.use(errorMiddleware);

// Handle 404 - Not Found for any unspecified API routes
app.use((req, res, next) => {
  res.status(404).send({ message: "Not Found" });
});

module.exports = app;
