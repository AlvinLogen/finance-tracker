/*
=================================================================
Users Budget Table Creation Script
Author: Alvin Logenstein
Created: 10 August 2025
Purpose: Creates the Budget table to manage and track income vs expenses
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
        NAME = 'Budgets'
        AND xtype = 'U'
) BEGIN
CREATE TABLE
    Budgets (
        BudgetID INT PRIMARY KEY IDENTITY (1, 1),
        UserID INT NOT NULL,
        CategoryID INT NOT NULL,
        BudgetAmount DECIMAL(10,2) NOT NULL,
        BudgetPeriod NVARCHAR(20) NOT NULL,
        StartDate DATETIME2 NOT NULL,
        EndDate DATETIME2 NOT NULL,
        CreatedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
        ModifiedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
        IsActive BIT NOT NULL DEFAULT 1,

        CONSTRAINT FK_Budgets_Users FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE NO ACTION,
        CONSTRAINT FK_Budgets_Categories FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE NO ACTION,

        CONSTRAINT CK_Budgets_Amount_Positive CHECK (BudgetAmount > 0),
        CONSTRAINT CK_Budgets_period CHECK (BudgetPeriod IN ('Monthly','Quarterly','Yearly')),
        CONSTRAINT CK_Budgets_DateRange CHECK (EndDate > StartDate),
    );

    CREATE INDEX IDX_Budgets_UserID ON Budgets(UserID);
    CREATE INDEX IDX_Budgets_Category ON Budgets(CategoryID);
    CREATE INDEX IDX_Budgets_Date ON Budgets(StartDate, EndDate);
    CREATE UNIQUE INDEX IDX_Budgets_User_Category_Period_Active
        ON Budgets(UserID, CategoryID, BudgetPeriod, StartDate)
        WHERE IsActive = 1;

    PRINT 'Budgets table created successfully.';
END
ELSE
BEGIN
    PRINT 'Budgets table already exists.';
END;
GO