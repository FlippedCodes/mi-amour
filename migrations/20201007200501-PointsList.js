module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('PointsList', {
    ID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: Sequelize.TEXT('tiny'),
      allowNull: false,
    },
    name: {
      type: Sequelize.TEXT('tiny'),
      allowNull: false,
      unique: true,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    points: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    uniqueKeys: {
      listEntryUnique: {
        fields: ['category', 'name'],
      },
    },
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('PointsList'),
};
