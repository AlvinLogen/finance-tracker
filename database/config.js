const db_config = {
    server: process.env.DB_SERVER || "10.0.0.19",
    database: process.env.DB_NAME || "ExpenseTracker",
    user: process.env.DB_USER || "ExpenseTracker",
    password: process.env.DB_PASSWORD || "1Hi5g#3I4",
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectionTimeout: 30000,       // 30 second timeout
        requestTimeout: 30000,
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        }
    }
}

module.exports = db_config;