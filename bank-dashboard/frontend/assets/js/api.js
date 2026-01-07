
export async function apiRequest(path, { method = "GET", body = null } = {}) {
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : null
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err = new Error(data?.message || "خطا در ارتباط با سرور");
    err.status = res.status;
    err.code = data?.code || "HTTP_ERROR";
    err.details = data?.details || null;
    throw err;
  }
  return data;
}
