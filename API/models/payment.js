/**
 * payment Schema
 */

"use strict";
module.exports = (sequelize, DataTypes) => {
  const payment_Schema = sequelize.define("payment", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      foreignKey: true,
      allowNull: false
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subscription_plan: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subscription_amount: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subscription_details: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    timestamp: {
      allowNull: false,
      type: DataTypes.DATE,
      default: DataTypes.DATE
    }
  });

  return payment_Schema;
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
