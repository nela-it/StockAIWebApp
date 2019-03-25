const db = require("../models/index");
const Prediction_group = db.Prediction_group;
const Stocks = db.Stocks;
const realTimePrice = db.Real_time_price;
const userService = require("../middleware/user.service");
const checkPortfolio = require("./portfolio.controller").checkPortfolio;
const atob = require("atob");
Stocks.belongsTo(Prediction_group, { foreignKey: "group_id" });
Stocks.belongsTo(realTimePrice, { foreignKey: "realtime_price_id" });

// Stocks.sync({ force: true });
// realTimePrice.sync({ force: true });
// Prediction_group.sync({ force: true });

exports.saveGroupData = data => {
  try {
    data.forEach(async (column, i) => {
      setTimeout(async () => {
        let isGroupExists = await Prediction_group.findAll({
          where: {
            group_id: column.GroupId
          }
        });
        if (isGroupExists.length === 0) {
          console.log("not found");
          let isGroupCreated = await Prediction_group.create({
            group_id: column.GroupId,
            group_name: column.GroupName,
            group_image: column["Group Image File"]
          });
          if (isGroupCreated) {
            console.log("group created-------", isGroupCreated.dataValues.id);
            column.prediction_group_id = isGroupCreated.dataValues.id;
            await updateStocks(column);
          }
        } else {
          console.log("found", isGroupExists[0].dataValues.id);
          column.prediction_group_id = isGroupExists[0].dataValues.id;
          await updateStocks(column);
        }
      }, 200 * i);
    });
  } catch (error) {
    console.log("error----", error);
  }

  async function updateStocks(column) {
    let isStockCreate = await Stocks.create({
      group_id: column.prediction_group_id,
      ticker: column.Ticker,
      ticker_image: column["Ticker Image"],
      stock_name: column["Stock Name"],
      recommended_price: column.prediction_group_id,
      suggested_date: column["Suggested Date"],
      suggested_date_price: column["Suggested Date Price"],
      target_price: column.TargetPrice,
      target_date: column["Target Date"],
      version: column.Version
    });
    if (isStockCreate) {
      let updateRealtimePrice = await realTimePrice.create({
        stock_id: isStockCreate.dataValues.id
      });
      if (updateRealtimePrice) {
        await Stocks.update(
          {
            realtime_price_id: updateRealtimePrice.dataValues.id
          },
          { where: { id: isStockCreate.dataValues.id } }
        );
      }
    }
    console.log("Stock Created----", isStockCreate.dataValues.id);
  }
};

exports.getGroups = async (req, res, next) => {
  try {
    let isGroupsFound = await Prediction_group.findAll();
    if (isGroupsFound.length > 0) {
      return res.status(200).json({
        message: "Groups Found",
        data: isGroupsFound
      });
    } else {
      return res.status(404).json({
        message: "Groups Not Found"
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.exploreGroups = async (req, res, next) => {
  try {
    userService.isSubscribed(req, next, async (err, isSubscribed) => {
      let isStockFound;
      if (isSubscribed) {
        isStockFound = await Stocks.findAll({
          where: { group_id: atob(req.body.group_id) },
          include: [realTimePrice]
        });
      } else {
        isStockFound = await Stocks.findAll({
          where: { group_id: atob(req.body.group_id) },
          include: [realTimePrice],
          limit: 2
        });
      }

      if (isStockFound.length > 0) {
        checkPortfolio(req, async (err, getPortfolio) => {
          if (getPortfolio.length > 0) {
            isStockFound.forEach(async stock => {
              getPortfolio.forEach(async portfolio => {
                if (
                  stock.dataValues.id ===
                  portfolio.dataValues.real_time_price.dataValues.stock_id
                ) {
                  stock.dataValues.addedToPortfolio = true;
                } else {
                  if (stock.dataValues.addedToPortfolio !== true) {
                    stock.dataValues.addedToPortfolio = false;
                  }
                }
              });
            });
            return await res.status(200).json({
              message: "Stocks Found",
              data: isStockFound,
              isSubscribed: isSubscribed
            });
          } else {
            isStockFound.forEach(async (stock, i) => {
              stock.dataValues.addedToPortfolio = false;
            });
            return await res.status(200).json({
              message: "Stocks Found",
              data: isStockFound,
              isSubscribed: isSubscribed
            });
          }
        });
      } else {
        return await res.status(404).json({
          message: "Stocks Not Found"
        });
      }
    });
  } catch (error) {
    next(error);
  }
};
