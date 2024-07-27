const { Sequelize, sequelize } = require("../config/database.config");

const OneTimeLink = sequelize.define('OneTimeLink', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  expiresAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  used: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = OneTimeLink;