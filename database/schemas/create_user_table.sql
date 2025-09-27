/*
=================================================================
Users Table Creation Script
Author: Alvin Logenstein
Created: 10 August 2025
Purpose: Creates the Users table 
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
        NAME = 'Users'
        AND xtype = 'U'
) BEGIN
CREATE TABLE
    Users (
        UserID INT PRIMARY KEY IDENTITY (1, 1),
        Email NVARCHAR (255) UNIQUE,
        FirstName NVARCHAR (50) NOT NULL,
        LastName NVARCHAR (50) NOT NULL,
        CreatedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
        ModifiedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
        IsActive BIT NOT NULL DEFAULT 1,
        UserName NVARCHAR(50) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        LastLoginDate DATETIME2 NULL

        CONSTRAINT CK_Users_Email_Format CHECK (Email LIKE '%@%.%'),
        CONSTRAINT CK_Users_FirstName_NotEmpty CHECK (LEN(TRIM(FirstName)) > 0),
        CONSTRAINT CK_Users_LastName_NotEmpty CHECK (LEN(TRIM(LastName)) > 0)
);

    CREATE INDEX IDX_Users_Email ON Users(Email);
    CREATE INDEX IX_Users_Username ON Users(UserName);

    PRINT 'Users table created successfully.';
END
ELSE
BEGIN
    PRINT 'Users table already exists.';
END;
GO