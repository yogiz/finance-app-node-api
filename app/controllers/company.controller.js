const db = require("../models");
const { COMPANY_ROLES, SENDGRID_EMAIL_FROM, SIGNUP_URL } = require("../../config.js");
const {sendEmailTemplate} = require("../utils")


const User = db.user;
const Company = db.company;
const Invitation = db.invitation;


exports.createCompany = (req, res) => {
    if(req.body.name){
        // create object user in company
        let users = {}
        users[req.userId] = COMPANY_ROLES[0]
        users = JSON.stringify(users)

        Company.create({
           name : req.body.name,
           description : req.body.description,
           category : req.body.category,
           address : req.body.address,
           phoneNumber : req.body.phoneNumber,
           website : req.body.website,
           owner : req.userId,
           users : users
        }).then((company) => {
            // set company id to user
            User.findByPk(req.userId).then((user) => {
                if(user){

                    let ownCompanies = user.ownCompanies ? JSON.parse(user.ownCompanies) : {};
                    ownCompanies[company.id] = company.name;
                    ownCompanies = JSON.stringify(ownCompanies)

                    let companies = user.companies ? JSON.parse(user.companies) : {};
                    companies[company.id] = company.name;
                    companies = JSON.stringify(companies)
                    
                    user.update({
                        ownCompanies : ownCompanies,
                        companies : companies,
                    })
                    res.send("create Company.");
                } else {
                    company.destroy()
                    res.status(500).send("User not found.");
                }
            })
        }).catch((err) => {
            res.status(500).send({err: err.messages, message :"create Company failed."});
        });
    }
};

exports.updateCompany = (req, res) => {
    res.send("update Company.");
};

exports.inviteEmployee = (req, res) => {
    
    Company.findByPk(req.body.companyId).then(
        (company) => {
            if(company){

                let users = JSON.parse(company.users)
                let owner_admin = [COMPANY_ROLES[0], COMPANY_ROLES[1]]

                // check if he is the owner or admin
                if(owner_admin.indexOf(users[req.userId]) >= 0){ 

                    // check if email already registered as user
                    User.findOne({ 
                        where : {
                            email : req.body.email
                        }
                    }).then((user)=> {
                        if(user){
                            // add new user to users column in that company
                            users[user.id] = COMPANY_ROLES[parseInt(req.body.role)]
                            users = JSON.stringify(users)
                            company.update({
                                users: users
                            }).then(()=>{
                                // add company id to companies column in user table
                                let companies = user.companies ? JSON.parse(user.companies) : {};
                                companies[company.id] = company.name;
                                companies = JSON.stringify(companies)
                                user.update({
                                    companies : companies
                                }).then(()=>{
                                    res.send({data : 0, msg : "User has been added"}) //  0 => added
                                })
                            }).catch((err)=>{
                                res.status(500).send(err.message)
                            })
                        } else { 
                            // if user not found, add to invite list and send email invitation
                            console.log(req)
                            let emailData =  {
                                receiver: req.body.email,
                                sender: SENDGRID_EMAIL_FROM,
                                templateName: 'employee_invitation',
                              }

                              let dynamic_data = {
                                company_name : company.name,
                                email_invitation_sender : req.email,
                                signup_url : SIGNUP_URL
                              }

                              sendEmailTemplate(emailData, dynamic_data).then((result)=>{
                                // add email and to invitaion table
                                Invitation.create({
                                    email : req.body.email,
                                    role : req.body.role,
                                    companyId: company.id,
                                    expirationDate: Date.now() + (72 * 3600000),
                                }).then(()=>{
                                    console.log("RESULT => ", result)
                                    res.send({data : 1, msg : "User has been invited", email_not_activated : result.email_not_activated}) //  1 => Invited
                                })
                              });
                        }
                    })
                } else {
                    res.status(401).send("User not authorized to do this action");
                }
            } else {
                res.status(401).send("Company not found");
            }
        }
    ).catch((err) => {
        res.status(500).send(err.message)
    })
};

exports.showInvitaion = (req, res) =>{

}

exports.acceptInvitation = (req, res) =>{
    // req.email
    Invitation.findOne({
        where : {
            // email : req.email,
            companyId : req.body.companyId
        }
    }).then((invitation) => {
        if(invitation && invitation.expirationDate > Date.now() ){
            // update company and user table

            Company.findByPk(invitation.companyId).then((company) => {

                let users = JSON.parse(company.users)
                // add new user to users column in that company
                users[req.userId] = COMPANY_ROLES[parseInt(invitation.role)]
                users = JSON.stringify(users)

                company.update({
                    users: users
                }).then(()=>{
                    User.findByPk(req.userId).then((user) => {
                        let companies = user.companies ? JSON.parse(user.companies) : {};
                        companies[req.body.companyId] = company.name;
                        companies = JSON.stringify(companies)
                        user.update({
                            companies : companies,
                        }).then(()=>{
                            invitation.destroy();
                            res.send("You have been added")
                        })
                    })
                })
            })

        } else {
            res.status(500).send({message :"No valid invitation or expired!"});
        }
    }).catch((err) => {
        res.status(500).send({err: err.messages, message :"Failed!"});
    });
}