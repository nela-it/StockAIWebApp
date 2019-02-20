/**
 * real_time_price Schema
 */

"use strict";
module.exports = (sequelize, DataTypes) => {
  const real_time_price_Schema = sequelize.define(
    "real_time_price",
    {
      real_time_price_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      stock_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      current_price: {
        type: DataTypes.STRING,
        allowNull: false
      },
      timestamp: {
        allowNull: false,
        type: DataTypes.DATE,
        default: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        default: DataTypes.DATE
      }
    },
    {}
  );

  return real_time_price_Schema;
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
