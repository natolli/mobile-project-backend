const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(3000),
    DB_HOST: Joi.string().required().description("Database host"),
    DB_PORT: Joi.number().default(5432),
    DB_USER: Joi.string().required().description("Database user"),
    DB_PASSWORD: Joi.string().required().description("Database password"),
    DB_NAME: Joi.string().required().description("Database name"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_EXPIRES_IN: Joi.string().required().description("JWT expiration"),
    GEMINI_API_KEY: Joi.string()
      .required()
      .description("Google Gemini API Key"), // <-- Added this line
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  db: {
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    user: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    name: envVars.DB_NAME,
  },
  gemini: {
    // <-- Added this object
    apiKey: envVars.GEMINI_API_KEY,
  },
};
