module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('UserPoints', {
    ID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
    },
    points: {
      type: Sequelize.TINYINT,
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('UserPoints'),
};
