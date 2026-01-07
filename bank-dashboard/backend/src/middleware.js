import { ApiError } from "./errors.js";
import { parseCookies, verifySigned } from "./utils.js";

export function createAuthMiddleware({ sessionStore, cookieName, cookieSecret }) {
  return function authMiddleware(req, res, next) {
    const cookies = parseCookies(req.headers.cookie);
    const signed = cookies[cookieName];
    const sid = verifySigned(signed, cookieSecret);

    if (!sid) return next(new ApiError("برای دسترسی باید وارد شوید", 401, "UNAUTHORIZED"));

    const userId = sessionStore.get(sid);
    if (!userId) return next(new ApiError("session منقضی شده است. دوباره وارد شوید", 401, "UNAUTHORIZED"));

    req.userId = Number(userId);
    next();
  };
}

export function errorMiddleware(err, req, res, next) {
  const isApi = err && typeof err.statusCode === "number";
  const status = isApi ? err.statusCode : 500;

  if (!isApi) console.error(err);

  res.status(status).json({
    ok: false,
    code: isApi ? (err.code || "API_ERROR") : "INTERNAL_ERROR",
    message: isApi ? err.message : "خطای داخلی سرور",
    details: isApi ? (err.details ?? null) : null
  });
}
