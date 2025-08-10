/*
=================================================================
Users Default Categories Creation Script
Author: Alvin Logenstein
Created: 10 August 2025
Purpose: Creates the Default Categories
=================================================================
*/

USE FinanceTracker;
GO

IF NOT EXISTS (SELECT 1 FROM Categories WHERE CategoryName = 'Salary')
BEGIN
    INSERT INTO Categories(CategoryName, CategoryType, IsSystemCategory)
    VALUES ('Salary', 'Income', 1);
END;

IF NOT EXISTS (SELECT 1 FROM Categories WHERE CategoryName = 'Other Income')
BEGIN
    INSERT INTO Categories(CategoryName, CategoryType, IsSystemCategory)
    VALUES ('Other Income', 'Income', 1);
END;

IF NOT EXISTS (SELECT 1 FROM Categories WHERE CategoryName = 'Utilities')
BEGIN
    INSERT INTO Categories(CategoryName, CategoryType, IsSystemCategory)
    VALUES ('Utilities', 'Expense', 1);
END;

IF NOT EXISTS (SELECT 1 FROM Categories WHERE CategoryName = 'Transportation')
BEGIN
    INSERT INTO Categories(CategoryName, CategoryType, IsSystemCategory)
    VALUES ('Transportation', 'Expense', 1);
END;

IF NOT EXISTS (SELECT 1 FROM Categories WHERE CategoryName = 'Entertainment')
BEGIN
    INSERT INTO Categories(CategoryName, CategoryType, IsSystemCategory)
    VALUES ('Entertainment', 'Expense', 1);
END;

SELECT CategoryType, COUNT(*) as CategoryCount
FROM Categories
WHERE IsSystemCategory = 1
GROUP BY CategoryType;

PRINT 'Default Categories Inserted Successfully.';
GO