const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DrugConfig = sequelize.define('DrugConfig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  field: {
    type: DataTypes.STRING,
    allowNull: false
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false
  },
  visible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'order_num'
  }
}, {
  timestamps: false,
});

// Initialize default configuration if table is empty
const initializeDefaultConfig = async () => {
  const count = await DrugConfig.count();
  if (count === 0) {
    await DrugConfig.bulkCreate([
      { field: 'id', label: 'ID', order: 1, visible: true },
      { field: 'code', label: 'Code', order: 2, visible: true },
      { field: 'name', label: 'Name', order: 3, visible: true },
      { field: 'company', label: 'Company', order: 4, visible: true },
      { field: 'launchDate', label: 'Launch Date', order: 5, visible: true }
    ]);
  }
};

// Call initialization (this will run when the model is imported)
initializeDefaultConfig().catch(console.error);

module.exports = DrugConfig;