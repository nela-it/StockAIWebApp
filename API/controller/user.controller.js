const db = require("../models/index");
const jwt = require("jsonwebtoken");
const config = require("../config");
const bcryptService = require("../middleware/bcryptService");
const userService = require("../middleware/user.service");
const mailService = require("../middleware/mailService");
const forgotPasswordTemplate = require("../middleware/templates");
const APIError = require("../helpers/APIError");
const httpStatus = require("http-status");
const User = db.User;
const Op = db.Op;
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");
const atob = require("atob");

exports.register = (req, res, next) => {
  if (req.body.apiType === "socialRegister") {
    let params = req.body.providerData;
    if (params.id && params.provider) {
      userService.check_auth_provider(params, next, (err, data) => {
        if (err) next(err);
        return res.status(data.status).json({
          message: data.message,
          token: data.token
        });
      });
    } else {
      return res.status(400).json({
        message: "Unauthorised Data"
      });
    }
  }
  if (req.body.apiType === "register") {
    let params = req.body;
    if (params.email && params.username && params.password) {
      userService.register(req.body, next, (err, data) => {
        if (err) next(err);
        return res.status(data.status).json({
          message: data.message,
          token: data.token
        });
      });
    } else {
      return res.status(400).json({
        message: "Unauthorised Data"
      });
    }
  }
};

exports.login = (req, res, next) => {
  if (req.body.apiType === "socialLogin") {
    let params = req.body.providerData;
    if (params.id && params.provider) {
      userService.check_auth_provider(
        req.body.providerData,
        next,
        (err, data) => {
          if (err) next(err);
          return res.status(data.status).json({
            message: data.message,
            token: data.token
          });
        }
      );
    } else {
      return res.status(400).json({
        message: "Unauthorised Data"
      });
    }
  }
  if (req.body.apiType === "login") {
    let params = req.body;
    if (params.username && params.password) {
      userService.login(req.body, next, (err, data) => {
        if (err) next(err);
        return res.status(data.status).json({
          message: data.message,
          token: data.token
        });
      });
    } else {
      return res.status(400).json({
        message: "Unauthorised Data"
      });
    }
  }
};

exports.forgotPassword = (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (user) {
        let template = forgotPasswordTemplate(
          config.frontImage + "ChangePassword/" + user.id
        );
        var mailOptions = {
          from: '"AI Stock" <support@aiStock.com>',
          to: req.body.email,
          subject: "Forgot Password",
          html: template
        };
        mailService.sendMail(mailOptions, (err, data) => {
          if (err) throw err;
          res.status(200).json({
            message: "mail send successfully"
          });
        });
      } else {
        return res.status(404).json({
          message: "Email Not Found"
        });
      }
    })
    .catch(e => {
      next(e);
    });
};

exports.changePassword = (req, res, next) => {
  // let decrypt = cryptr.decrypt(req.body.password);
  let decrypt = atob(req.body.password);
  let password = bcryptService.generateHash(decrypt);
  User.update(
    {
      password: password
    },
    {
      where: {
        id: { [Op.eq]: req.body.userId }
      }
    }
  )
    .then(user => {
      if (user) {
        return res.status(200).json({
          message: "Password reset successfully"
        });
      } else {
        return res.status(404).json({
          message: "Can't Reset Password"
        });
      }
    })
    .catch(e => {
      next(e);
    });
};

exports.getAllUser = (req, res, next) => {
  return res.status(200).json({
    message: "get all user",
    data: req.user
  });
};
