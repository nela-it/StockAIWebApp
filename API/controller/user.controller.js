const db = require("../models/index");
const config = require("../config");
const bcryptService = require("../middleware/bcryptService");
const userService = require("../middleware/user.service");
const mailService = require("../middleware/mailService");
const forgotPasswordTemplate = require("../middleware/templates");
const APIError = require("../helpers/APIError");
const httpStatus = require("http-status");
const User = db.User;
const Op = db.Op;
const atob = require("atob");
const btoa = require("btoa");
// User.sync({ force: true });

exports.register = (req, res, next) => {
  if (req.body.apiType === "socialRegister") {
    let params = req.body.providerData ? req.body.providerData : {};
    if (params.id && params.provider) {
      userService.check_auth_provider(params, next, (err, data) => {
        if (err) next(err);
        return res.status(data.status).json({
          message: data.message,
          token: data.token,
          username: data.username
        });
      });
    } else {
      return res.status(400).json({
        message: "Unauthorized Data"
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
          token: data.token,
          username: data.username
        });
      });
    } else {
      return res.status(400).json({
        message: "Unauthorized Data"
      });
    }
  }
};

exports.login = (req, res, next) => {
  if (req.body.apiType === "socialLogin") {
    let params = req.body.providerData ? req.body.providerData : {};
    if (params.id && params.provider) {
      userService.check_auth_provider(
        req.body.providerData,
        next,
        (err, data) => {
          if (err) next(err);
          return res.status(data.status).json({
            message: data.message,
            token: data.token,
            username: data.username
          });
        }
      );
    } else {
      return res.status(400).json({
        message: "Unauthorized Data"
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
          token: data.token,
          username: data.username
        });
      });
    } else {
      return res.status(400).json({
        message: "Unauthorized Data"
      });
    }
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    let isUser = await User.findOne({
      where: { email: req.body.email }
    });
    if (isUser) {
      let template = forgotPasswordTemplate(
        config.frontImage + "#/pages/auth/reset-password/" + isUser.id
      );
      var mailOptions = {
        from: '"AI Stock" <support@aiStock.com>',
        to: req.body.email,
        subject: "Forgot Password",
        html: template
      };
      mailService.sendMail(mailOptions, (err, data) => {
        if (err) next(err);
        isUser.update({ forgotPassword: "true" });
        res.status(200).json({
          message: "mail send successfully"
        });
      });
    } else {
      return res.status(404).json({
        message: "Email Not Found"
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    let isUser = await User.findOne({ where: { id: req.body.userId } });
    if (isUser) {
      if (isUser.dataValues.forgotPassword === "true") {
        let decrypt = atob(req.body.password);
        let password = bcryptService.generateHash(decrypt);
        isUser.update({
          password: password,
          forgotPassword: "false"
        });
        return res.status(200).json({
          message: "Password reset successfully"
        });
      } else {
        return res.status(404).json({ message: "Password Is Already Changed" });
      }
    } else {
      return res.status(404).json({ message: "User Not Found" });
    }
  } catch (error) {
    next(error);
  }
};

exports.getAllUser = (req, res, next) => {
  return res.status(200).json({
    message: "get all user",
    data: req.user
  });
};
