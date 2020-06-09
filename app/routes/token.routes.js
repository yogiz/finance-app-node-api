const controller = require("../controllers/token.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        // "x-access-token, Origin, Content-Type, Accept"
        "Authorization, Origin, Content-Type, Accept"
      );
      next();
    });
    app.get(
        "/api/runTokenAction",
        controller.tokenAction
    );
    app.post(
        "/api/getResetToken",
        controller.getResetToken
    );
    app.put(
        "/api/resetPassword",
        controller.resetPassword
    );
};