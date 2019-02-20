const db = require("../models/index");
const Real_time_price = db.Real_time_price;
const Op = db.Op;

exports.audit = (req, res, next) => {
  return res.status(400).json({
    message: "not found"
  });
};
