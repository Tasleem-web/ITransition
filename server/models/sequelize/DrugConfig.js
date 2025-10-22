const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const DrugConfig = sequelize.define('DrugConfig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  order_num: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'order_num'
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
  tableName: 'drug_configs',
  freezeTableName: true,
  underscored: true
});

// Initialize default configuration if table is empty
const initializeDefaultConfig = async () => {
  const count = await DrugConfig.count();
  if (count === 0) {
    await DrugConfig.bulkCreate([
      { field: 'id', label: 'ID', order_num: 1, visible: true },
      { field: 'code', label: 'Code', order_num: 2, visible: true },
      { field: 'name', label: 'Name', order_num: 3, visible: true },
      { field: 'company', label: 'Company', order_num: 4, visible: true },
      { field: 'launchDate', label: 'Launch Date', order_num: 5, visible: true }
    ]);
  }
};

// Call initialization (this will run when the model is imported)
initializeDefaultConfig().catch(console.error);

module.exports = DrugConfig;