
import { apiRequest } from "./api.js";

export async function logout() {
  try { await apiRequest("/api/auth/logout", { method: "POST" }); } catch {}
  window.location.href = "/index.html";
}
