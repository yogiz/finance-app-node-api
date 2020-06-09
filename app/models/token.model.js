module.exports = (sequelize, Sequelize) => {
    const Token = sequelize.define("tokens", {
      tokenKey: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      type: {
        type: Sequelize.INTEGER     // 1 = verification token,  2 = forget password token
      },
      expirationDate: {
        type: Sequelize.DATE,
      },

    });
  
    return Token;
  };
  