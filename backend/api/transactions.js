const express = require('express');
const { executeStoredProcedure } = require('../config/db_connection');

const router = express.Router();

// Get all transactions for a user
router.get('/api/transactions/:userId', async (req, res) => { 
    try {
        const { userId } = req.params;
        const { startDate, endDate, categoryId, transactionType } = req.query;

        const userIdInt = parseInt(userId);
        if (isNaN(userIdInt) || userIdInt <= 0) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const parameters = { UserID: userIdInt };
        if (startDate) parameters.StartDate = startDate;
        if (endDate) parameters.EndDate = endDate;
        if (categoryId) parameters.CategoryId = parseInt(categoryId);
        if (transactionType) parameters.TransactionType = transactionType;

        const transactions = await executeStoredProcedure('sp_GetUserTransactions', parameters);
        
        res.json({
            success: true,
            transactions: transactions,
            count: transactions.length
        });

    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({
            error: 'Failed to retrieve transactions',
            details: error.message
        });
    }
});

// Add new transaction
router.post('/api/transactions', async (req, res) => {
    try {
        const { userId, amount, description, transactionDate, categoryId, transactionType } = req.body;

        // Validation
        if (!userId || !amount || !description || !transactionDate || !categoryId || !transactionType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!['Income', 'Expense'].includes(transactionType)) {
            return res.status(400).json({ error: 'Transaction type must be Income or Expense' });
        }

        const parameters = {
            UserID: parseInt(userId),
            Amount: parseFloat(amount),
            Description: description,
            TransactionDate: transactionDate,
            CategoryID: parseInt(categoryId),
            TransactionType: transactionType
        };

        const result = await executeStoredProcedure('sp_AddTransaction', parameters);
        
        res.status(201).json({
            success: true,
            message: 'Transaction added successfully',
            transactionId: result[0]?.NewTransactionID
        });

    } catch (error) {
        console.error('Add transaction error:', error);
        res.status(500).json({
            error: 'Failed to add transaction',
            details: error.message
        });
    }
});

// Get categories for user
router.get('/api/categories/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { categoryType } = req.query;

        const parameters = { UserID: parseInt(userId) };
        if (categoryType) parameters.CategoryType = categoryType;

        const categories = await executeStoredProcedure('sp_GetUserCategories', parameters);
        
        res.json({
            success: true,
            categories: categories
        });

    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            error: 'Failed to retrieve categories',
            details: error.message
        });
    }
});

// IMPORTANT: Export the router
module.exports = router;