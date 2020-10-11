const Sequelize = require('sequelize');

module.exports = sequelize.define('OfflineStat', {
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
},
{
  uniqueKeys: {
    listEntryUnique: {
      fields: ['category', 'name'],
    },
  },
});
