/**
 * portfolio Schema
 */

"use strict";
module.exports = (sequelize, DataTypes) => {
  const portfolio_Schema = sequelize.define(
    "portfolio",
    {
      portfolio_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      real_time_price_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      createdAt: {
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

  return portfolio_Schema;
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
