const db = require("../models/index");
const Portfolio = db.Portfolio;
const Prediction_group = db.Prediction_group;
const Stocks = db.Stocks;
const realTimePrice = db.Real_time_price;
const moment = require("moment");
const Op = db.Op;
const _ = require("lodash");
const Sequelize = require("sequelize");


// Portfolio.sync({
//   force: true
// });

exports.addPortfolio = async (req, res, next) => {
  try {
    console.log(req.body);
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
  try {
    let isRecord = await Portfolio.findAll({
      where: {
        user_id: req.user.id
      }
    });
    let isStock, isrealTime;

    for (let i = 0; i < isRecord.length; i++) {
      isStock = await Stocks.findOne({
        where: {
          id: isRecord[i].stock_id
        },
        include: {
          model: Prediction_group
        }
      });

      isrealTime = await realTimePrice.findOne({
        where: {
          stock_id: isStock.dataValues.id
        },
        order: [
          ['createdAt', 'DESC']
        ],
      });

      isrealTime.dataValues.your_change = `${(isrealTime.dataValues.current_price - isRecord[i].real_time_price_value).toFixed(4)}`;
      isrealTime.dataValues.your_change_percentage = `${(((isrealTime.dataValues.current_price - isRecord[i].real_time_price_value) / isrealTime.dataValues.current_price) * 100).toFixed(4)}`;

      isrealTime.dataValues.stock = isStock.dataValues;
      isRecord[i].dataValues.real_time_price = isrealTime.dataValues;
    }

    // res.send(isRecord);
    if (isRecord.length > 0) {
      return res.status(200).json({
        message: "Portfolio Found",
        data: isRecord
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

exports.getChartData = async (req, res, next) => {
  try {
    let dataChart = [];
    let isRecord = await Portfolio.findAll({
      where: {
        user_id: req.user.id,
        stock_id: req.body.stock
      }
    });
    let isrealTime;
    if (req.body.days === 'Daily') {
      for (let i = 0; i < 24; i++) {
        isrealTime = await realTimePrice.findOne({
          where: {
            stock_id: isRecord[0].dataValues.stock_id,
            createdAt: {
              [Op.gte]: moment.utc(moment().set('hour', i)).subtract(1, 'hours').endOf('hours'),
              [Op.lt]: moment.utc(moment().set('hour', i)).add(1, 'hours').startOf('hours')
            }
          },
          order: [
            ['id', 'DESC']
          ]
        });

        let current = moment.utc();
        let stockTime = moment.utc(moment().set('hour', i).minutes(0));



        if (current.isAfter(stockTime)) {
          if (dataChart.length === 0) {
            if (isrealTime === null) {
              isrealTime = await realTimePrice.findOne({
                where: {
                  stock_id: isRecord[0].dataValues.stock_id,
                  createdAt: {
                    [Op.gte]: moment().subtract(1, 'days').endOf('day'),
                    [Op.lt]: moment().add(1, 'days').startOf('day')
                  }
                },
                order: [
                  ['id', 'DESC']
                ]
              });
            }
            dataChart.push({
              'portfolio': isrealTime !== null ? isRecord[0].real_time_price_value : 0,
              'realTime': isrealTime !== null ? isrealTime.dataValues.current_price : 0,
              'time': moment.utc().set('hour', i).minutes(0).format('hh:mm A'),
            });
          } else {
            dataChart.push({
              'portfolio': isrealTime !== null ? isRecord[0].real_time_price_value : dataChart[dataChart.length - 1]['portfolio'],
              'realTime': isrealTime !== null ? isrealTime.dataValues.current_price : dataChart[dataChart.length - 1]['realTime'],
              'time': moment.utc().set('hour', i).minutes(0).format('hh:mm A'),
            });
          }
        } else {
          dataChart.push({
            'portfolio': isrealTime !== null ? isRecord[0].real_time_price_value : 0,
            'realTime': isrealTime !== null ? isrealTime.dataValues.current_price : 0,
            'time': moment.utc().set('hour', i).minutes(0).format('hh:mm A'),
          });
        }
        if (24 === i + 1) {
          return res.status(200).json({
            message: "Chart data Found",
            data: dataChart
          });
        }
      }
    } else if (req.body.days === 'Weekly') {
      for (let i = 0; i < 7; i++) {
        isrealTime = await realTimePrice.findOne({
          where: {
            stock_id: isRecord[0].dataValues.stock_id,
            createdAt: {
              [Op.gte]: moment(moment().clone().weekday(0 + i)).subtract(1, 'days').endOf('day'),
              [Op.lt]: moment(moment().clone().weekday(0 + i)).add(1, 'days').startOf('day')
            }
          },
          order: [
            ['createdAt', 'DESC']
          ],
        });

        dataChart.push({
          'portfolio': isrealTime !== null ? isRecord[0].real_time_price_value : 0,
          'realTime': isrealTime !== null ? isrealTime.dataValues.current_price : 0,
          'time': moment(moment().clone().weekday(0 + i).format('YYYY-MM-DD')).format('YYYY-MM-DD'),
        });

        if (7 === i + 1) {
          return res.status(200).json({
            message: "Chart data Found",
            data: dataChart
          });
        }
      }
    } else {
      for (let i = 0; i < moment().daysInMonth(); i++) {
        isrealTime = await realTimePrice.findOne({
          where: {
            stock_id: isRecord[0].dataValues.stock_id,
            createdAt: {
              [Op.gte]: moment().set('date', 1 + i).subtract(1, 'days').endOf('day'),
              [Op.lt]: moment().set('date', 1 + i).add(1, 'days').startOf('day')
            }
          },
          order: [
            ['createdAt', 'DESC']
          ],
        });
        dataChart.push({
          'portfolio': isrealTime !== null ? isRecord[0].real_time_price_value : 0,
          'realTime': isrealTime !== null ? isrealTime.dataValues.current_price : 0,
          'time': moment().set('date', 1 + i).format('YYYY-MM-DD'),
        });

        if (moment().daysInMonth() === i + 1) {
          return res.status(200).json({
            message: "Chart data Found",
            data: dataChart
          });
        }
      }
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