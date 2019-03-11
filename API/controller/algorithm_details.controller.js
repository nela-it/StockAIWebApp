const db = require("../models/index");
const Algorithm_detail = db.Algorithm_detail;
const Prediction_group = db.Prediction_group;
const Op = db.Op;
// Algorithm_detail.sync({ force: true });

exports.getAlgorithm = async (req, res, next) => {
  try {
    let isGroup = await Prediction_group.findOne({
      where: { id: req.body.groupId }
    });
    if (isGroup) {
      let isAlgorithm = await Algorithm_detail.findAll({
        where: { group_id: req.body.groupId }
      });
      if (isAlgorithm.length > 0) {
        return res.status(200).json({
          message: "Algorithm Found",
          data: isAlgorithm
        });
      } else {
        return res.status(200).json({
          message: "Algorithm Not Found"
        });
      }
    } else {
      return res.status(400).json({
        message: "Group Not Found"
      });
    }
  } catch (error) {
    next(error);
  }
};
