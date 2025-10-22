const express = require('express');
const router = express.Router();
const DrugConfig = require('../models/DrugConfig');

// Get table configuration
router.get('/', async (req, res) => {
  try {
    const config = await DrugConfig.findAll();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update table configuration
router.put('/', async (req, res) => {
  try {
    const configurations = req.body;

    // Update each configuration
    for (const config of configurations) {
      await DrugConfig.update(
        { visible: config.visible, order: config.order },
        { where: { id: config.id } }
      );
    }

    // Get updated configuration
    const updatedConfig = await DrugConfig.findAll({
      where: { visible: true },
      order: [['order', 'ASC']]
    });

    res.json(updatedConfig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;