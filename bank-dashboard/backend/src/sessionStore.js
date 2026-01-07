/**
 * sessionStore.js
 * session های ساده در حافظه (آموزشی)
 * - sid -> userId
 * توجه: با ریست شدن سرور، session ها از بین می‌روند.
 */
export function createSessionStore() {
  const map = new Map();

  return {
    set(sid, userId) { map.set(sid, userId); },
    get(sid) { return map.get(sid) ?? null; },
    del(sid) { map.delete(sid); },
  };
}
