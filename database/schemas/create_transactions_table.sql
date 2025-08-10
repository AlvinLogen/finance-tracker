/*
=================================================================
Users Transactions Table Creation Script
Author: Alvin Logenstein
Created: 10 August 2025
Purpose: Creates the Transactions table 
=================================================================
*/

USE FinanceTracker;
GO 

IF NOT EXISTS (
    SELECT
        *
    FROM
        sysobjects
    WHERE
        NAME = 'Transactions'
        AND xtype = 'U'
) BEGIN
CREATE TABLE
    Transactions (
        TransactionID INT PRIMARY KEY IDENTITY (1, 1),
        UserID INT NOT NULL,
        CategoryID INT NOT NULL,
        Amount DECIMAL(10,2) NOT NULL,
        TransactionDate DATETIME2 NOT NULL DEFAULT GETDATE(),
        Description NVARCHAR(500), 
        TransactionType NVARCHAR(20) NOT NULL,
        CreatedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
        ModifiedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
        IsActive BIT NOT NULL DEFAULT 1,

        CONSTRAINT FK_Transactions_Users FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE NO ACTION,
        CONSTRAINT FK_Transactions_Categories FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE NO ACTION,

        CONSTRAINT CK_Transactions_Amount_Positive CHECK (Amount > 0),
        CONSTRAINT CK_Transactions_Type CHECK (TransactionType IN ('Income','Expense')),
        CONSTRAINT CK_Transactions_Date_NotFuture CHECK (TransactionDate <= GETDATE()),
        CONSTRAINT CK_Transactions_Description_NotEmpty CHECK (Description IS NULL OR LEN(TRIM(Description)) > 0)

    );

    CREATE INDEX IDX_Transactions_UserID ON Transactions(UserID);
    CREATE INDEX IDX_Transactions_Date ON Transactions(TransactionDate);
    CREATE INDEX IDX_Transactions_Category ON Transactions(CategoryID);
    CREATE INDEX IDX_Transactions_user_date ON Transactions(UserID, TransactionDate);

    PRINT 'Transactions table created successfully.';
END
ELSE
BEGIN
    PRINT 'Transactions table already exists.';
END;
GO