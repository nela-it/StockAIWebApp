const express = require("express");
const router = express.Router();
const userRoute = require("./user.route");
const prediction_groupRoute = require("./prediction_group.route");
const portfolioRoute = require("./portfolio.route");

router.use("/user", userRoute);
router.use("/prediction_group", prediction_groupRoute);
router.use("/portfolio", portfolioRoute);

module.exports = router;
