const cors = require('cors');
const { loadServerConfig } = require('../config/settings');

function setupCors() {
    const serverConfig = loadServerConfig();

    return cors({
        origin: serverConfig.cors.origin,
        credentials: serverConfig.cors.credentials,
        methods: ['GET', 'POST','PUT','DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    });
}

module.exports = setupCors;