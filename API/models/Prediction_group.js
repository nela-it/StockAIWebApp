/**
 * Prediction_group_Schema Schema
 */

"use strict";
module.exports = (sequelize, DataTypes) => {
  const Prediction_group_Schema = sequelize.define(
    "Prediction_group",
    {
      Group_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      group_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      group_image: {
        type: DataTypes.STRING,
        allowNull: false
      },
      group_description: {
        type: DataTypes.STRING,
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

  return Prediction_group_Schema;
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
