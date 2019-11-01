const db = require("../models/index");
const AlertNotify = db.alertNotify;
const Op = db.Op;
const User = db.User;
const _ = require("lodash");
AlertNotify.belongsTo(User, {
    foreignKey: 'user_id'
})

exports.getAlertNotify = async (req, res, next) => {
    try {
        let AlertNotifys = await AlertNotify.findAll({
            attributes: ['id', 'message', 'messageType', 'user_id'],
        });
        if (AlertNotifys.length > 0) {
            let alertNtfy = [];
            AlertNotifys.map((value, i) => {
                if (_.includes(JSON.parse(value.dataValues.user_id), req.user.id) || value.dataValues.user_id === "0") {
                    alertNtfy.push(value.dataValues)
                }
            })
            return res.status(200).json({
                message: "AlertNotifys Found",
                data: alertNtfy
            });
        } else {
            return res.status(200).json({
                message: "AlertNotifys Not Found"
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};