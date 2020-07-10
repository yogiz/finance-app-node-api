const controller = require("../controllers/company.controller");
const { verifyToken, isStaff, isAdmin } = require("../middleware/authJwt.js");


module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        // "x-access-token, Origin, Content-Type, Accept"
        "Authorization, Origin, Content-Type, Accept"
      );
      next();
    });
    app.post(
        "/api/company/create",
        verifyToken,
        controller.createCompany
    );
    
    // Invite an user to be employee in a company
    // companyId, email (who want to be invited), role (what role you want that user be)
    app.post(               
        "/api/company/invite",
        verifyToken,
        controller.inviteEmployee
    );

    // Accept Invitation 
    // companyId
    app.post(               
      "/api/company/acceptInvitation",
      verifyToken,
      controller.acceptInvitation
    );
};