const sql = require("mssql");
const dbConfig = require('./db_config')

let pool;

async function getConnection() {
  try {
    if (!pool) {
      pool = new sql.ConnectionPool(dbConfig);
      await pool.connect();
      console.log("Connected to SQL Server");
    }
    return pool;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

async function executeStoredProcedure(procedureName, parameters = {}) {
  try {
    const pool = await getConnection();
    const request = pool.request();

    //Add Parameters to Procedure(s)
    Object.entries(parameters).forEach(([key,value]) => {
        if (value !== null && value !== undefined) {
            request.input(key,value);
        }
    });

    const result = await request.execute(procedureName);
    return result.recordset;

  } catch (error) {
    console.error(`Error executing ${procedureName}:`, error);
    throw error;
  }
}

// Test database connection
async function testConnection() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query`SELECT GETDATE() as serverTime`;
        return result.recordset[0];
    } catch (error) {
        console.error('Database test failed:', error.message);
        throw error;
    }
}

module.exports = {
    getConnection,
    executeStoredProcedure,
    testConnection,
    sql
}
