const express = require("express");
const bodyParser = require("body-parser");
var path = require('path');
const cors = require("cors");
const {
  SERVER_PORT, 
  ROLES, 
  CORS_ORIGIN, 
  SUPERADMIN_USER,
  SUPERADMIN_EMAIL,
  SUPERADMIN_PASSWORD } = require('./config.js')
const app = express();

var corsOptions = {
  origin: CORS_ORIGIN
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync({alter: true});

// db.sequelize.sync({force: true}).then(() => { // force: true will drop the table if it already exists
//   console.log('Drop and Resync Database with { force: true }');
//   initial_role();
//   const { initSuperAdmin } = require("./app/controllers/auth.controller");
//   initSuperAdmin(SUPERADMIN_USER,
//     SUPERADMIN_EMAIL,
//     SUPERADMIN_PASSWORD);
// });

// simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome." });
// });

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/token.routes')(app);
require('./app/routes/company.routes')(app);

// set port, listen for requests
app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}.`);
});


function initial_role() {
  // initialize type of role user (Role in website world, not in company each user world)
  for(let i = 0; i < ROLES.length; i++){
    Role.create({
      id: i + 1,
      name: ROLES[i]
    });
  }
}