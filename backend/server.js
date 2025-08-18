const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db_connection');

const settings = require("./config/settings");
const dashboardRoutes = require(`.${settings.api.baseURL}/dashboard`);

const app = express();

//Settings Configuration
app.use(cors(settings.cors))
app.use(express.json());

//Routes
app.use(settings.api.baseURL, dashboardRoutes);

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

app.listen(settings.server.port, async () => {
    console.log(`Server running at http://${settings.server.host}:${settings.server.port}`);
    console.log(`Test Endpoint: http://${settings.server.host}:${settings.server.port}${settings.api.baseURL}/test`);  
    console.log(`Dashboard: http://localhost:${settings.server.port}/api/dashboard/summary/1`);
});