const { getDb } = require("../config/db");

async function getSummary() {
  const db = getDb();

  const row = await db.get(`
    SELECT
      COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount END), 0) AS totalIncome,
      COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount END), 0) AS totalExpense
    FROM records
  `);

  const totalIncome = Number(row.totalIncome || 0);
  const totalExpense = Number(row.totalExpense || 0);

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense
  };
}

async function getCategoryBreakdown() {
  const db = getDb();

  const rows = await db.all(`
    SELECT
      category,
      COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) AS totalIncome,
      COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS totalExpense,
      COALESCE(SUM(amount), 0) AS totalAmount
    FROM records
    GROUP BY category
    ORDER BY category ASC
  `);

  return rows.map((row) => ({
    category: row.category,
    totalIncome: Number(row.totalIncome),
    totalExpense: Number(row.totalExpense),
    totalAmount: Number(row.totalAmount)
  }));
}

async function getMonthlyTrends() {
  const db = getDb();

  const rows = await db.all(`
    SELECT
      SUBSTR(date, 1, 7) AS month,
      COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) AS totalIncome,
      COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS totalExpense,
      COALESCE(SUM(amount), 0) AS totalAmount
    FROM records
    GROUP BY SUBSTR(date, 1, 7)
    ORDER BY month ASC
  `);

  return rows.map((row) => ({
    month: row.month,
    totalIncome: Number(row.totalIncome),
    totalExpense: Number(row.totalExpense),
    totalAmount: Number(row.totalAmount)
  }));
}

async function getRecentActivity() {
  const db = getDb();

  const rows = await db.all(`
    SELECT id, amount, type, category, date, notes, created_at
    FROM records
    ORDER BY date DESC, id DESC
    LIMIT 5
  `);

  return rows.map((row) => ({
    ...row,
    amount: Number(row.amount)
  }));
}

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentActivity
};
