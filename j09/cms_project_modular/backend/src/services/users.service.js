const pool = require("../db/pool");

async function list({ q, limit, offset }) {
  const where = q
    ? "WHERE firstname LIKE ? OR lastname LIKE ? OR username LIKE ? OR email LIKE ? OR phone LIKE ?"
    : "";
  const params = q ? Array(5).fill(`%${q}%`) : [];
  const [[countRow]] = await pool.query(`SELECT COUNT(*) AS cnt FROM users ${where}`, params);
  const [rows] = await pool.query(
    `SELECT * FROM users ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  return { rows, total: countRow.cnt };
}

async function getById(id) {
  const [rows] = await pool.query("SELECT * FROM users WHERE id=?", [id]);
  return rows[0] || null;
}

async function create(payload) {
  const { firstname, lastname, username, password, phone, email, city, address, score, buy } = payload;
  const [result] = await pool.query(
    `INSERT INTO users (firstname, lastname, username, password, phone, email, city, address, score, buy)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [firstname, lastname, username, password, phone || null, email || null, city || null, address || null, Number(score||0), Number(buy||0)]
  );
  return result.insertId;
}

async function update(id, payload) {
  const { firstname, lastname, username, password, phone, email, city, address, score, buy } = payload;
  const [result] = await pool.query(
    `UPDATE users
     SET firstname=?, lastname=?, username=?, password=?, phone=?, email=?, city=?, address=?, score=?, buy=?
     WHERE id=?`,
    [firstname, lastname, username, password, phone || null, email || null, city || null, address || null, Number(score||0), Number(buy||0), id]
  );
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await pool.query("DELETE FROM users WHERE id=?", [id]);
  return result.affectedRows;
}

module.exports = { list, getById, create, update, remove };
