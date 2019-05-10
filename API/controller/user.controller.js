const db = require("../models/index");
const config = require("../config");
const bcryptService = require("../middleware/bcryptService");
const userService = require("../middleware/user.service");
const mailService = require("../middleware/mailService");
const forgotPasswordTemplate = require("../middleware/templates");
const fs = require("fs");
const chokidar = require("chokidar");
const XLSX = require("xlsx");
const service = require("./prediction_group.controller");
const stockService = require("./stocks.controller")
  .updateRealtimePrice;
const User = db.User;
const Payment = db.Payment;
const atob = require("atob");
const btoa = require("btoa");


// User.sync({
//   force: true
// });

exports.register = (req, res, next) => {
  if (req.body.apiType === "socialRegister") {
    let params = req.body.providerData ? req.body.providerData : {};
    if (params.id && params.provider) {
      userService.check_auth_provider(params, next, (err, data) => {
        if (err) next(err);
        return res.status(data.status).json({
          message: data.message,
          token: data.token,
          username: data.username,
          isSubscribed: data.isSubscribed
        });
      });
    } else {
      return res.status(400).json({
        message: "Unauthorized Data"
      });
    }
  } else if (req.body.apiType === "register") {
    let params = req.body;
    if (params.email && params.username && params.password) {
      userService.register(req.body, next, (err, data) => {
        if (err) next(err);
        return res.status(data.status).json({
          message: data.message,
          token: data.token,
          username: data.username,
          isSubscribed: false
        });
      });
    } else {
      return res.status(400).json({
        message: "Unauthorized Data"
      });
    }
  } else {
    return res.status(400).json({
      message: "Unauthorized apiType"
    });
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
            username: data.username,
            isSubscribed: data.isSubscribed
          });
        }
      );
    } else {
      return res.status(400).json({
        message: "Unauthorized Data"
      });
    }
  } else if (req.body.apiType === "login") {
    let params = req.body;
    if (params.username && params.password) {
      userService.login(req.body, next, (err, data) => {
        if (err) next(err);
        return res.status(data.status).json({
          message: data.message,
          token: data.token,
          username: data.username,
          isSubscribed: data.isSubscribed
        });
      });
    } else {
      return res.status(400).json({
        message: "Unauthorized Data"
      });
    }
  } else {
    return res.status(400).json({
      message: "Unauthorized apiType"
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    let isUser = await User.findOne({
      where: {
        email: req.body.email
      }
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
        isUser.update({
          forgotPassword: "true"
        });
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
    let isUser = await User.findOne({
      where: {
        id: req.body.userId
      }
    });
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
        return res.status(404).json({
          message: "Password Is Already Changed"
        });
      }
    } else {
      return res.status(404).json({
        message: "User Not Found"
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.userInfo = async (req, res, next) => {
  try {
    let isUser = await User.findOne({
      where: {
        id: req.user.id
      }
    });
    if (isUser) {
      let isPayment = await Payment.findOne({
        where: {
          user_id: req.user.id
        }
      });
      if (isPayment) {
        return res.status(200).json({
          message: "User Found",
          data: {
            username: isUser.dataValues.username,
            email: isUser.dataValues.email,
            address: isUser.dataValues.address,
            contact_no: isUser.dataValues.contact_no,
            isAdmin: isUser.dataValues.isAdmin
          },
          payment_detail: isPayment
        });
      } else {
        return res.status(200).json({
          message: "User Found",
          data: {
            username: isUser.dataValues.username,
            email: isUser.dataValues.email,
            address: isUser.dataValues.address,
            contact_no: isUser.dataValues.contact_no,
            isAdmin: isUser.dataValues.isAdmin
          },
          payment_detail: {}
        });
      }
    } else {
      return res.status(404).json({
        message: "User Not Found"
      });
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

exports.fileUpload = (req, res, next) => {
  let fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', (fieldname, file, filename) => {
    if (filename.split(".")[1] === "xlsx" || filename.split(".")[1] === "xls") {
      fstream = fs.createWriteStream('./files/' + filename);
      file.pipe(fstream);
      fstream.on('close', () => {
        let watcher = chokidar.watch("./files", {
          persistent: true
        });
        watcher.on("add", async (path) => {
          if (path.split(".")[1] === "xlsx" || path.split(".")[1] === "xls") {
            let workbook = XLSX.readFile(`./${path}`, {
              cellDates: true,
              cellText: false
            });
            let sheet_name_list = workbook.SheetNames;
            let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            console.log("excel sheet name", sheet_name_list[0]);
            let groupData = await service.saveGroupData(data);
            // await stockService();
            console.log('groupData', groupData)
            if (groupData === true) {
              var filePath = './files/' + filename;
              fs.unlinkSync(filePath);

              res.status(200).json({
                sucess: true,
                message: 'File uploaded successfully'
              });
            } else if (groupData === false) {
              var filePath = './files/' + filename;
              fs.unlinkSync(filePath);

              res.status(200).json({
                sucess: false,
                message: 'Uploaded file records are incorrect'
              });
            }
          }
        });
      });
    } else {
      res.status(200).json({
        sucess: false,
        message: 'Please upload excel sheet file.'
      });
    }
  });
};