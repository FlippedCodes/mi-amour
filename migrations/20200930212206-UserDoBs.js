module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('UserDoBs', {
    ID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
    },
    DoB: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    allow: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    teammemberID: Sequelize.STRING(30),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('UserDoBs'),
};
