const db = require("../models/index");
const Prediction_group = db.Prediction_group;
const Op = db.Op;

exports.audit = (req, res, next) => {
  return res.status(400).json({
    message: "not found"
  });
};
