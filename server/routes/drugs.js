const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Drug = require('../models/sequelize/Drug');

// Get all distinct companies for the filter
router.get('/companies', async (req, res) => {
  try {
    // First, let's check if we have any drugs in the table
    const count = await Drug.count();
    console.log(`Total drugs in database: ${count}`);

    // Get distinct companies
    const companies = await Drug.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('company')), 'company']
      ],
      raw: true,
      order: [['company', 'ASC']]
    });

    console.log('Found companies:', companies);

    // Transform the result to a simple array of company names
    const companyList = companies.map(item => item.company).filter(Boolean);
    console.log('Transformed company list:', companyList);

    res.json(companyList);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get drugs with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      company,
      searchTerm
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    if (company) {
      whereClause.company = company;
    }
    if (searchTerm) {
      whereClause[Op.or] = [
        { genericName: { [Op.like]: `%${searchTerm}%` } },
        { brandName: { [Op.like]: `%${searchTerm}%` } },
        { code: { [Op.like]: `%${searchTerm}%` } }
      ];
    }

    // Get total count for pagination
    const totalCount = await Drug.count({ where: whereClause });

    // Get drugs
    const drugs = await Drug.findAll({
      where: whereClause,
      order: [['launchDate', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Transform data to match required format
    const transformedDrugs = drugs.map(drug => ({
      id: drug.id,
      code: drug.code,
      name: `${drug.genericName} (${drug.brandName})`,
      company: drug.company,
      launchDate: drug.launchDate
    }));

    res.json({
      data: transformedDrugs,
      total: totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/fetchDrugs', async (req, res) => {
  try {
    const drugs = await Drug.findAll();
    res.json(drugs);
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
});

module.exports = router;