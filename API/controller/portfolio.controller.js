const db = require("../models/index");
const Portfolio = db.Portfolio;
const Prediction_group = db.Prediction_group;
const Stocks = db.Stocks;
const realTimePrice = db.Real_time_price;
const Op = db.Op;
// Portfolio.sync({ force: true });

exports.addPortfolio = async (req, res, next) => {
  try {
    let getRealTimeId = await realTimePrice.findOne({
      where: { stock_id: req.body.stockId }
    });
    let isAlreadyPortfolio = await Portfolio.findOne({
      where: {
        user_id: req.user.id,
        real_time_price_id: getRealTimeId.dataValues.id
      }
    });
    if (isAlreadyPortfolio) {
      return res.status(404).json({
        message: "Stock Is Already Added In Portfolio."
      });
    } else {
      let addPortfolio = await Portfolio.create({
        real_time_price_id: getRealTimeId.dataValues.id,
        user_id: req.user.id
      });
      if (addPortfolio) {
        return res.status(200).json({
          message: "Stock Added In Portfolio Successfully."
        });
      } else {
        return res.status(404).json({
          message: "Stock Is Not Added."
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

// get portfolio
exports.getPortfolio = async (req, res, next) => {
  Portfolio.belongsTo(realTimePrice, { foreignKey: "real_time_price_id" });
  realTimePrice.belongsTo(Stocks, { foreignKey: "stock_id" });
  Stocks.belongsTo(Prediction_group, { foreignKey: "group_id" });
  try {
    let isRecords = await Portfolio.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: realTimePrice,
          include: [
            {
              model: Stocks,
              include: {
                model: Prediction_group
              }
            }
          ]
        }
      ]
    });
    if (isRecords.length > 0) {
      return res.status(200).json({
        message: "Portfolio Found",
        data: isRecords
      });
    } else {
      return res.status(404).json({
        message: "Portfolio Not Found",
        data: []
      });
    }
  } catch (error) {
    console.log("error-----------" + error);
    next(error);
  }
};

exports.checkPortfolio = async (params, cb) => {
  Portfolio.belongsTo(realTimePrice, { foreignKey: "real_time_price_id" });
  realTimePrice.belongsTo(Stocks, { foreignKey: "stock_id" });
  Stocks.belongsTo(Prediction_group, { foreignKey: "group_id" });
  try {
    let isRecords = await Portfolio.findAll({
      where: { user_id: params.user.id },
      include: [
        {
          model: realTimePrice,
          include: {
            model: Stocks
          }
        }
      ]
    });
    if (isRecords.length > 0) {
      await cb(null, isRecords);
    } else {
      await cb(null, []);
    }
  } catch (error) {
    next(error);
  }
};
