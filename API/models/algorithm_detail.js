/**
 * Audit Schema
 */

"use strict";
module.exports = (sequelize, DataTypes) => {
  const algorithm_detail_Schema = sequelize.define("algorithm_detail", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    group_id: {
      type: DataTypes.INTEGER,
      foreignKey: true,
      allowNull: false
    },
    step_no: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    step_details: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  return algorithm_detail_Schema;
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