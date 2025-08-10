/*
=================================================================
Users Trigger Budget Creation Script
Author: Alvin Logenstein
Created: 10 August 2025
Purpose: Creates the Trigger for the budgets table that prevents budgets from being created for incomes 
=================================================================
*/

CREATE TRIGGER TR_Budgets_ExpenseOnly
ON Budgets
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM inserted i
        INNER JOIN Categories c ON i.CategoryID = c.CategoryID
        WHERE c.CategoryType != 'Expense'
    )
    BEGIN
        RAISERROR('Budgets can only be created for Expense categories', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;