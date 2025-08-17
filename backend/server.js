const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db_connection');

const dashboardRoutes = require('./api/dashboard');

const app = express();
const PORT = 3001;

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}));

app.use(express.json());

//Routes
app.use('/api', dashboardRoutes);

app.get('/api/test', async (req, res) => {
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

//Health Check
app.get('/health', async(req, res) => {
    try {
        const dbTest = await testConnection();
        res.json({
            status: 'healthy',
            database: 'connected',
            serverTime: dbTest.serverTime
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            error: 'Database connection failed'
        });
    }
});

app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Test Endpoint Health Check: http://localhost:${PORT}/health`);
    console.log(`Test Endpoint: http://localhost:${PORT}/api/test`);
    console.log(`API Endpoint: http://localhost:${PORT}/api/dashboard/summary/1`);

    try {
        await testConnection();
        console.log('✅ Database connection verified');
    } catch (error) {
        console.log('Database connection failed - check your config');
    }    
});