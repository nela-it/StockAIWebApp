/**
 * User Schema
 */

"use strict";
module.exports = (sequelize, DataTypes) => {
  const userSchema = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true
      },
      contact_no: {
        type: DataTypes.STRING,
        allowNull: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      social_provider: {
        type: DataTypes.STRING,
        allowNull: true
      },
      provider_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      user_role: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isActive: {
        type: DataTypes.STRING,
        allowNull: true
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

  return userSchema;
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
