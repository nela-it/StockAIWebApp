/**
 * Audit Schema
 */

"use strict";
module.exports = (sequelize, DataTypes) => {
    const alertNotify_Schema = sequelize.define("alertNotification", {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        message: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        messageType: {
            type: DataTypes.TEXT,
            allowNull: false
        }
        // user_id: {
        //     type: DataTypes.BIGINT,
        //     foreignKey: true,
        //     allowNull: false
        // }
    });

    return alertNotify_Schema;
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