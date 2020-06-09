require('dotenv').config({ path: './.env.local' });

module.exports = {

    SERVER_PORT: process.env.PORT,
    JWT_SECRET:  process.env.JWT_SECRET,

    DB_CONF: {
        HOST: process.env.DB_HOST ,
        USER: process.env.DB_USER ,
        PASSWORD: process.env.DB_PASSWORD ,
        DB: process.env.DB_DB ,
        dialect: process.env.DB_DIALECT ,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
    },

    ROLES : ["superadmin", "admin", "staff", "user"],

    CORS_ORIGIN : [
        "http://localhost:8080",
        "http://localhost:8081",
        "http://testing.test",
        "https://testing.test"
    ],

    SUPERADMIN_USER     : process.env.SUPERADMIN_USER,
    SUPERADMIN_EMAIL    : process.env.SUPERADMIN_EMAIL,
    SUPERADMIN_PASSWORD : process.env.SUPERADMIN_PASSWORD,

    SENDGRID_API_KEY    : process.env.SENDGRID_API_KEY,
    SENDGRID_EMAIL_FROM : process.env.SENDGRID_EMAIL_FROM,
    SENDGRID_TEMPLATE : {
        password_reset        : process.env.SENDGRID_TEMPLATE_PASSWORD_RESET,
        confirm_account       : process.env.SENDGRID_TEMPLATE_CONFIRM_ACCOUNT,
    }
};