const db = require("../models/index");
const jwt = require("jsonwebtoken");
const config = require("../config");
const bcryptService = require("../middleware/bcryptService");
const APIError = require("../helpers/APIError");
const httpStatus = require("http-status");
const User = db.User;
const Op = db.Op;

exports.register = (req, res, next) => {
  User.findOne({
    where: {
      [Op.or]: [{ email: req.body.email }, { username: req.body.username }]
    }
  })
    .then(user => {
      if (user) {
        if (user.email === req.body.email) {
          return res.status(404).json({
            message: "email Already Exists."
          });
        } else {
          return res.status(404).json({
            message: "Username Already Exists."
          });
        }
      } else {
        let password = bcryptService.generateHash(req.body.password);
        User.create({
          email: req.body.email,
          password: password,
          username: req.body.username
        })
          .then(result => {
            return res.status(200).json({
              message: result
            });
          })
          .catch(e => {
            sendError(res);
          });
      }
    })
    .catch(e => {
      sendError(res);
    });
};

exports.login = (req, res, next) => {
  User.findone({
    where: {
      [Op.or]: [{ email: req.body.username }, { username: req.body.username }]
    }
  })
    .then(user => {
      if (user) {
        if (bcryptService.validPassword(req.body.password, user.password)) {
          let token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              username: user.username
            },
            config.jwtSecret
          );
          return res.status(200).json({
            message: "User Found",
            token: token
          });
        } else {
          // return Promise.reject(
          //   new APIError("Unauthorised User", httpStatus.NOT_FOUND, true)
          // );
          return res.status(404).json({
            message: "Entered Password is Wrong"
          });
        }
      } else {
        return res.status(404).json({
          message: "user not found"
        });
      }
    })
    .catch(e => {
      next(e);
      // sendError(res);
    });
};

exports.getAllUser = (req, res, next) => {
  return res.status(200).json({
    message: "get all user",
    data: req.user
  });
};

function sendError(res) {
  return res.status(400).json({
    message: "not found"
  });
}
