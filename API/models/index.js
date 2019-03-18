"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const basename = path.basename(__filename);
const {
  db: dbConfig,
  env
} = require("../config/index");
const db = {};

let sequelize;

sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false,
    freezeTableName: true,
    operatorsAliases: false
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(`Successfully connected to the DB...`);
  })
  .catch(e => {
    console.log(`Error while connecting to the DB ${e}`);
  });

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    const model = sequelize["import"](path.join(__dirname, file));

    db[model.name] = model;
  });

// trigger's Declaration
// sequelize.query(
//   'CREATE TRIGGER `afterInsertUser` AFTER INSERT ON `users` FOR EACH ROW INSERT INTO audits VALUES(null, "users", NEW.id, "INSERT", "New User Created", NOW(),NOW(),NOW())'
// );
// sequelize.query(
//   'CREATE TRIGGER `afterUpdateUser` AFTER UPDATE ON `users` FOR EACH ROW INSERT INTO audits VALUES(null, "users", NEW.id, "UPDATE", "Updated User Details", NOW(),NOW(),NOW())'
// );
// sequelize.query(
//   'CREATE TRIGGER `beforeDeletUser` BEFORE DELETE ON `users` FOR EACH ROW INSERT INTO audits VALUES(null, "users", OLD.id, "DELETE", "User Deleted", NOW(),NOW(),NOW())'
// );
// sequelize.query(
//   'CREATE TRIGGER `afterInsertPortfolio` AFTER INSERT ON `portfolios` FOR EACH ROW INSERT INTO audits VALUES(null, "portfolios", NEW.user_id, "INSERT", "Inserted Stock in to Portfolio", NOW(),NOW(),NOW())'
// );
// sequelize.query(
//   'CREATE TRIGGER `beforeDeletePortfolio` BEFORE DELETE ON `portfolios` FOR EACH ROW INSERT INTO audits VALUES(null, "portfolios", OLD.user_id, "DELETE", "Removed Stock from Portfolio", NOW(),NOW(),NOW())'
// );
// sequelize.query(
//   'CREATE TRIGGER `afterInsertPayment` AFTER INSERT ON `payments` FOR EACH ROW INSERT INTO audits VALUES(null, "payments", NEW.user_id, "INSERT", "Inserted Stock in to Portfolio", NOW(),NOW(),NOW())'
// );

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.Op = Op;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("../models/User")(sequelize, Sequelize);
db.Audit = require("../models/audit")(sequelize, Sequelize);
db.Payment = require("../models/payment")(sequelize, Sequelize);
db.Portfolio = require("../models/portfolio")(sequelize, Sequelize);
db.Prediction_group = require("../models/Prediction_group")(
  sequelize,
  Sequelize
);
db.Product_info = require("../models/product_info")(sequelize, Sequelize);
db.Real_time_price = require("../models/real_time_price_table")(
  sequelize,
  Sequelize
);
db.Stocks = require("../models/stocks")(sequelize, Sequelize);
db.Algorithm_detail = require("../models/algorithm_detail")(
  sequelize,
  Sequelize
);
db.Stock_history = require("../models/stock_history")(sequelize, Sequelize);

module.exports = db;