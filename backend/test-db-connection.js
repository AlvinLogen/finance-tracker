const { testConnection } = require('./config/db_connection');

async function runTest() {
    try {
        console.log('Testing database connection...');
        const result = await testConnection();
        console.log('✅ Database connection successful!');
        console.log('Server time:', result.serverTime);
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
}

runTest();