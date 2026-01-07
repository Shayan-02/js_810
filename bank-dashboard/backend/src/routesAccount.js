import { ApiError } from "./errors.js";
import { mustPositiveInt, mustString } from "./utils.js";
import { findUserById, updateUserPassword, deleteUser, addTransaction, listTransactions } from "./queries.js";

/**
 * accountRoutes
 * همه مسیرها با authMiddleware محافظت می‌شوند (بدون JWT)
 */
export function accountRoutes(app, pool, authMiddleware) {
  app.get("/api/account/me", authMiddleware, async (req, res, next) => {
    try {
      const user = await findUserById(pool, req.userId);
      if (!user) throw new ApiError("کاربر یافت نشد", 404, "NOT_FOUND");

      res.json({
        ok: true,
        message: "اطلاعات حساب",
        data: {
          id: user.id,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          nationalId: user.national_id,
          cardNumber: user.card_number,
          balance: Number(user.balance),
        }
      });
    } catch (e) { next(e); }
  });

  app.get("/api/account/transactions", authMiddleware, async (req, res, next) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const offset = req.query.offset ? Number(req.query.offset) : 0;

      const rows = await listTransactions(pool, req.userId, { limit, offset });
      res.json({
        ok: true,
        message: "لیست تراکنش‌ها",
        data: rows.map(r => ({
          id: r.id,
          type: r.type,
          amount: Number(r.amount),
          balanceAfter: Number(r.balance_after),
          createdAt: r.created_at
        }))
      });
    } catch (e) { next(e); }
  });

  app.post("/api/account/deposit", authMiddleware, async (req, res, next) => {
    const amount = mustPositiveInt(req.body?.amount, "مبلغ");
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [rows] = await conn.execute("SELECT balance FROM users WHERE id=:userId FOR UPDATE", { userId: req.userId });
      const user = rows[0];
      if (!user) throw new ApiError("کاربر یافت نشد", 404, "NOT_FOUND");

      const newBalance = Number(user.balance) + amount;
      await conn.execute("UPDATE users SET balance=:newBalance WHERE id=:userId", { newBalance, userId: req.userId });
      await addTransaction(conn, { userId: req.userId, type: "DEPOSIT", amount, balanceAfter: newBalance });

      await conn.commit();
      res.json({ ok: true, message: "واریز با موفقیت انجام شد", data: { balance: newBalance } });
    } catch (e) {
      await conn.rollback();
      next(e);
    } finally {
      conn.release();
    }
  });

  app.post("/api/account/withdraw", authMiddleware, async (req, res, next) => {
    const amount = mustPositiveInt(req.body?.amount, "مبلغ");
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [rows] = await conn.execute("SELECT balance FROM users WHERE id=:userId FOR UPDATE", { userId: req.userId });
      const user = rows[0];
      if (!user) throw new ApiError("کاربر یافت نشد", 404, "NOT_FOUND");

      const current = Number(user.balance);
      if (amount > current) throw new ApiError("موجودی کافی نیست", 400, "VALIDATION_ERROR");

      const newBalance = current - amount;
      await conn.execute("UPDATE users SET balance=:newBalance WHERE id=:userId", { newBalance, userId: req.userId });
      await addTransaction(conn, { userId: req.userId, type: "WITHDRAW", amount, balanceAfter: newBalance });

      await conn.commit();
      res.json({ ok: true, message: "برداشت با موفقیت انجام شد", data: { balance: newBalance } });
    } catch (e) {
      await conn.rollback();
      next(e);
    } finally {
      conn.release();
    }
  });

  app.post("/api/account/change-password", authMiddleware, async (req, res, next) => {
    try {
      const currentPassword = mustString(req.body?.currentPassword, "رمز فعلی", { min: 4, max: 100 });
      const newPassword = mustString(req.body?.newPassword, "رمز جدید", { min: 4, max: 100 });

      const user = await findUserById(pool, req.userId);
      if (!user) throw new ApiError("کاربر یافت نشد", 404, "NOT_FOUND");

      if (currentPassword !== user.password) throw new ApiError("رمز فعلی اشتباه است", 401, "UNAUTHORIZED");

      await updateUserPassword(pool, req.userId, newPassword);
      res.json({ ok: true, message: "رمز عبور با موفقیت تغییر کرد", data: {} });
    } catch (e) { next(e); }
  });

  app.delete("/api/account", authMiddleware, async (req, res, next) => {
    try {
      const user = await findUserById(pool, req.userId);
      if (!user) throw new ApiError("کاربر یافت نشد", 404, "NOT_FOUND");

      await deleteUser(pool, req.userId);
      res.json({ ok: true, message: "حساب کاربری حذف شد", data: {} });
    } catch (e) { next(e); }
  });
}
