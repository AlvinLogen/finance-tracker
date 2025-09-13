/*
=================================================================
Transaction Management Stored Procedure
Author: Alvin Logenstein
Created: 18 August 2025
Purpose: Manages User Transactions 
=================================================================
*/

USE FinanceTracker;
GO

-- 1. Get All Transactions for a User
CREATE OR ALTER PROCEDURE sp_GetUserTransactions
    @UserID INT,
    @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @CategoryID INT = NULL,
    @TransactionType NVARCHAR(10) = NULL -- Income or Expense
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        t.TransactionID,
        t.Amount,
        t.Description,
        t.TransactionDate,
        t.TransactionType,
        c.CategoryName,
        c.CategoryID,
        t.CreatedDate,
        t.ModifiedDate
    FROM Transactions t 
        INNER JOIN Categories c 
        ON t.CategoryID = c.CategoryID
    WHERE t.UserID = @UserID
      AND t.IsActive = 1
      AND c.IsActive = 1
      AND (@StartDate IS NULL OR t.TransactionDate >= @StartDate)
      AND (@EndDate IS NULL OR t.TransactionDate <= @EndDate)
      AND (@CategoryID IS NULL OR t.CategoryID = @CategoryID)
      AND (@TransactionType IS NULL OR t.TransactionType = @TransactionType)
    ORDER BY t.TransactionDate DESC, t.CreatedDate DESC;
END;
GO

-- 2. Add New Transaction
CREATE OR ALTER PROCEDURE sp_AddTransaction
    @UserID INT,
    @Amount DECIMAL(10,2),
    @Description NVARCHAR(255),
    @TransactionDate DATE,
    @CategoryID INT,
    @TransactionType NVARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS(SELECT 1 FROM Users WHERE UserID = @UserID AND IsActive = 1)
    BEGIN
        RAISERROR('Invalid or Inactive User ID',16,1);
        RETURN;
    END;

    IF NOT EXISTS(
        SELECT 1 FROM Categories
        WHERE CategoryID = @CategoryID
          AND CategoryType = @TransactionType
          AND IsActive = 1
    )

    BEGIN
        RAISERROR('Invalid Category for this transaction type',16,1);
        RETURN;
    END;

    --Insert the transaction record
    INSERT INTO Transactions (UserID, Amount, Description, TransactionDate, CategoryID, TransactionType)
    VALUES(@UserID, @Amount, @Description, @TransactionDate, @CategoryID, @TransactionType);

    --Return the newly created transaction ID
    SELECT SCOPE_IDENTITY() AS NewTransactionID;
END;
GO

-- 3. Get Categories for User
CREATE OR ALTER PROCEDURE sp_GetUserCategories
    @UserID INT,
    @CategoryType NVARCHAR(10) = NULL --Income or Expense

AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        CategoryID,
        CategoryName,
        CategoryType,
        1 AS IsSystemDefault
    FROM Categories
    WHERE IsActive = 1
      AND (@CategoryType IS NULL OR CategoryType = @CategoryType)
    ORDER BY CategoryType, CategoryName;
END;
GO


