const crypto = require('crypto')
const sgMail = require('@sendgrid/mail');
const { SENDGRID_API_KEY, SENDGRID_TEMPLATE } = require("../../config.js");

sgMail.setApiKey(SENDGRID_API_KEY);

exports.generateToken = () => {
    return crypto.randomBytes(20).toString('hex');
}

exports.sendEmail = (mailOptions) => {
    return new Promise((resolve, reject) => {
        sgMail.send(mailOptions, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        });
    });
}

exports.sendEmailTemplate = (data) => {
    const msg = {
        to: data.receiver,
        from: data.sender,
        templateId: SENDGRID_TEMPLATE[data.templateName],      
        dynamic_template_data: {
            name: data.name,
            confirm_account_url:  data.confirm_account__url,
        }   
    };

    return new Promise((resolve, reject) => {
        sgMail.send(msg, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        });
    });
}