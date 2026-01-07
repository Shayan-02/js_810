export async function findUserByUsername(pool, username) {
  const [rows] = await pool.execute("SELECT * FROM users WHERE username=:username LIMIT 1", { username });
  return rows[0] || null;
}

export async function findUserById(pool, userId) {
  const [rows] = await pool.execute("SELECT * FROM users WHERE id=:userId LIMIT 1", { userId });
  return rows[0] || null;
}

export async function existsByNationalId(pool, nationalId) {
  const [rows] = await pool.execute("SELECT id FROM users WHERE national_id=:nationalId LIMIT 1", { nationalId });
  return Boolean(rows[0]);
}

export async function existsByCardNumber(pool, cardNumber) {
  const [rows] = await pool.execute("SELECT id FROM users WHERE card_number=:cardNumber LIMIT 1", { cardNumber });
  return Boolean(rows[0]);
}

export async function insertUser(pool, { username, password, firstName, lastName, nationalId, cardNumber }) {
  const [result] = await pool.execute(
    `INSERT INTO users (username, password, first_name, last_name, national_id, card_number, balance)
     VALUES (:username,:password,:firstName,:lastName,:nationalId,:cardNumber,0)`,
    { username, password, firstName, lastName, nationalId, cardNumber }
  );
  return Number(result.insertId);
}

export async function updateUserPassword(pool, userId, password) {
  await pool.execute("UPDATE users SET password=:password WHERE id=:userId", { userId, password });
}

export async function deleteUser(pool, userId) {
  await pool.execute("DELETE FROM users WHERE id=:userId", { userId });
}

export async function addTransaction(connOrPool, { userId, type, amount, balanceAfter }) {
  await connOrPool.execute(
    `INSERT INTO transactions (user_id,type,amount,balance_after)
     VALUES (:userId,:type,:amount,:balanceAfter)`,
    { userId, type, amount, balanceAfter }
  );
}

export async function listTransactions(pool, userId, { limit = 20, offset = 0 } = {}) {
  const [rows] = await pool.execute(
    `SELECT id, type, amount, balance_after, created_at
     FROM transactions
     WHERE user_id=:userId
     ORDER BY created_at DESC
     LIMIT :limit OFFSET :offset`,
    { userId, limit, offset }
  );
  return rows;
}
