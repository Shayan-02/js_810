const pool = require("../db/pool");

async function list({ q, limit, offset }) {
  const where = q ? `WHERE off.code LIKE ? OR p.title LIKE ?` : "";
  const params = q ? [`%${q}%`, `%${q}%`] : [];

  const [[countRow]] = await pool.query(
    `SELECT COUNT(*) AS cnt
     FROM offs off
     LEFT JOIN products p ON p.id=off.productID
     ${where}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT off.*, p.title AS productTitle
     FROM offs off
     LEFT JOIN products p ON p.id=off.productID
     ${where}
     ORDER BY off.id DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { rows, total: countRow.cnt };
}

async function toggle(id){
  const [result] = await pool.query("UPDATE offs SET isActive = 1 - isActive WHERE id=?", [id]);
  return result.affectedRows;
}

async function remove(id){
  const [result] = await pool.query("DELETE FROM offs WHERE id=?", [id]);
  return result.affectedRows;
}

module.exports = { list, toggle, remove };
