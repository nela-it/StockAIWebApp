const jwt = require("jsonwebtoken");
const config = require("../config/index");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        message: error.message
      }
    });
  }
};
