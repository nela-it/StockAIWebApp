const db = require("../models/index");
const paypal = require("paypal-rest-sdk");
const userService = require("../middleware/user.service");
const User = db.User;
const Payment = db.Payment;
const config = require("../config");
// User.sync({ force: true });

paypal.configure({
  mode: "sandbox",
  client_id: config.client_id,
  client_secret: config.client_secret
});

exports.payment = (req, res, next) => {
  create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal"
    },
    redirect_urls: {
      return_url: config.frontImage + "/successPayment/" + price + "/" + userID,
      cancel_url: "https://stockzai.com/#/apps/dashboards/analytics"
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: sku,
              price: price,
              currency: "USD",
              quantity: 1
            }
          ]
        },
        amount: {
          currency: "USD",
          total: price
        },
        description: "Hat for the best team ever"
      }
    ]
  };

  paypal.payment.create(create_payment_json, function(error, payment) {
    console.log(chalk.green("before payment -----------------", payment));
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.json({ payment_url: payment.links[i].href });
        }
      }
    }
  });
};
