const express = require('express');
const router = express.Router();
const drugConfigController = require('../controllers/drugConfigController');

// Get table configuration
router.get('/', drugConfigController.getConfig);

// Update table configuration
router.put('/', drugConfigController.updateConfig);

module.exports = router;