const db = require("../models/index");
const config = require("../config");
const Stocks = db.Stocks;
const Prediction_group = db.Prediction_group;
const Op = db.Op;

exports.getStockInfo = async (req, res, next) => {
  try {
    Stocks.belongsTo(Prediction_group, { foreignKey: "group_id" });
    let stockDetail = await Stocks.findOne({
      where: { id: req.body.stockId },
      include: [Prediction_group]
    });
    if (stockDetail) {
      res.status(200).json({ message: "success", data: stockDetail });
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};
