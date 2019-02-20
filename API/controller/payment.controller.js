const db = require("../models/index");
const Payment = db.Payment;
const Op = db.Op;

exports.audit = (req, res, next) => {
  return res.status(400).json({
    message: "not found"
  });
};
