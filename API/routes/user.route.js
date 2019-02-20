const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validate = require("express-validation");
const userController = require("../controller/user.controller");
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
  .route("/login")
  .post(validate(paramsValidation.social), userController.login);

router
  .route("/register")
  .post(validate(paramsValidation.social), userController.register);

router
  .route("/forgotPassword")
  .post(
    validate(paramsValidation.forgotPassword),
    userController.forgotPassword
  );

router
  .route("/changePassword")
  .post(
    validate(paramsValidation.changePassword),
    userController.changePassword
  );

router.route("/getAllUsers").get(checkAuth, userController.getAllUser);

module.exports = router;