const dbConfig = require("./db_config");

const settings = {
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || "localhost",
    environment: process.env.NODE_ENV || "development",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://127.0.0.1:5500",
    credentials: true,
  },
  api: {
    baseURL: "/api",
    version: "v1"
  },
  database: dbConfig,
};

module.exports = settings;
