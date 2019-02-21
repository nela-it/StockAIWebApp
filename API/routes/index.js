const express = require("express");
const router = express.Router();
const userRoute = require("./user.route");
const prediction_groupRoute = require("./prediction_group.route");

router.use("/user", userRoute);
router.use("/prediction_group", prediction_groupRoute);

module.exports = router;
