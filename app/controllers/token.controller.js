const db = require("../models");
const { SENDGRID_EMAIL_FROM } = require("../../config.js");
const User = db.user;
const Token = db.token;
const {generateToken, sendEmailTemplate} = require("../utils");
var bcrypt = require("bcryptjs");



exports.tokenAction = async (req, res) => {
    let token = req.query.token
    Token.findByPk(token)
    .then(data => {
        if(data){
            if(data.expirationDate > Date.now()){
                if(data.type == 1) { verifyUser(data, req, res);
                } else if(data.type == 2){ ConfirmResetPassword(data, req, res);
                } else {res.status(400).send({ message: "Token Invalid" });}
            } else { res.status(400).send({ message: "Token Expired" }); }
        } else {
            res.status(400).send({ message: "Token Invalid" });
        }
    }).catch(err=>{
        res.status(500).send({ message: "Token Invalid" });
    });
}

exports.getResetToken = (req, res) => {
    User.findOne({where : {email : req.body.email}}).then(user => {
        Token.destroy({where : {userId: user.id, type:2}})   // remove if there is current resetToken in db
        let resetToken = generateToken()
        user.createToken({
            tokenKey : resetToken,
            type : 2,
            expirationDate: Date.now() + 3600000,
        }).then(()=>{
            let emailData =  {
                receiver: user.email,
                sender: SENDGRID_EMAIL_FROM,
                templateName: 'password_reset',
                name: user.username,
                confirm_account__url: "http://"+req.headers.host+"/api/runTokenAction/?token="+ resetToken,
            }
            sendEmailTemplate(emailData).then((result)=>{
                res.send({message: "Token Created, check your email."});
            });
        })
    }).catch(err=>{
        res.status(500).send({ message: "Can't find your account" });
    });
}

exports.resetPassword = (req, res) => {
    // first, confirm resetToken is valid
    let resetToken = req.body.resetToken
    Token.findByPk(resetToken)
    .then(token => {
        if(token && token.type == 2){
            if(token.expirationDate > Date.now()){
                User.update(
                    {password: bcrypt.hashSync(req.body.password, 8)},
                    {where: {id : token.userId}}
                ).then(()=>{
                    token.destroy();
                    res.send({ message: "Password has been reset. You can login again now!"});
                })
            } else {res.status(400).send({ message: "Token Expired" });}
        } else {res.status(400).send({ message: "Token Invalid" });}
    }).catch(err=>{
        res.status(500).send({ message: "Token Invalid" });
    });
}

function verifyUser(data, req, res) {
    User.update(
        {isVerified: true},
        {where: {id : data.userId}}
    ).then(() => {
        Token.destroy({where: { tokenKey: data.tokenKey}})
        res.send({ message: "User Verified"}); 
    }).catch(err => {
        res.status(500).send({ message: "Token Invalid"});
    })
}

function ConfirmResetPassword(data, req, res) {
    res.send({ message: "Ok, fill form to update password", resetToken : data.tokenKey});
}
