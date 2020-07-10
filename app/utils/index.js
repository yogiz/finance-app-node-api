const crypto = require('crypto')
const sgMail = require('@sendgrid/mail');
const { SENDGRID_API_KEY, SENDGRID_TEMPLATE, ACTIVATE_EMAIL} = require("../../config.js");

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

exports.sendEmailTemplate = (data, dynamic_data ) => {
    if (!ACTIVATE_EMAIL){   // if email function not activate send back email data.
        return new Promise((resolve, reject) => {
            if(!dynamic_data) reject({email_not_activated : "no email data!"});
            return resolve({email_not_activated : dynamic_data});
        });
    } else {
        const msg = {
            to: data.receiver,
            from: data.sender,
            templateId: SENDGRID_TEMPLATE[data.templateName],      
            dynamic_template_data: dynamic_data 
        };
    
        return new Promise((resolve, reject) => {
            sgMail.send(msg, (error, result) => {
                if (error) return reject(error);
                return resolve(result);
            });
        });
    }

}