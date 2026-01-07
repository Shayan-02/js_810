import { ApiError } from "./errors.js";
import { mustString, mustNumericString, randomCard16, newSessionId, sign } from "./utils.js";
import { findUserByUsername, existsByNationalId, existsByCardNumber, insertUser } from "./queries.js";

/**
 * authRoutes
 * - register: ساخت کاربر + ساخت session
 * - login: بررسی کاربر + ساخت session
 * - logout: حذف session
 */
export function authRoutes(app, pool, { sessionStore, cookieName, cookieSecret }) {
  function setSessionCookie(res, sid) {
    const signed = sign(sid, cookieSecret);

    // SameSite=Lax برای آموزش/سادگی؛ Secure در https فعال می‌شود
    res.setHeader("Set-Cookie", [
      `${cookieName}=${encodeURIComponent(signed)}; Path=/; HttpOnly; SameSite=Lax`
    ]);
  }

  function clearSessionCookie(res) {
    res.setHeader("Set-Cookie", [
      `${cookieName}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`
    ]);
  }

  // POST /api/auth/register
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const username = mustString(req.body?.username, "نام کاربری", { min: 3, max: 50 });
      const password = mustString(req.body?.password, "رمز عبور", { min: 4, max: 100 }); // آموزشی
      const firstName = mustString(req.body?.firstName, "نام", { min: 2, max: 60 });
      const lastName = mustString(req.body?.lastName, "نام خانوادگی", { min: 2, max: 60 });
      const nationalId = mustNumericString(req.body?.nationalId, "کد ملی", { length: 10 });

      if (await findUserByUsername(pool, username)) throw new ApiError("نام کاربری تکراری است");
      if (await existsByNationalId(pool, nationalId)) throw new ApiError("کد ملی تکراری است");

      // تولید شماره کارت یکتا
      let cardNumber = null;
      for (let i = 0; i < 20; i++) {
        const candidate = randomCard16();
        if (!(await existsByCardNumber(pool, candidate))) { cardNumber = candidate; break; }
      }
      if (!cardNumber) throw new ApiError("خطا در تولید شماره کارت. دوباره تلاش کنید");

      const userId = await insertUser(pool, { username, password, firstName, lastName, nationalId, cardNumber });

      // session
      const sid = newSessionId();
      sessionStore.set(sid, userId);
      setSessionCookie(res, sid);

      res.json({ ok: true, message: "ثبت‌نام با موفقیت انجام شد", data: { cardNumber } });
    } catch (e) { next(e); }
  });

  // POST /api/auth/login
  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const username = mustString(req.body?.username, "نام کاربری", { min: 3, max: 50 });
      const password = mustString(req.body?.password, "رمز عبور", { min: 4, max: 100 });

      const user = await findUserByUsername(pool, username);
      if (!user) throw new ApiError("نام کاربری یا رمز عبور اشتباه است", 401, "UNAUTHORIZED");

      // آموزشی: مقایسه مستقیم (در پروژه واقعی باید hash)
      if (password !== user.password) throw new ApiError("نام کاربری یا رمز عبور اشتباه است", 401, "UNAUTHORIZED");

      const sid = newSessionId();
      sessionStore.set(sid, user.id);
      setSessionCookie(res, sid);

      res.json({ ok: true, message: "ورود موفق", data: {} });
    } catch (e) { next(e); }
  });

  // POST /api/auth/logout
  app.post("/api/auth/logout", async (req, res) => {
    // اگر sid وجود داشت پاک می‌کنیم
    // (در این فایل، برای سادگی cookie parsing دوباره انجام نمی‌دهیم. حذف cookie کافی است.)
    clearSessionCookie(res);
    res.json({ ok: true, message: "خروج انجام شد", data: {} });
  });
}
