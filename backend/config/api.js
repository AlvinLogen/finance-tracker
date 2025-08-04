const http = require('http');
const sql = require('mssql');
const db_config = require('../../database/config');

let pool;

async function initializePool() {
    try {
        pool = await sql.connect(db_config);
    } catch (err) {
        process.exit(1);
    }
}

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/api/test' && req.method === 'GET') {
        try {

            if (!pool) {
                await initializePool();
            }

            const result = await pool.request()
                .query`SELECT GETDATE() as serverTime`;

            res.writeHead(200);
            res.end(JSON.stringify({
                status: 'success',
                message: 'Connection Succesful',
                serverTime: result.recordset[0].serverTime
            }))

        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({
                status: 'error',
                message: error.message
            }));
        }
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({
            status: 'error',
            message: 'Route not found',
        }));
    }

});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Test Endpoint: http://localhost:${PORT}/api/test`);
});