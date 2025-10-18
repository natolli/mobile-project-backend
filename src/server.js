require("dotenv").config();
const app = require("./app");
const { port } = require("./config");
const logger = require("./utils/logger");
const { sequelize } = require("./models");

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection has been established successfully.");

    // In development, you might want to sync the database schema
    // Be cautious with this in production
    if (process.env.NODE_ENV === "development") {
      // await sequelize.sync({ force: true }); // Resets the database
      // logger.info('Database synchronized.');
    }

    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
