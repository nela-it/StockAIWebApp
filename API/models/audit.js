/**
 * Audit Schema
 */

"use strict";
module.exports = (sequelize, DataTypes) => {
  const audit_Schema = sequelize.define(
    "audit",
    {
      audit_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      table_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      operation: {
        type: DataTypes.STRING,
        allowNull: false
      },
      contents: {
        type: DataTypes.STRING,
        allowNull: false
      },
      timestamp: {
        allowNull: false,
        type: DataTypes.DATE,
        default: DataTypes.DATE
      }
    },
    {}
  );

  return audit_Schema;
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
