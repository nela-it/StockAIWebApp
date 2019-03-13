const Joi = require("joi");
const dbConfig = require("./dbConfig");

require("dotenv").config();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .allow(["development", "production", "test"])
      .default("development"),
    PORT: Joi.number().default(4040),
    JWT_SECRET: Joi.string()
      .required()
      .description("JWT Secret required to sign"),
    JWT_EXPIRES_IN: Joi.number()
      .default(1440)
      .description("JWT expiration time in seconds")
  })
  .unknown()
  .required();

const {
  error,
  value: envVars
} = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,
  db: dbConfig[envVars.NODE_ENV],
  storeImage: "https://localhost:3001/api/",
  frontImage: "https://stockzai.com/"
};

module.exports = config;