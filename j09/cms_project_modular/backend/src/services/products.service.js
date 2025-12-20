const pool = require("../db/pool");

async function list({ q, limit, offset }) {
  const where = q ? "WHERE title LIKE ?" : "";
  const params = q ? [`%${q}%`] : [];
  const [[countRow]] = await pool.query(`SELECT COUNT(*) AS cnt FROM products ${where}`, params);
  const [rows] = await pool.query(
    `SELECT * FROM products ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  return { rows, total: countRow.cnt };
}

async function getById(id) {
  const [rows] = await pool.query("SELECT * FROM products WHERE id=?", [id]);
  return rows[0] || null;
}

async function create(payload) {
  const { title, price, count, img, popularity, sale, colors } = payload;
  const [result] = await pool.query(
    `INSERT INTO products (title, price, count, img, popularity, sale, colors)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, Number(price||0), Number(count||0), img || null, Number(popularity||0), Number(sale||0), colors || null]
  );
  return result.insertId;
}

async function update(id, payload) {
  const { title, price, count, img, popularity, sale, colors } = payload;
  const [result] = await pool.query(
    `UPDATE products
     SET title=?, price=?, count=?, img=?, popularity=?, sale=?, colors=?
     WHERE id=?`,
    [title, Number(price||0), Number(count||0), img || null, Number(popularity||0), Number(sale||0), colors || null, id]
  );
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await pool.query("DELETE FROM products WHERE id=?", [id]);
  return result.affectedRows;
}

module.exports = { list, getById, create, update, remove };
