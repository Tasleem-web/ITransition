const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Drug = sequelize.define('drugdata', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  generic_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'generic_name'
  },
  brand_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'brand_name'
  },
  company: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  launch_date: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'launch_date'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
  indexes: [
    {
      fields: ['launch_date']
    },
    {
      fields: ['company']
    }
  ],
  freezeTableName: true
});

module.exports = Drug;