const db = require("../models/index");
const User = db.User;
const Payment = db.Payment;
const Op = db.Op;
const jwt = require("jsonwebtoken");
const config = require("../config");
const bcryptService = require("../middleware/bcryptService");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");
const atob = require("atob");


exports.check_auth_provider = (params, next, cb) => {
  User.findOne({
    where: {
      [Op.and]: [{
          social_provider: params.provider
        },
        {
          provider_id: params.id
        }
      ]
    }
  }).then(user => {
    if (user) {
      checkSubscribed({
          user_id: user.dataValues.id
        },
        next,
        (err, isSubscribed) => {
          let token = jwt.sign({
              id: user.id,
              email: user.email,
              username: user.username
            },
            config.jwtSecret
          );
          let data = {
            status: 200,
            token: token,
            username: params.username,
            message: "Success",
            isSubscribed: err ? false : isSubscribed
          };
          cb(null, data);
        }
      );
    } else {
      User.create({
          email: params.email,
          username: params.username,
          social_provider: params.provider,
          provider_id: params.id
        })
        .then(result => {
          if (result) {
            let token = jwt.sign({
                id: result.id,
                email: result.email,
                username: result.username
              },
              config.jwtSecret
            );
            let data = {
              status: 200,
              token: token,
              username: params.username,
              message: "Success",
              isSubscribed: false
            };
            cb(null, data);
          } else {
            let data = {
              status: 404,
              token: null,
              username: null,
              message: "Attempt Failed"
            };
            cb(null, data);
          }
        })
        .catch(e => {
          next(e);
        });
    }
  });
};

exports.login = (params, next, cb) => {
  User.findOne({
      where: {
        [Op.or]: [{
          email: params.username
        }, {
          username: params.username
        }]
      }
    })
    .then(user => {
      if (user) {
        checkSubscribed({
            user_id: user.dataValues.id
          },
          next,
          (err, isSubscribed) => {
            let password = atob(params.password);
            if (
              user.password !== null &&
              bcryptService.validPassword(password, user.password)
            ) {
              let token = jwt.sign({
                  id: user.id,
                  email: user.email,
                  username: user.username
                },
                config.jwtSecret
              );
              let data = {
                status: 200,
                token: token,
                message: "Success",
                username: user.dataValues.username,
                isSubscribed: err ? false : isSubscribed
              };
              cb(null, data);
            } else {
              let data = {
                status: 404,
                token: null,
                username: null,
                message: "Entered Password is Wrong"
              };
              cb(null, data);
            }
          }
        );
      } else {
        let data = {
          status: 404,
          token: null,
          username: null,
          message: "Email Not Found"
        };
        cb(null, data);
      }
    })
    .catch(e => {
      next(e);
    });
};

exports.register = (params, next, cb) => {
  User.findOne({
      where: {
        [Op.or]: [{
          email: params.email
        }, {
          username: params.username
        }]
      }
    })
    .then(user => {
      if (user) {
        if (user.email === params.email) {
          let data = {
            status: 404,
            token: null,
            username: null,
            message: "Email Already Exists."
          };
          cb(null, data);
        } else {
          let data = {
            status: 404,
            token: null,
            username: null,
            message: "Username Already Exists."
          };
          cb(null, data);
        }
      } else {
        let decrypt = atob(params.password);
        let password = bcryptService.generateHash(decrypt);
        User.create({
            email: params.email,
            password: password,
            username: params.username
          })
          .then(result => {
            if (result) {
              let token = jwt.sign({
                  id: result.id,
                  email: result.email,
                  username: result.username
                },
                config.jwtSecret
              );
              let data = {
                status: 200,
                token: token,
                username: result.dataValues.username,
                message: "User Registered"
              };
              cb(null, data);
            } else {
              let data = {
                status: 404,
                token: token,
                username: null,
                message: "User Not Registered"
              };
              cb(null, data);
            }
          })
          .catch(e => {
            next(e);
          });
      }
    })
    .catch(e => {
      next(e);
    });
};

exports.isSubscribed = async (params, next, cb) => {
  try {
    let isPayment = await Payment.findOne({
      where: {
        user_id: params.user.id
      }
    });
    if (isPayment) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } catch (e) {
    next(e);
  }
};

checkSubscribed = async (params, next, cb) => {
  try {
    let isPayment = await Payment.findOne({
      where: {
        user_id: params.user_id
      }
    });
    if (isPayment) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } catch (e) {
    next(e);
  }
};

exports.checkSubscribedFn = checkSubscribed;