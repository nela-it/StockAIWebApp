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

router.route("/payment").get(checkAuth, paymentController.payment);
router.route("/successPayment").get(paymentController.successPayment);

module.exports = router;
