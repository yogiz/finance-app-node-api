module.exports = {
  HOST: "localhost",
  USER: "node-auth",
  PASSWORD: "demonk1ng",
  DB: "node-auth",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
