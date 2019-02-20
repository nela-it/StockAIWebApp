const express = require("express");
const routes = require("./routes/index");
const app = express();
const bodyParser = require("body-parser");
const httpStatus = require("http-status");
const expressValidation = require("express-validation");
const cors = require("cors");
const APIError = require("./helpers/APIError");
const config = require("./config/index");
var path = require("path");
// const db = require("./config/index").db;
const logger = require("morgan");

if (config.env === "development") {
  app.use(logger("dev"));
} else {
  app.use(logger("tiny"));
}

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use("/api", routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors
      .map(error => error.messages.join(". "))
      .join(" and ");
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(
      err.message,
      err.status,
      err.name === "UnauthorizedError" ? true : err.isPublic
    );
    return next(apiError);
  }
  return next(err);
});

// config.Sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync with { force: true }");
// });

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError("API Not Found", httpStatus.NOT_FOUND, true);
  return next(err);
});

// error handler, send stacktrace only during development
// eslint-disable-line no-unused-vars
app.use((err, req, res, next) =>
  res.status(err.status).json({
    error: {
      message: err.isPublic ? err.message : httpStatus[err.status]
    }
  })
);

module.exports = app;
