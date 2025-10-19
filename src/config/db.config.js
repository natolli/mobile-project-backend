const config = require("./index");

module.exports = {
  development: {
    username: config.db.user,
    password: config.db.password,
    database: config.db.name,
    host: config.db.host,
    port: config.db.port,
    ssl: true,
    dialectOptions: {
      // Add SSL options here if required for production
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    dialect: "postgres",
  },
  test: {
    username: config.db.user,
    password: config.db.password,
    database: `${config.db.name}_test`,
    host: config.db.host,
    port: config.db.port,
    dialect: "postgres",
    ssl: true,
    dialectOptions: {
      // Add SSL options here if required for production
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  },
  production: {
    username: config.db.user,
    password: config.db.password,
    database: config.db.name,
    host: config.db.host,
    port: config.db.port,
    dialect: "postgres",
    ssl: true,
    dialectOptions: {
      // Add SSL options here if required for production
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  },
};
