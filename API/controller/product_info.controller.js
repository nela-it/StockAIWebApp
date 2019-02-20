const db = require("../models/index");
const Product_info = db.Product_info;
const Op = db.Op;

exports.audit = (req, res, next) => {
  return res.status(400).json({
    message: "not found"
  });
};
