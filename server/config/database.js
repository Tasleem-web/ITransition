const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Log the configuration being used
const dbConfig = {
  database: process.env.DB_NAME || 'itransitionDrugInfo',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  host: process.env.DB_HOST || 'localhost'
};

console.log('Database configuration:', {
  ...dbConfig,
  password: '****' // Hide password in logs
});

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: 'mysql',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    },
    dialectOptions: {
      // Prevents Sequelize from appending 'Z' to dates for DATETIME columns.
      useUTC: false,
      // Treats DATETIME as strings for custom handling.
      dateStrings: true,
      typeCast: function (field, next) {
        if (field.type === 'DATETIME') {
          return new Date(field.string());
        }
        return next();
      },
      connectTimeout: 60000
    },
    // Set a correct timezone. All dates will be converted relative to this offset.
    // Use '+00:00' for UTC or a server-specific offset.
    timezone: '+00:00',
  }
);

module.exports = sequelize;
