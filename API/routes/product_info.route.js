const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validate = require("express-validation");
const productController = require("../controller/product_info.controller");
const checkAuth = require("../middleware/check-auth");

const paramsValidation = {
  addPortfolio: {
    body: {
      stockId: Joi.string().required()
    }
  }
};

router
  .route("/getProductInfo")
  .get(checkAuth, productController.getProductInfo);

module.exports = router;
