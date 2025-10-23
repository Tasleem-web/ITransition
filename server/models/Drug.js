const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Drug = sequelize.define('drugdata', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: null,
  },
  genericName: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    field: 'genericName',
  },
  company: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
    field: 'company',
  },
  brandName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
    field: 'brandName',
  },
  launchDate: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: null,
    field: 'launchDate'
  },
}, {
  timestamps: false,
});

module.exports = Drug;
