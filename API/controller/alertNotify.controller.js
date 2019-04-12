const db = require("../models/index");
const AlertNotify = db.alertNotify;
const Op = db.Op;

exports.getAlertNotify = async (req, res, next) => {
    try {
        let AlertNotifys = await AlertNotify.findAll({
            attributes: ['id', 'message', 'messageType']
        });
        if (AlertNotifys.length > 0) {
            return res.status(200).json({
                message: "AlertNotifys Found",
                data: AlertNotifys
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