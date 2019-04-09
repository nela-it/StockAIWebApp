const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validate = require("express-validation");
const portfolioController = require("../controller/portfolio.controller");
const checkAuth = require("../middleware/check-auth");

const paramsValidation = {
  addPortfolio: {
    body: {
      stockId: Joi.string().required()
    }
  }
};

router
  .route("/addPortfolio")
  .post(
    checkAuth,
    validate(paramsValidation.addPortfolio),
    portfolioController.addPortfolio
  );

router.route("/getPortfolio").get(checkAuth, portfolioController.getPortfolio);
router.route("/getChartData").post(checkAuth, portfolioController.getChartData);



module.exports = router;