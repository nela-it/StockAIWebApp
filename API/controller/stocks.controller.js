const db = require("../models/index");
const waterfall = require("async-waterfall");
const config = require("../config");
const Stocks = db.Stocks;
const Real_time_price = db.Real_time_price;
const Prediction_group = db.Prediction_group;
const request = require("async-request");
const Op = db.Op;

exports.getStockInfo = async (req, res, next) => {
  try {
    Stocks.belongsTo(Prediction_group, {
      foreignKey: "group_id"
    });
    let stockDetail = await Stocks.findOne({
      where: {
        id: req.body.stockId
      },
      include: [Prediction_group]
    });
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
    let getAllStocks = await Stocks.findAll({ limit: 3 });
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
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${
        stock.ticker
      }&apikey=KNAV1IV5MII8BJWQ`
    );
    if (result) {
      let updatePrice = await Real_time_price.update(
        {
          current_price: JSON.parse(result.body)["Global Quote"]["05. price"],
          today_change_percentage: JSON.parse(result.body)["Global Quote"][
            "10. change percent"
          ],
          today_change: JSON.parse(result.body)["Global Quote"]["09. change"],
          your_change_percentage:
            ((JSON.parse(result.body)["Global Quote"]["05. price"] -
              stock.recommended_price) /
              JSON.parse(result.body)["Global Quote"]["05. price"]) *
            100,
          your_change:
            JSON.parse(result.body)["Global Quote"]["05. price"] -
            stock.recommended_price
        },
        { where: { stock_id: stock.id } }
      );
      if (updatePrice) {
        console.log("success---------", stock.id);
      } else {
        console.log("fail---------", stock.id);
      }
    }
  } catch (error) {
    console.log("error---------", error);
  }
};
