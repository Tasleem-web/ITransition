const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Drug = require('../models/Drug');

// Get all distinct companies for the filter
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Drug.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('company')), 'company']
      ],
      order: [['company', 'ASC']]
    });
    res.json(companies.map(c => c.company));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get drugs with filtering and pagination
exports.getDrugs = async (req, res) => {
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
        { generic_name: { [Op.like]: `%${searchTerm}%` } },
        { brand_name: { [Op.like]: `%${searchTerm}%` } },
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
};