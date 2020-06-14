const db = require("../models");
const User = db.user;


exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};


exports.uploadProfileImage = (req, res) => {
  // console.log(req.file);
  if(!req.file) {
    res.status(500).send({message: "fail uploading!"});
  } else {
    let fileUrl = "http://"+ req.headers.host + "/profiles/" + req.file.filename;
    User.findByPk(req.userId).then(
      (user) => {
        if(user){
          user.update({
            profileImage : fileUrl || user.profileImage,
          }).then(()=>{
            res.send({message: "Update profile image succeed"})
          })
        } else {
          res.status(500).send({message: "User not found"});
        }
      }
    );
  }
};

exports.updateProfile = (req, res) => {
  if(!req.userId) {
    res.status(500).send({message: "User not found"});
  } else {
    // update profile disini
    User.findByPk(req.userId).then(
      (user) => {
        if(user){
          user.update({
            firstName : req.body.firstName || user.firstName,
            lastName : req.body.lastName || user.lastName,
            bio : req.body.bio || user.bio,
            adress : req.body.adress || user.adress,
            phoneNumber : req.body.phoneNumber || user.phoneNumber
          }).then(()=>{
            res.send({message: "Update profile succeed"})
          })
        } else {
          res.status(500).send({message: "User not found"});
        }

      }
    );
  }

};