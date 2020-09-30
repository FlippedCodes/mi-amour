const Sequelize = require('sequelize');

module.exports = sequelize.define('Age', {
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
});
