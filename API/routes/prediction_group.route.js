const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validate = require("express-validation");
const prediction_groupController = require("../controller/prediction_group.controller");
const checkAuth = require("../middleware/check-auth");

const paramsValidation = {
  social: {
    body: {
      apiType: Joi.string().required()
    }
  },
  register: {
    body: {
      email: Joi.string()
        .email({
          minDomainAtoms: 2
        })
        .required(),
      password: Joi.string().required()
    }
  },
  forgotPassword: {
    body: {
      email: Joi.string()
        .email({
          minDomainAtoms: 2
        })
        .required()
    }
  },
  changePassword: {
    body: {
      password: Joi.string().required(),
      userId: Joi.string().required()
    }
  }
};

router
  .route("/checkExcelSheet")
  .get(prediction_groupController.checkExcelSheet);

module.exports = router;
