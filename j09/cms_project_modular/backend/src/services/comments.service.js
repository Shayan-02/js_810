const pool = require("../db/pool");

async function list({ q, limit, offset }) {
  const where = q ? `WHERE c.body LIKE ? OR u.username LIKE ? OR p.title LIKE ?` : "";
  const params = q ? [`%${q}%`, `%${q}%`, `%${q}%`] : [];

  const [[countRow]] = await pool.query(
    `SELECT COUNT(*) AS cnt
     FROM comments c
     LEFT JOIN users u ON u.id = c.userID
     LEFT JOIN products p ON p.id = c.productID
     ${where}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT c.*, u.username, p.title AS productTitle
     FROM comments c
     LEFT JOIN users u ON u.id = c.userID
     LEFT JOIN products p ON p.id = c.productID
     ${where}
     ORDER BY c.id DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { rows, total: countRow.cnt };
}

async function remove(id){
  const [result] = await pool.query("DELETE FROM comments WHERE id=?", [id]);
  return result.affectedRows;
}

module.exports = { list, remove };
