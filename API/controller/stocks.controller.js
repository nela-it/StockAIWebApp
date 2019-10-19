const db = require("../models/index");
const config = require("../config");
const Stocks = db.Stocks;
const Real_time_price = db.Real_time_price;
const Prediction_group = db.Prediction_group;
const request = require("async-request");
const Sequelize = require("sequelize");
const Op = db.Op;

exports.getStockInfo = async (req, res, next) => {
  try {
    Stocks.belongsTo(Prediction_group, {
      foreignKey: "group_id"
    });
    Stocks.belongsTo(Real_time_price, {
      foreignKey: "realtime_price_id"
    });
    let stockDetail = await Stocks.findOne({
      where: {
        id: req.body.stockId,
        version: 'A'
      },
      include: [Prediction_group, Real_time_price]
    });
    let realDetail = await Real_time_price.findOne({
      where: {
        id: req.body.realId
      },
    });
    stockDetail.real_time_price.dataValues = realDetail.dataValues;
    if (stockDetail) {
      res.status(200).json({
        message: "success",
        data: stockDetail
      });
    } else {
      res.status(404).json({
        message: "Not Found"
      });
    }
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

exports.updateRealtimePrice = async () => {
  try {
    let getAllStocks = await Stocks.findAll({
      limit: 5,
      order: [
        [Sequelize.fn("RAND")]
      ]
    });
    if (getAllStocks.length > 0) {
      for (let i = 0; i < getAllStocks.length; i++) {
        await updateStock(getAllStocks[i].dataValues);
      }
    }
  } catch (e) {
    console.log("catch error", e);
  }
};

updateStock = async stock => {
  try {
    let result = await request(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.ticker}&apikey=KNAV1IV5MII8BJWQ`
    );
    let resultToJSON = await JSON.parse(result.body);
    if (!resultToJSON.Note) {

      resultToJSON = await JSON.parse(result.body)["Global Quote"];
      // console.log(resultToJSON);
      let updatePrice = await Real_time_price.create({
        current_price: resultToJSON["05. price"],
        today_change_percentage: resultToJSON["10. change percent"],
        today_change: resultToJSON["09. change"],
        // your_change_percentage: ((resultToJSON["05. price"] - stock.recommended_price) /
        //     resultToJSON["05. price"]) *
        //   100,
        // your_change: resultToJSON["05. price"] - stock.recommended_price,
        stock_id: stock.id
      });
      if (updatePrice) {
        console.log("success id---------", stock.id);
      } else {
        console.log("fail id---------", stock.id);
      }
    } else {
      console.log("------------API maximum calling reached------------");
    }
  } catch (error) {
    console.log("error---------", error);
  }
};