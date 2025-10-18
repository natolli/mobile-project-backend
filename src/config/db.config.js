const config = require("./index");

module.exports = {
  development: {
    username: config.db.user,
    password: config.db.password,
    database: config.db.name,
    host: config.db.host,
    port: config.db.port,
    dialect: "postgres",
  },
  test: {
    username: config.db.user,
    password: config.db.password,
    database: `${config.db.name}_test`,
    host: config.db.host,
    port: config.db.port,
    dialect: "postgres",
    logging: false,
  },
  production: {
    username: config.db.user,
    password: config.db.password,
    database: config.db.name,
    host: config.db.host,
    port: config.db.port,
    dialect: "postgres",
    dialectOptions: {
      // Add SSL options here if required for production
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false
      // }
    },
    logging: false,
  },
};
