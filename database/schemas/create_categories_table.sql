/*
=================================================================
Categories Table Creation Script
Author: Alvin Logenstein
Created: 10 August 2025
Purpose: Creates the Categories table for organizing transactions
=================================================================
*/

USE FinanceTracker;
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE NAME = 'Categories' AND xtype='U')
BEGIN
    CREATE TABLE Categories (
        CategoryID INT PRIMARY KEY IDENTITY(1,1),
        CategoryName NVARCHAR(100) NOT NULL UNIQUE,
        CategoryType NVARCHAR(20) NOT NULL,
        IsSystemCategory BIT NOT NULL DEFAULT 1,
        CreatedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
        IsActive BIT NOT NULL DEFAULT 1,

        CONSTRAINT CK_Categories_Type CHECK (CategoryType IN ('Income', 'Expense')),
        CONSTRAINT CK_Categories_Type_UPPER CHECK (UPPER(CategoryType) IN ('INCOME', 'EXPENSE')),
		CONSTRAINT CK_Categories_Name_NotEmpty CHECK (LEN(TRIM(CategoryName)) > 0)
    );

    CREATE INDEX IDX_Categories_Name ON Categories(CategoryName);
    CREATE INDEX IDX_Categories_Type ON Categories(CategoryType);

    PRINT 'Categories table created successfully.'
END
ELSE 
BEGIN
    PRINT 'Categories table already exists.'
END;
GO