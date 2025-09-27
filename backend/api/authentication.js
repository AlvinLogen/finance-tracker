const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { executeStoredProcedure } = require('../config/db_connection');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'finance-tracker-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

//Register new user
router.post('/api/auth/register', [
    body('username').isLength({ min: 3, max: 50 }).trim().withMessage('Username miust be 3 - 50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').optional().trim(),
    body('lastName').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { username, email, password, firstName, lastName } = req.body;
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const result = await executeStoredProcedure('sp_CreateUser', {
            UserName: username,
            Email: email,
            PasswordHash: passwordHash,
            FirstName: firstName || null,
            LastName: lastName || null
        });

        const user = result[0];

        const token = jwt.sign(
            {
                userId: user.UserID,
                username: user.UserName,
                email: user.Email
            },
            JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }
        );

        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const tokenHash = await bcrypt.hash(token, 10);

        await executeStoredProcedure('sp_CreateUserSession', {
            UserID: user.UserID,
            TokenHash: tokenHash,
            ExpiresAt: expiresAt
        });

        res.status(201).json({
            success: true,
            message: 'User Registered Successfully',
            token,
            user: {
                id: user.UserID,
                username: user.UserName,
                email: user.Email,
                firstName: user.FirstName,
                lastName: user.LastName
            }
        });
    } catch (error) {
        console.error('Registration error:', error);

        if (error.message.includes('Username') || error.message.includes('Email')) {
            return res.status(409).json({
                success: false,
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            error: 'Registration failed',
            details: error.message
        });
    }
});

//Login user
router.post('/api/auth/login', [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { email, password } = req.body;

        const users = await executeStoredProcedure('sp_GetUserByEmail', {
            Email: email
        });

        if (!users || users.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        const user = users[0];

        const isValidPassword = await bcrypt.compare(password, user.PasswordHash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        const token = jwt.sign({
            userId: user.UserID,
            username: user.UserName,
            email: user.Email
        }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });

        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const tokenHash = await bcrypt.hash(token, 10);

        await executeStoredProcedure('sp_CreateUserSession', {
            UserID: user.UserID,
            TokenHash: tokenHash,
            ExpiresAt: expiresAt
        });

        await executeStoredProcedure('sp_UpdateLastLogin', {
            UserID: user.UserID
        });

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.UserID,
                username: user.UserName,
                email: user.Email,
                firstName: user.FirstName,
                lastName: user.LastName
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'login failed',
            details: error.message
        })
    }
});

//Get Current User Profile
router.get('/api/auth/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const users = await executeStoredProcedure('sp_GetUserProfile', {
            UserID: decoded.userId
        });

        if (!users || users.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'user not found'
            });
        }

        const user = users[0];
        res.json({
            success: true,
            user: {
                id: user.UserID,
                username: user.UserName,
                email: user.Email,
                firstName: user.FirstName,
                lastName: user.LastName,
                createdate: user.CreateDate,
                lastLoginDate: user.lastLoginDate
            }
        });
    }

    catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Invalid Token',
            details: error.message
        });
    }
});

//Logout User
router.post('/api/auth/logout', async(req, res) => {
    try{
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            const tokenHash = await bcrypt.hash(token, 10);
            await executeStoredProcedure('sp_LogoutUser', {
                TokenHash: tokenHash
            });
        }

        res.json({
            success: true,
            message: 'Logged out successfully'
        })

    } catch (error){
        console.error('Logout error', error);
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    }
});

module.exports = router;