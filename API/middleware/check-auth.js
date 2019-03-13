const jwt = require("jsonwebtoken");
const config = require("../config/index");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret);
      console.log("dd", decoded);
      req.user = decoded;
      next();
    } else {
      return res.status(404).json({
        message: "Token Not Provided ."
      });
    }
  } catch (error) {
    return res.status(401).json({
      error: {
        message: error.message
      }
    });
  }
};