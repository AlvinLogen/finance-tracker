const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { testConnection, getConnection } = require('./config/db_connection');
const settings = require("./config/settings");

const app = express();

//Settings Configuration
app.use(cors(settings.cors))
app.use(express.json());
app.use(cookieParser());

//Route Files
const authRoutes = require('./api/authentication');
const dashboardRoutes = require('./api/dashboard');
const transactionRoutes = require('./api/transactions');

//Routes
app.use('/',authRoutes);
app.use('/', dashboardRoutes)
app.use('/',transactionRoutes);

app.get(`${settings.api.baseURL}/test`, async (req, res) => {
    try {
        const dbTest = await testConnection();
        res.json({
            status: 'success',
            message: 'API test endpoint working',
            database: 'connected',
            serverTime: dbTest.serverTime
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: error.message
        });
    }
});

async function startServer() {
    try{
        await getConnection();
        app.listen(settings.server.port, async () => {
        console.log(`Server running at http://${settings.server.host}:${settings.server.port}`);
        console.log(`Auth: http://${settings.server.host}:${settings.server.port}/api/authentication/`)
        console.log(`Test Endpoint: http://${settings.server.host}:${settings.server.port}${settings.api.baseURL}/test`);  
        console.log(`Dashboard: http://localhost:${settings.server.port}/api/dashboard/summary/1`);
        });
    } catch (error){
        console.error('Database connection failed. Please check your database configuration.');
        process.exit(1);
    }
}

startServer();
