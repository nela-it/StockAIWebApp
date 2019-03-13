const db = require("../models/index");
const Product_info = db.Product_info;
const Op = db.Op;

exports.getProductInfo = async (req, res, next) => {
  try {
    let productInfo = await Product_info.findAll();
    if (productInfo.length > 0) {
      return res.status(200).json({
        message: "Product Info Found",
        data: productInfo
      });
    } else {
      return res.status(404).json({
        message: "Product Info Not Found"
      });
    }
  } catch (error) {
    console.log("error----------", error);
    next(error);
  }
};