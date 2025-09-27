/*
=================================================================
Users Table Creation Script
Author: Alvin Logenstein
Created: 13 September 2025
Purpose: Creates the Users Sessions table 
=================================================================
*/

USE FinanceTracker;
GO

--Create UserSessions table for token management
IF NOT EXISTS(SELECT * FROM sys.tables WHERE name = 'UserSessions')
BEGIN
CREATE TABLE UserSessions (
    SessionID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    TokenHash NVARCHAR(255) NOT NULL,
    ExpiresAt DATETIME2 NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

    CREATE INDEX IX_UserSessions_UserID ON UserSessions(UserID);
    CREATE INDEX IX_UserSessions_TokenHash ON UserSessions(TokenHash);

    PRINT 'Authentication tables created successfully';
END
ELSE
BEGIN
    PRINT 'UserSessions table already exists'
END
GO