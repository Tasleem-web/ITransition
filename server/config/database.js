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
    dialectOptions: {
      dateStrings: true,
      typeCast: function (field, next) {
        if (field.type === 'DATETIME') {
          return field.string()
        }
        return next()
      }
    },
    timezone: '+00:00',
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
      dateStrings: true,
      typeCast: true
    },
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      timezone: '+00:00'
    },
    timezone: '+00:00', // for writing to database
    logging: console.log, // Enable SQL query logging
    dialectOptions: {
      connectTimeout: 60000 // Increase connection timeout
    }
  }
);

module.exports = sequelize;