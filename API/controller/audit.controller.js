const db = require("../models/index");
const Audit = db.Audit;
Audit.sync({ force: true });
const Op = db.Op;

exports.audit = (req, res, next) => {
  return res.status(400).json({
    message: "not found"
  });
};
