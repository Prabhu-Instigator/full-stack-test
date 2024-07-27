const { Sequelize, sequelize } = require("../config/database.config");

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  failedAttempts: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  locked: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  role: {
    type: Sequelize.STRING,
    defaultValue: "USER"
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: "ACTIVE"
  }
});

module.exports = User;