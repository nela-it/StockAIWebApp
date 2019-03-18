const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validate = require("express-validation");
const paymentController = require("../controller/payment.controller");
const checkAuth = require("../middleware/check-auth");

const paramsValidation = {
  getStockInfo: {
    body: {
      stockId: Joi.string().required()
    }
  }
};

router.route("/payment").get(
  // validate(paramsValidation.getStockInfo),
  // checkAuth,
  paymentController.payment
);

module.exports = router;
