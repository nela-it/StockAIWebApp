const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dev@jacksolutions.biz',
        pass: 'SupporT12#'
    }
});

module.exports = transporter;