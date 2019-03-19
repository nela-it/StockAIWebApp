const db = require("../models/index");
const paypal = require("paypal-rest-sdk");
const Payment = db.Payment;
const config = require("../config");
// Payment.sync({ force: true });

paypal.configure({
  mode: "sandbox",
  client_id: config.client_id,
  client_secret: config.client_secret
});

exports.payment = async (req, res, next) => {
  let price = 5,
    create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal"
      },
      redirect_urls: {
        return_url: `${config.frontImage}/api/payment/successPayment?userId=${
          req.user.id
        }`,
        cancel_url: `${config.frontImage}/#/apps/dashboards/analytics`
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "AI Stock Subscribe Pro",
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
          description: "Subscribe Pro for Stock AI."
        }
      ]
    };

  try {
    paypal.payment.create(create_payment_json, function(error, payment) {
      if (error) {
        console.log("error -----> ", error);
        next(error);
      } else {
        payment.links.forEach(link => {
          link.rel === "approval_url" ? res.redirect(link.href) : null;
        });
      }
    });
  } catch (e) {
    console.log("error ----- ", e);
    next(e);
  }
};

exports.successPayment = async (req, res, next) => {
  try {
    let createPayment = await Payment.create({
      user_id: req.query.userId,
      transaction_id: req.query.paymentId,
      subscription_plan: "Subscribe Pro",
      subscription_amount: "5",
      subscription_details: JSON.stringify(req.query),
      timestamp: Date()
    });
    if (createPayment) {
      console.log("payment successfull");
      res.send(
        `<b>Subscription Payment Successfull</b><br /> return to profile <a href='${
          config.frontImage
        }'>Click here...</a>`
      );
    } else {
      res.status(404).json({
        message: "Subscription failed"
      });
    }
  } catch (e) {
    console.log("e-----------", e);
    next(e);
  }
};
