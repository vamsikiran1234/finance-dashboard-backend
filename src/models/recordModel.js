const { getDb } = require("../config/db");

async function createRecord({ amount, type, category, date, notes, createdBy }) {
  const db = getDb();

  const result = await db.run(
    `INSERT INTO records (amount, type, category, date, notes, created_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [amount, type, category, date, notes || null, createdBy || null]
  );

  return getRecordById(result.lastID);
}

async function getRecordById(id) {
  const db = getDb();
  return db.get(`SELECT * FROM records WHERE id = ?`, [id]);
}

async function getRecords(filters = {}) {
  const db = getDb();
  const whereConditions = [];
  const queryParams = [];

  if (filters.type) {
    whereConditions.push("type = ?");
    queryParams.push(filters.type);
  }

  if (filters.category) {
    whereConditions.push("category = ?");
    queryParams.push(filters.category);
  }

  if (filters.startDate) {
    whereConditions.push("date >= ?");
    queryParams.push(filters.startDate);
  }

  if (filters.endDate) {
    whereConditions.push("date <= ?");
    queryParams.push(filters.endDate);
  }

  if (filters.searchTerm) {
    whereConditions.push("(category LIKE ? OR notes LIKE ?)");
    queryParams.push(`%${filters.searchTerm}%`, `%${filters.searchTerm}%`);
  }

  if (typeof filters.offset === "number" && typeof filters.limit !== "number") {
    // SQLite requires LIMIT when OFFSET is present, so use an unbounded limit.
    filters.limit = -1;
  }

  // Build one flexible query that supports any filter combination.
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  const limitClause = typeof filters.limit === "number" ? "LIMIT ?" : "";
  const offsetClause = typeof filters.offset === "number" ? "OFFSET ?" : "";

  if (typeof filters.limit === "number") {
    queryParams.push(filters.limit);
  }

  if (typeof filters.offset === "number") {
    queryParams.push(filters.offset);
  }

  return db.all(
    `SELECT * FROM records ${whereClause} ORDER BY date DESC, id DESC ${limitClause} ${offsetClause}`,
    queryParams
  );
}

async function countRecords(filters = {}) {
  const db = getDb();
  const whereConditions = [];
  const queryParams = [];

  if (filters.type) {
    whereConditions.push("type = ?");
    queryParams.push(filters.type);
  }

  if (filters.category) {
    whereConditions.push("category = ?");
    queryParams.push(filters.category);
  }

  if (filters.startDate) {
    whereConditions.push("date >= ?");
    queryParams.push(filters.startDate);
  }

  if (filters.endDate) {
    whereConditions.push("date <= ?");
    queryParams.push(filters.endDate);
  }

  if (filters.searchTerm) {
    whereConditions.push("(category LIKE ? OR notes LIKE ?)");
    queryParams.push(`%${filters.searchTerm}%`, `%${filters.searchTerm}%`);
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  const row = await db.get(`SELECT COUNT(*) AS totalCount FROM records ${whereClause}`, queryParams);
  return Number(row.totalCount || 0);
}

async function updateRecord(id, patch) {
  const db = getDb();
  const fieldsToUpdate = [];
  const queryParams = [];

  Object.keys(patch).forEach((key) => {
    fieldsToUpdate.push(`${key} = ?`);
    queryParams.push(patch[key]);
  });

  if (fieldsToUpdate.length === 0) {
    return getRecordById(id);
  }

  // Apply partial updates without allowing arbitrary SQL fragments.
  queryParams.push(id);
  await db.run(`UPDATE records SET ${fieldsToUpdate.join(", ")} WHERE id = ?`, queryParams);
  return getRecordById(id);
}

async function deleteRecord(id) {
  const db = getDb();
  const result = await db.run(`DELETE FROM records WHERE id = ?`, [id]);
  return result.changes > 0;
}

module.exports = {
  createRecord,
  getRecordById,
  getRecords,
  countRecords,
  updateRecord,
  deleteRecord
};
