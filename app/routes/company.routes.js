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
        controller.createCompany
    );
};