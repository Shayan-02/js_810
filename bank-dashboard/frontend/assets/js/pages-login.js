import { apiRequest } from "./api.js";
import { createModal } from "./modal.js";

const modal = createModal();

document.querySelector("#formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const username = String(fd.get("username") ?? "").trim();
  const password = String(fd.get("password") ?? "").trim();

  try {
    await apiRequest("/api/auth/login", { method: "POST", body: { username, password } });
    await modal.success("ورود موفق", "به داشبورد هدایت می‌شوید.");
    window.location.href = "/dashboard.html";
  } catch (err) {
    await modal.error("خطا", err.message || "ورود ناموفق");
  }
});

document.querySelector("#btnToRegister").addEventListener("click", () => {
  window.location.href = "/register.html";
});
