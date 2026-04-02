const { getDb } = require("../config/db");

async function createUser({ name, email, role, status }) {
  const db = getDb();

  const result = await db.run(
    `INSERT INTO users (name, email, role, status) VALUES (?, ?, ?, ?)`,
    [name, email, role, status]
  );

  return getUserById(result.lastID);
}

async function getUserByEmail(email) {
  const db = getDb();
  return db.get(`SELECT * FROM users WHERE email = ?`, [email]);
}

async function getAllUsers() {
  const db = getDb();
  return db.all(`SELECT * FROM users ORDER BY id DESC`);
}

async function getUserById(id) {
  const db = getDb();
  return db.get(`SELECT * FROM users WHERE id = ?`, [id]);
}

async function updateUserStatus(id, status) {
  const db = getDb();
  await db.run(`UPDATE users SET status = ? WHERE id = ?`, [status, id]);
  return getUserById(id);
}

module.exports = {
  createUser,
  getUserByEmail,
  getAllUsers,
  getUserById,
  updateUserStatus
};
