const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validate = require("express-validation");
const alorithmController = require("../controller/algorithm_details.controller");
const checkAuth = require("../middleware/check-auth");

const paramsValidation = {
  getAlgorithm: {
    body: {
      groupId: Joi.string().required()
    }
  }
};

router
  .route("/getAlgorithm")
  .post(
    checkAuth,
    validate(paramsValidation.getAlgorithm),
    alorithmController.getAlgorithm
  );

module.exports = router;