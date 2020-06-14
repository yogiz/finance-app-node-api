const db = require("../models");
const User = db.user;
const Company = db.company;


exports.createCompany = (req, res) => {
  res.send("create Company.");
};

exports.updateCompany = (req, res) => {
    res.send("update Company.");
};

exports.addEmployee = (req, res) => {
    res.send("add Employee.");
};