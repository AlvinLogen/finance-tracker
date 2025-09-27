const jwt = require('jsonwebtoken');
const { executeStoredProcedure } = require('../config/db_connection');
const { user } = require('../config/db_config');

const JWT_SECRET = process.env.JWT_SECRET || 'finance-tracker-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

const authenticateToken = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token){
            return res.status(401).json({
                success: false,
                error: 'Access token required'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email
        };

         next();

    } catch (error){
        console.error('Auth middleware error:', error);

        if (error.name === 'TokenExpiredError'){
            return res.status(401).json({
                success: false,
                error: 'Token expired'
            });
        }

        if (error.name === 'JsonWebTokenError'){
            return res.status(401).json({
                success: false,
                error: 'Invalid Token'
            });
        }

        res.status(500).json({
            success: false, 
            error: 'Authentication error'
        });
    }
};

module.exports = authenticateToken;