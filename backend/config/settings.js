const path = require("path");
const fs = require("fs");

//local settings files
const database_config = require("./db_config");

//Loading database configuration
function loadDatabaseConfig() {
  try {
    const dbConfigPath = path.join(__dirname, "../../database/config.js");
    if (fs.existsSync(dbConfigPath)) {
      return require(dbConfigPath);
    }

    if (process.env.DB_SERVER) {
      return {
        server: process.env.DB_SERVER,
        database: process.env.DB_NAME || "FinanceTracker",
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      };
    }

    throw new Error(
      "Database configuration not found. Please create database configuration file."
    );
  } catch (error) {
    console.error("Configuration Error:", error.message);
    console.log(
      "Create database configuration file with your SQL Server settings"
    );
    process.exit(1);
  }
}

//Loading server configuration
function loadServerConfig() {
  return {
    port: process.env.PORT || 3001,
    cors: {
      origin: process.env.CORS_ORIGIN || "http://127.0.0.1:5500",
      credentials: true,
    },
    environment: process.env.NODE_ENV || "development",
  };
}

module.exports = {
  loadDatabaseConfig,
  loadServerConfig,
};
