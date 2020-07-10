module.exports = (sequelize, Sequelize) => {
    const Company = sequelize.define("companies", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      logo: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      website: {
        type: Sequelize.STRING
      },
      owner: {
        type: Sequelize.STRING
      },
      users: {
        type: Sequelize.STRING  // {userId : config.COMPANY_ROLES, userId : config.COMPANY_ROLES}
      }
    });
  
    return Company;
  };
  