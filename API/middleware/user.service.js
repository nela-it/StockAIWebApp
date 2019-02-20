const db = require("../models/index");
const User = db.User;
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
      [Op.and]: [
        { social_provider: params.provider },
        { provider_id: params.id }
      ]
    }
  }).then(user => {
    if (user) {
      let token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username
        },
        config.jwtSecret
      );
      let data = {
        status: 200,
        token: token,
        message: "Success"
      };
      cb(null, data);
    } else {
      User.create({
        email: params.email,
        username: params.username,
        social_provider: params.provider,
        provider_id: params.id
      })
        .then(result => {
          if (result) {
            let token = jwt.sign(
              {
                id: result.id,
                email: result.email,
                username: result.username
              },
              config.jwtSecret
            );
            let data = {
              status: 200,
              token: token,
              message: "Success"
            };
            cb(null, data);
          } else {
            let data = {
              status: 404,
              token: null,
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
      [Op.or]: [{ email: params.username }, { username: params.username }]
    }
  })
    .then(user => {
      if (user) {
        // let password = cryptr.decrypt(params.password);
        let password = atob(params.password);
        if (
          user.password !== null &&
          bcryptService.validPassword(password, user.password)
        ) {
          let token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              username: user.username
            },
            config.jwtSecret
          );
          let data = {
            status: 200,
            token: token,
            message: "Success"
          };
          cb(null, data);
        } else {
          let data = {
            status: 404,
            token: null,
            message: "Entered Password is Wrong"
          };
          cb(null, data);
        }
      } else {
        let data = {
          status: 404,
          token: null,
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
      [Op.or]: [{ email: params.email }, { username: params.username }]
    }
  })
    .then(user => {
      if (user) {
        if (user.email === params.email) {
          let data = {
            status: 404,
            token: null,
            message: "email Already Exists."
          };
          cb(null, data);
        } else {
          let data = {
            status: 404,
            token: null,
            message: "Username Already Exists."
          };
          cb(null, data);
        }
      } else {
        // User.sync({ force: true }).then(() => {
        // let decrypt = cryptr.decrypt(params.password);
        let decrypt = atob(params.password);
        let password = bcryptService.generateHash(decrypt);
        User.create({
          email: params.email,
          password: password,
          username: params.username
        })
          .then(result => {
            if (result) {
              let token = jwt.sign(
                {
                  id: result.id,
                  email: result.email,
                  username: result.username
                },
                config.jwtSecret
              );
              let data = {
                status: 200,
                token: token,
                message: "User Registered"
              };
              cb(null, data);
            } else {
              let data = {
                status: 404,
                token: token,
                message: "User Not Registered"
              };
              cb(null, data);
            }
          })
          .catch(e => {
            // console.log(e);
            // return Promise.reject(
            //   new APIError(
            //     "Something Went Wrong",
            //     httpStatus.BAD_REQUEST,
            //     true
            //   )
            // );
            next(e);
          });
        // });
      }
    })
    .catch(e => {
      next(e);
    });
};