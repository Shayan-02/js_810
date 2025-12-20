const pool = require("../db/pool");

async function list({ q, limit, offset }) {
  const where = q ? `WHERE u.username LIKE ? OR p.title LIKE ? OR o.date LIKE ?` : "";
  const params = q ? [`%${q}%`, `%${q}%`, `%${q}%`] : [];

  const [[countRow]] = await pool.query(
    `SELECT COUNT(*) AS cnt
     FROM orders o
     LEFT JOIN users u ON u.id=o.userID
     LEFT JOIN products p ON p.id=o.productID
     ${where}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT o.*, u.username, p.title AS productTitle
     FROM orders o
     LEFT JOIN users u ON u.id=o.userID
     LEFT JOIN products p ON p.id=o.productID
     ${where}
     ORDER BY o.id DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { rows, total: countRow.cnt };
}

async function remove(id){
  const [result] = await pool.query("DELETE FROM orders WHERE id=?", [id]);
  return result.affectedRows;
}

module.exports = { list, remove };
