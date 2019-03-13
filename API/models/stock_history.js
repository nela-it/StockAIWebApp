/**
 * Audit Schema
 */

"use strict";
module.exports = (sequelize, DataTypes) => {
  const stock_history = sequelize.define("stock_history", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ticker_id: {
      type: DataTypes.BIGINT,
      foreignKey: true,
      allowNull: false
    },
    closing_price: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      allowNull: false,
      type: DataTypes.DATE,
      default: DataTypes.DATE
    }
  });

  return stock_history;
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
