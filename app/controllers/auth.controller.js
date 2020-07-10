const db = require("../models");
const { JWT_SECRET, SENDGRID_EMAIL_FROM } = require("../../config.js");
const User = db.user;
const Role = db.role;
const {generateToken, sendEmailTemplate} = require("../utils")
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles && req.body.roles[0] != 'user') {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            user.isVerified = true
            user.save().then(() => {
              res.send({ message: "Register new Account Success", needVerify : false});
            });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          let verifyToken = generateToken()
          user.createToken({
            tokenKey : verifyToken,
            type : 1,
            expirationDate: Date.now() + 3600000,
          }).then(() => {

            let emailData =  {
              receiver: user.email,
              sender: SENDGRID_EMAIL_FROM,
              templateName: 'confirm_account',
            }
            let dynamic_data = {
              name: user.username,
              confirm_account_url:  "http://"+req.headers.host+"/api/runTokenAction/?token="+ verifyToken,
            }
            
            sendEmailTemplate(emailData, dynamic_data).then((result)=>{
              res.send({ message: "User registered successfully!", needVerify : true, email_not_activated : result.email_not_activated});
            });

          });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      if(!user.isVerified){
        res.status(401).send({
          message:"User still not verified, please check your email to verify. Or generate another verification email."
        });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.initSuperAdmin = (username, email, password) => {
  
  // Save User to Database
  User.create({
    username: username,
    email: email,
    password: bcrypt.hashSync(password, 8),
    isVerified: true
  })
    .then(user => {
      Role.findAll({
        where: {
          name: {
            [Op.or]: ["superadmin"]
          }
        }
      }).then(roles => {
        user.setRoles(roles)
      });
    })
    .catch(err => {
      console.log("create superadmin failed.")
    });
};
