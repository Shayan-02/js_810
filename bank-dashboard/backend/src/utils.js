import { ApiError } from "./errors.js";

export function mustString(v, name, { min = 1, max = 500 } = {}) {
  if (typeof v !== "string") throw new ApiError(`${name} باید رشته باشد`);
  const s = v.trim();
  if (s.length < min) throw new ApiError(`${name} حداقل ${min} کاراکتر`);
  if (s.length > max) throw new ApiError(`${name} حداکثر ${max} کاراکتر`);
  return s;
}

export function mustNumericString(v, name, { length = null } = {}) {
  const s = mustString(v, name);
  if (!/^[0-9]+$/.test(s)) throw new ApiError(`${name} فقط باید شامل عدد باشد`);
  if (length !== null && s.length !== length) throw new ApiError(`${name} باید ${length} رقم باشد`);
  return s;
}

export function mustPositiveInt(v, name) {
  const n = Number(v);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) {
    throw new ApiError(`${name} باید عدد صحیح مثبت باشد`);
  }
  return n;
}

export function randomCard16() {
  const first = String(Math.floor(Math.random() * 9) + 1);
  let rest = "";
  for (let i = 0; i < 15; i++) rest += String(Math.floor(Math.random() * 10));
  return first + rest;
}

/**
 * Cookie helpers (بدون dependency)
 */
export function parseCookies(headerValue) {
  const cookies = {};
  if (!headerValue) return cookies;

  headerValue.split(";").forEach(part => {
    const [k, ...rest] = part.trim().split("=");
    if (!k) return;
    cookies[k] = decodeURIComponent(rest.join("=") || "");
  });
  return cookies;
}

/**
 * تولید sessionId امن
 */
export function newSessionId() {
  return crypto.randomBytes(24).toString("hex");
}

/**
 * امضای ساده (HMAC) برای جلوگیری از دستکاری کوکی (آموزشی)
 */
export function sign(value, secret) {
  const h = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${h}`;
}

export function verifySigned(signedValue, secret) {
  if (!signedValue || !signedValue.includes(".")) return null;
  const [value, sig] = signedValue.split(".");
  const expected = crypto.createHmac("sha256", secret).update(value).digest("hex");
  if (sig !== expected) return null;
  return value;
}
