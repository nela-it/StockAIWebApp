const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validate = require("express-validation");
const prediction_groupController = require("../controller/prediction_group.controller");
const checkAuth = require("../middleware/check-auth");

const paramsValidation = {
  exploreGroups: {
    body: {
      group_id: Joi.string().required()
    }
  }
};

router.route("/getGroups").get(checkAuth, prediction_groupController.getGroups);
router
  .route("/exploreGroups")
  .post(
    checkAuth,
    validate(paramsValidation.exploreGroups),
    prediction_groupController.exploreGroups
  );

module.exports = router;
