const db = require("../models/index");
const Portfolio = db.Portfolio;
const Prediction_group = db.Prediction_group;
const Stocks = db.Stocks;
const realTimePrice = db.Real_time_price;
const Op = db.Op;
const Sequelize = require("sequelize");

// Portfolio.sync({ force: true });

exports.addPortfolio = async (req, res, next) => {
  try {
    let getStockDetails = await Stocks.findOne({
      where: {
        id: req.body.stockId
      }
    });
    let getrealTimeDetails = await realTimePrice.findOne({
      where: {
        id: req.body.realId
      }
    });
    console.log(getrealTimeDetails);
    let isAlreadyPortfolio = await Portfolio.findOne({
      where: {
        user_id: req.user.id,
        real_time_price_id: getrealTimeDetails.dataValues.id,
      }
    });
    if (isAlreadyPortfolio) {
      return res.status(404).json({
        message: "Stock Is Already Added In Portfolio."
      });
    } else {
      let addPortfolio = await Portfolio.create({
        real_time_price_id: getrealTimeDetails.dataValues.id,
        user_id: req.user.id,
        real_time_price_value: getrealTimeDetails.dataValues.current_price,
        stock_id: req.body.stockId
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
    console.log(error);
    next(error);
  }
};

// get portfolio
exports.getPortfolio = async (req, res, next) => {
  Portfolio.belongsTo(realTimePrice, {
    foreignKey: "real_time_price_id"
  });
  realTimePrice.belongsTo(Stocks, {
    foreignKey: "stock_id"
  });
  Stocks.belongsTo(Prediction_group, {
    foreignKey: "group_id"
  });
  console.log("Portfolio", Portfolio);
  try {
    let isRecords = await Portfolio.findAll({
      where: {
        user_id: req.user.id
      },
      include: [{
        model: realTimePrice,
        include: [{
          model: Stocks,
          include: {
            model: Prediction_group
          }
        }]
      }]
    });

    // let isRecord = await Portfolio.findAll({
    //   where: {
    //     user_id: req.user.id
    //   }
    // });
    // let isStock, isrealTime;
    // console.log(isRecord);
    // for (let i = 0; i < isRecord.length; i++) {
    //   isStock = await Stocks.findOne({
    //     where: {
    //       id: isRecord[i].stock_id
    //     }
    //   });

    //   isrealTime = await await realTimePrice.findAll({
    //     where: {
    //       stock_id: isStock.dataValues.id
    //     },
    //     order: [
    //       ['createdAt', 'DESC']
    //     ],
    //     limit: 1
    //   });
    //   console.log(isrealTime);

    // }

    // res.send(isrealTime);
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
  Portfolio.belongsTo(realTimePrice, {
    foreignKey: "real_time_price_id"
  });
  realTimePrice.belongsTo(Stocks, {
    foreignKey: "stock_id"
  });
  Stocks.belongsTo(Prediction_group, {
    foreignKey: "group_id"
  });

  try {
    let isRecords = await Portfolio.findAll({
      where: {
        user_id: params.user.id
      },
      include: [{
        model: realTimePrice,
        include: {
          model: Stocks
        }
      }]
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