module.exports = (sequelize, Sequelize) => {
    const Invitation = sequelize.define("invitations", {
      email: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.INTEGER
      },
      companyId: {
        type: Sequelize.STRING
      },
      expirationDate:{
        type: Sequelize.DATE
      }
    });
  
    return Invitation;
  };
  