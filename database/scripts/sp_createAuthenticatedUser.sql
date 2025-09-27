/*
=================================================================
Users Table Creation Script
Author: Alvin Logenstein
Created: 13 September 2025
Purpose: Manages User Authentication Operations
=================================================================
*/

USE FinanceTracker;
GO

-- 1. Create User (Registration)
CREATE OR ALTER PROCEDURE sp_CreateUser
    @UserName NVARCHAR(50),
    @Email NVARCHAR(255),
    @PasswordHash NVARCHAR(255),
    @FirstName NVARCHAR(50) = NULL,
    @LastName NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF EXISTS(SELECT 1 FROM Users WHERE UserName = @UserName)
        BEGIN
            RAISERROR('Username or email already exists', 16, 1);
            RETURN;
        END

        IF EXISTS(SELECT 1 FROM Users WHERE Email = @Email)
        BEGIN
            RAISERROR('Email already exists', 16, 1);
            RETURN;
        END

        INSERT INTO Users (UserName, Email, PasswordHash, FirstName, LastName)
        VALUES (@UserName, @Email, @PasswordHash, @FirstName, @LastName);

        SELECT SCOPE_IDENTITY() AS UserID,
               @UserName AS UserName,
               @Email AS Email, 
               @FirstName AS FirstName,
               @LastName AS LastName;

    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16,1);
    END CATCH
END;
GO

-- 2. Get User by Email (Login)
CREATE OR ALTER PROCEDURE sp_GetUserByEmail
    @Email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT UserID, UserName, Email, PasswordHash, FirstName, LastName, IsActive, LastLoginDate
    FROM Users
    WHERE Email = @Email AND IsActive = 1; 
END;
GO

-- 3. Update Last Login Date
CREATE OR ALTER PROCEDURE sp_UpdateLastLogin
    @UserID INT
AS 
BEGIN
    SET NOCOUNT ON;

    UPDATE Users
    SET LastLoginDate = GETDATE(),
        ModifiedDate = GETDATE()
    WHERE UserID = @UserID

END;
GO

-- 4. Get User by ID
CREATE OR ALTER PROCEDURE sp_GetUserById
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT UserID, UserName, Email, PasswordHash, FirstName, LastName, IsActive, LastLoginDate
    FROM Users
    WHERE UserID = @UserID AND IsActive = 1; 
END;
GO

-- 5. Get User by Username 
CREATE OR ALTER PROCEDURE sp_GetUserByUserName
    @UserName NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT UserID, UserName, Email, PasswordHash, FirstName, LastName, IsActive, LastLoginDate
    FROM Users
    WHERE UserName = @UserName AND IsActive = 1; 
END;
GO

-- 6. Get User Profile by ID
CREATE OR ALTER PROCEDURE sp_GetUserProfile
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT UserID, UserName, Email, PasswordHash, FirstName, LastName, IsActive, LastLoginDate
    FROM Users
    WHERE UserID = @UserID AND IsActive = 1; 
END;
GO

-- 7. Create User Session (Token Management)
CREATE OR ALTER PROCEDURE sp_CreateUserSession
    @UserID INT, 
    @TokenHash NVARCHAR(255),
    @ExpiresAt DATETIME2
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE UserSessions
    SET IsActive = 0
    WHERE UserID = @UserID AND IsActive = 1;

    INSERT INTO UserSessions (UserID, TokenHash, ExpiresAt)
    VALUES (@UserID, @TokenHash, @ExpiresAt);

    SELECT SCOPE_IDENTITY() AS SessionID;
END;
GO

-- 8. Validate User Session
CREATE OR ALTER PROCEDURE sp_ValidateUserSession
    @TokenHash NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        us.SessionID,
        us.UserID, 
        u.UserName, 
        u.Email, 
        u.FirstName, 
        u.LastName, 
        us.ExpiresAt,us.IsActive
    FROM UserSessions us 
        INNER JOIN Users u ON us.UserID = u.UserID
    WHERE us.TokenHash = @TokenHash
      AND us.IsActive = 1
      AND us.ExpiresAt > GETDATE()
      AND u.IsActive =1;
END;
GO

-- 9. Logout User (Deactivate Session)
CREATE OR ALTER PROCEDURE sp_LogoutUser
    @TokenHash NVARCHAR(255) = NULL,
    @UserID INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @TokenHash IS NOT NULL
    BEGIN
        UPDATE UserSessions
        SET IsActive = 0
        WHERE TokenHash = @TokenHash;
    END
    ELSE IF @UserID IS NOT NULL
    BEGIN
        UPDATE UserSessions
        SET IsActive = 0
        WHERE UserID = @UserID AND IsActive = 1;
    END

    SELECT @@ROWCOUNT AS SessionsDeactivated;
END;
GO

-- 10. Clean Expired Sessions
CREATE OR ALTER PROCEDURE sp_CleanExpiredSessions
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM UserSessions
    WHERE ExpiresAt < GETDATE() OR IsActive = 0;

    SELECT @@ROWCOUNT AS SessionsRemoved;
END;
GO
