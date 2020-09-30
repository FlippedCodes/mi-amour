module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Ages', {
    ID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
    },
    DoB: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    deny: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Ages'),
};
