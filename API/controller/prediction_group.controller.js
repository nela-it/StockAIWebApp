const db = require("../models/index");
const User = db.User;
const Prediction_group = db.Prediction_group;
const Stocks = db.Stocks;
const Op = db.Op;
const atob = require("atob");
const _ = require("underscore");
Stocks.belongsTo(Prediction_group, { foreignKey: "group_id" });

exports.saveGroupData = data => {
  //   console.log("data----", data);
  //   Prediction_group.sync({ force: true });
  //   Stocks.sync({ force: true });

  try {
    data.forEach(async (column, i) => {
      setTimeout(async () => {
        let isGroupExists = await Prediction_group.findAll({
          where: { group_id: column.GroupId }
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
            updateStocks(column);
          }
        } else {
          console.log("found");
          column.prediction_group_id = isGroupExists[0].dataValues.id;
          updateStocks(column);
        }
      }, 100 * i);
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
      current_price: column.prediction_group_id,
      suggested_date: column["Suggested Date"],
      suggested_date_price: column["Suggested Date Price"],
      target_price: column.TargetPrice,
      target_date: column["Target Date"],
      version: column.Version
    });
    console.log("Stock Created----");
  }
};

exports.getGroups = async (req, res, next) => {
  console.log("getGroups");
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
  console.log("exploreGroups");
  try {
    let isStockFound = await Stocks.findAll({
      where: { group_id: atob(req.body.group_id) },
      include: [Prediction_group]
    });
    if (isStockFound.length > 0) {
      return res.status(200).json({
        message: "Stocks Found",
        data: isStockFound
      });
    } else {
      return res.status(404).json({
        message: "Stocks Not Found"
      });
    }
  } catch (error) {
    next(error);
  }
};
