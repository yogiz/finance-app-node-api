const { DB_CONF, ROLES } = require("../../config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  DB_CONF.DB,
  DB_CONF.USER,
  DB_CONF.PASSWORD,
  {
    host: DB_CONF.HOST,
    dialect: DB_CONF.dialect,
    // operatorsAliases: false,

    pool: {
      max: DB_CONF.pool.max,
      min: DB_CONF.pool.min,
      acquire: DB_CONF.pool.acquire,
      idle: DB_CONF.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.token = require("../models/token.model.js")(sequelize, Sequelize);
db.company = require("../models/company.model.js")(sequelize, Sequelize);
db.invitation = require("../models/invitation.model.js")(sequelize, Sequelize);


db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.user.hasMany(db.token, { as: "tokens" })
db.token.belongsTo(db.user, {
  foreignKey: "userId",
  as:"user"
});

db.ROLES = ROLES;

module.exports = db;
