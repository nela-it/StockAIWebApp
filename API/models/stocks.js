/**
 * stocks Schema
 */

"use strict";
module.exports = (sequelize, DataTypes) => {
  const stocks_Schema = sequelize.define("stocks", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    group_id: {
      type: DataTypes.BIGINT,
      foreignKey: true,
      allowNull: false
    },
    ticker: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ticker_image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stock_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    recommended_price: {
      type: DataTypes.STRING,
      allowNull: false
    },
    suggested_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    suggested_date_price: {
      type: DataTypes.STRING,
      allowNull: false
    },
    target_price: {
      type: DataTypes.STRING,
      allowNull: false
    },
    target_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return stocks_Schema;
};

/**
 * Generates password for the plain password.
 * @param password
 * @returns {string} - hashed password
 */
// User.prototype.generatePassword = function generatePassword(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

/**
 * Checks if the password matches the hash of password
 * @param password
 * @returns {boolean} - Returns true if password matches.
 */
// User.prototype.validPassword = function validPassword(password) {
//     return bcrypt.compareSync(password, this.password);
// };
