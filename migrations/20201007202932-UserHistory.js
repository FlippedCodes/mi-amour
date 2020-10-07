module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('UserHistory', {
    ID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pointsID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'pointslist',
        key: 'ID',
      },
    },
    userID: {
      type: Sequelize.STRING(30),
      allowNull: false,
      references: {
        model: 'userpoints',
        key: 'ID',
      },
    },
    teamMember: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    note: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('UserHistory'),
};
