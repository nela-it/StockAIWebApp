const express = require("express");
const router = express.Router();
const userRoute = require("./user.route");
const prediction_groupRoute = require("./prediction_group.route");
const portfolioRoute = require("./portfolio.route");
const productRoute = require("./product_info.route");
const stocksRoutes = require("./stocks.routes");
const algorithmRoutes = require("./algorithm.routes");
const paymentRoutes = require("./payment.routes");

router.use("/user", userRoute);
router.use("/prediction_group", prediction_groupRoute);
router.use("/portfolio", portfolioRoute);
router.use("/product", productRoute);
router.use("/stocks", stocksRoutes);
router.use("/algorithm", algorithmRoutes);
router.use("/payment", paymentRoutes);

module.exports = router;