/*
=================================================================
Dashboard Summary Stored Procedure
Author: Alvin Logenstein
Created: 17 August 2025
Purpose: Retrieve financial summary data for dashboard display
=================================================================
*/

USE FinanceTracker;
GO

IF OBJECT_ID('sp_GetUserFinancialSummary', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetUserFinancialSummary;
GO

CREATE PROCEDURE sp_GetUserFinancialSummary
    @UserID INT,
    @StartDate DATE = NULL,
    @EndDate DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

     -- Set default date range to current month if not provided
    IF @StartDate IS NULL
        SET @StartDate = DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()),1);

    IF @EndDate IS NULL
        SET @EndDate = EOMONTH(GETDATE());

    -- Validate that user exists
    IF NOT EXISTS(SELECT 1 FROM Users WHERE UserID = @UserID AND IsActive = 1)
    BEGIN
        RAISERROR('user not found or inactive',16,1);
        RETURN;
    END;

    -- Get financial summary for the user and date range
    SELECT 
        ISNULL(SUM(CASE WHEN TransactionType = 'Income' THEN Amount ELSE 0 END),0) AS TotalIncome,
        ISNULL(SUM(CASE WHEN TransactionType = 'Expense' THEN Amount ELSE 0 END),0) AS TotalExpenses,
        ISNULL(SUM(CASE WHEN TransactionType = 'Income' THEN Amount ELSE 0 END),0)
         - 
        ISNULL(SUM(CASE WHEN TransactionType = 'Expense' THEN Amount ELSE 0 END),0) AS NetBalance,
        COUNT(TransactionId) AS TotalTransactions,
        @StartDate AS PeriodStart,
        @EndDate AS PeriodEnd
    FROM Transactions
        WHERE TransactionDate >= @StartDate 
          AND TransactionDate <= @EndDate
          AND UserID = @UserID
          AND IsActive =1;

END;
GO