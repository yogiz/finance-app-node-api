module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    bio: {
      type: Sequelize.STRING
    },
    phoneNumber: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    },
    profileImage: {
      type: Sequelize.STRING
    },
    isVerified: {
      type: Sequelize.BOOLEAN, 
      defaultValue: false
    },
    ownCompanies:{
      type: Sequelize.STRING
    },
    companies: {
      type: Sequelize.STRING
    }
  });

  return User;
};
