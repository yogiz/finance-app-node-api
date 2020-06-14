const { verifyToken, isStaff, isAdmin } = require("../middleware/authJwt.js");
const { uploadingProfile } = require("../middleware/profile.js");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      // "x-access-token, Origin, Content-Type, Accept"
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/user",
    [verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/test/mod",
    [verifyToken, isStaff],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [verifyToken, isAdmin],
    controller.adminBoard
  );

  app.post("/api/profile/image",[verifyToken, uploadingProfile], controller.uploadProfileImage);
  app.post("/api/profile/update",verifyToken, controller.updateProfile);

};
