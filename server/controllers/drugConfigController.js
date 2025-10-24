const DrugConfig = require('../models/DrugConfig');

// Get table configuration
exports.getConfig = async (req, res) => {
  try {
    const config = await DrugConfig.findAll({
      // where: { visible: true },
      order: [['order_num', 'ASC']]
    });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update table configuration
exports.updateConfig = async (req, res) => {
  try {
    const configurations = req.body;

    // Update each configuration
    await Promise.all(configurations.map(async (config) => {
      await DrugConfig.update(
        { visible: config.visible, order_num: config.order },
        { where: { id: config.id } }
      );
    }));

    // Get updated configuration
    const updatedConfig = await DrugConfig.findAll({
      // where: { visible: true },
      order: [['order_num', 'ASC']]
    });

    res.json(updatedConfig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};