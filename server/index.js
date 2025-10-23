const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/database");

// Initialize default table configuration
const initializeConfigs = async () => {
  try {
    const DrugConfig = require('./models/DrugConfig');
    const defaultConfigs = [
      { field: 'id', label: 'ID', order: 1 },
      { field: 'code', label: 'Code', order: 2 },
      { field: 'name', label: 'Name', order: 3 },
      { field: 'company', label: 'Company', order: 4 },
      { field: 'launchDate', label: 'Launch Date', order: 5 }
    ];

    for (const config of defaultConfigs) {
      await DrugConfig.findOrCreate({
        where: { field: config.field },
        defaults: config
      });
    }
    console.log('Default configurations initialized');
  } catch (error) {
    console.error('Error initializing configurations:', error);
  }
};
// Set up middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// testing route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to ITransition" });
});

// Set up routes
app.use('/api/drug-config', require('./routes/drugConfig'));
app.use('/api/drugs', require('./routes/drugs'));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.use(express.bodyParser({ limit: '50mb' }));
}

const port = process.env.PORT || 5000;

// Initialize Database and Start Server
const initializeDatabase = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Sync models
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');

    // Initialize configurations
    await initializeConfigs();

    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

// Start the initialization process
initializeDatabase();