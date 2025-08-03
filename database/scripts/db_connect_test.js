const sql = require('mssql');
const config = require('../config.js');

async function testConnection() {
    try {
        console.log('Testing database connection...');
        await sql.connect(config);

        const result = await sql.query`SELECT GETDATE() as currentTime`;
        console.log('Connection succeeded!');
        console.log('Current Database Time:', result.recordset[0].currentTime);

        await sql.close();

    } catch (err){
        console.error('Database connection failed', err)
    }
}

testConnection();