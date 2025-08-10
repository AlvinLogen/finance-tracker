/*
=================================================================
Database Creation Script for Finance Tracker Application
Author: Alvin Logenstein
Created: 10 August 2025
Purpose: Creates the main database with optimal settings
=================================================================
*/

IF NOT EXISTS (SELECT name FROM sys.databases WHERE NAME = 'FinanceTracker')
BEGIN
    CREATE DATABASE FinanceTracker
    COLLATE SQL_Latin1_General_CP1_CI_AS
    PRINT 'Database FinanceTracker created successfully.'
END
ELSE
BEGIN
    PRINT 'Database FinanceTracker already exists.'
END;

USE FinanceTracker;
GO