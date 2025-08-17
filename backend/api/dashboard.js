const express = require("express");
const { executeStoredProcedure, sql } = require("../config/db_connection");

const router = express.Router();

router.get("/dashboard/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt) || userIdInt <= 0) {
      return res.status(400).json({ error: "Invalid User Id" });
    }

    const parameters = {
      UserID: userIdInt,
    };

    if (startDate) parameters.StartDate = new Date(startDate);
    if (endDate) parameters.EndDate = new Date(endDate);

    const result = await executeStoredProcedure(
      "sp_GetUserFinancialSummary",
      parameters
    );

    if (result.length === 0) {
      return res.json({
        TotalIncome: 0,
        TotalExpense: 0,
        NetBalance: 0,
        TotalTransactions: 0,
        PeriodStart: startDate || null,
        PeriodEnd: endDate || null,
      });
    }

    res.json(result[0]);

  } catch (error) {
    console.error("Dasbhard API Error:", error);
    res
      .status(500)
      .json({
        error: "Failed to retrieve financial summary",
        datails: error.message
      });
  }
});

module.exports = router;
