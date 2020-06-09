const { checkDuplicateUsernameOrEmail } = require("../middleware/verifySignUp.js");
const { verifyToken, isSuperAdminOrAdmin, isSuperAdmin } = require("../middleware/authJwt.js");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      // "x-access-token, Origin, Content-Type, Accept"
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/signup",checkDuplicateUsernameOrEmail, (req, res, next)=>{
      req.body.roles = ["user"];  // this url only create user
      next();
      return;
  },controller.signup);

  app.post("/api/admin/signup",[verifyToken,isSuperAdmin],(req, res, next)=>{
    req.body.roles = ["admin"];  // this url only create admin
    next();
    return;
  },controller.signup);

  app.post("/api/staff/signup",[verifyToken,isSuperAdminOrAdmin],(req, res, next)=>{
    req.body.roles = ["staff"];  // this url only create staff
    next();
    return;
  },controller.signup);

  app.post("/api/auth/signin", controller.signin);

};
