const express = require("express");
const routes = require("./routes/index");
const app = express();
const bodyParser = require("body-parser");
const httpStatus = require("http-status");
const expressValidation = require("express-validation");
const cors = require("cors");
const APIError = require("./helpers/APIError");
const config = require("./config/index");
const service = require("./controller/prediction_group.controller");
const stockService = require("./controller/stocks.controller")
  .updateRealtimePrice;
const logger = require("morgan");
const chokidar = require("chokidar");
const XLSX = require("xlsx");
const CronJob = require("cron").CronJob;

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

// Cron job for update realtime price of stock
new CronJob(
  "*/2 * * * *",
  async () => {
      console.log("<------------------2 mins Cron Job Start------------------>");
      await stockService();
      console.log("<------------------2 mins Cron Job End------------------>");
    },
    null,
    true,
    "America/Los_Angeles"
);

// read excel sheet and update records in DB
var watcher = chokidar.watch("./files", {
  persistent: true
});

watcher.on("add", async function (path) {
  console.log("File", path, "has been added");
  if (path.split(".")[1] === "xlsx" || path.split(".")[1] === "xls") {
    var workbook = XLSX.readFile(`./${path}`, {
      cellDates: true,
      cellText: false
    });
    var sheet_name_list = workbook.SheetNames;
    let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    console.log("excel sheet name", sheet_name_list[0]);
    await service.saveGroupData(data);
    await stockService();
  }
});

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