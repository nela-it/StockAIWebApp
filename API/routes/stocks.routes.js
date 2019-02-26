const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validate = require("express-validation");
const stocksController = require("../controller/stocks.controller");
const checkAuth = require("../middleware/check-auth");

const paramsValidation = {
  getStockInfo: {
    body: {
      stockId: Joi.string().required()
    }
  }
};

router
  .route("/getStockInfo")
  .post(
    validate(paramsValidation.getStockInfo),
    checkAuth,
    stocksController.getStockInfo
  );

module.exports = router;
