const sequelize = require('../config/database');
const DrugConfig = require('../models/DrugConfig');

// Get table configuration 
exports.getConfig = async (req, res) => {
  try {
    const config = await DrugConfig.findAll({
      attributes: ['id', 'field', 'label', 'visible', ['order_num', 'order']],
      order: [['order_num', 'ASC'], ['id', 'ASC']]
    });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update table configuration 
exports.updateConfig = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const configurations = req.body;

    if (!configurations || !Array.isArray(configurations) || configurations.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Invalid input: configurations array required and cannot be empty.' });
    }

    const formattedConfigurations = configurations.map(config => ({
      id: config.id,
      field: config.field,
      label: config.label,
      visible: config.visible,
      order: config.order,
    }));

    await DrugConfig.bulkCreate(formattedConfigurations, {
      updateOnDuplicate: ['visible', 'order'],
      transaction,
    });

    await transaction.commit();

    const updatedConfig = await DrugConfig.findAll({
      attributes: ['id', 'field', 'label', 'visible', 'order'],
      order: [['order', 'ASC'], ['id', 'ASC']],
    });

    res.json(updatedConfig);
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating drug config within transaction:', error);
    res.status(500).json({ error: error.message });
  }
};
