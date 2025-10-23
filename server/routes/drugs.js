const express = require('express');
const router = express.Router();
const drugController = require('../controllers/drugController');

// Get all distinct companies for the filter
router.get('/companies', drugController.getAllCompanies);

// Get drugs with filtering and pagination
router.get('/', drugController.getDrugs);

router.get('/getAllDrugs', drugController.getAllDrugs);

module.exports = router;