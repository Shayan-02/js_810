import { apiRequest } from "./api.js";
import { createModal } from "./modal.js";

const modal = createModal();

document.querySelector("#formRegister").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = {
    firstName: String(fd.get("firstName") ?? "").trim(),
    lastName: String(fd.get("lastName") ?? "").trim(),
    username: String(fd.get("username") ?? "").trim(),
    nationalId: String(fd.get("nationalId") ?? "").trim(),
    password: String(fd.get("password") ?? "").trim(),
  };

  try {
    const res = await apiRequest("/api/auth/register", { method: "POST", body: payload });
    await modal.success("ثبت‌نام موفق", `شماره کارت شما: ${res.data.cardNumber}`);
    window.location.href = "/dashboard.html";
  } catch (err) {
    await modal.error("خطا", err.message || "ثبت‌نام ناموفق");
  }
});

document.querySelector("#btnToLogin").addEventListener("click", () => {
  window.location.href = "/index.html";
});
