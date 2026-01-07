import { apiRequest } from "./api.js";
import { createModal } from "./modal.js";
import { logout } from "./auth.js";

const modal = createModal();
let profile = null;

// elements
const elUserName = document.querySelector("#userName");
const elCardBalance = document.querySelector("#cardBalance");
const elCardNumber = document.querySelector("#cardCardNumber");
const elCardStats = document.querySelector("#cardStats");
const elAccountInfo = document.querySelector("#accountInfo");

const formDeposit = document.querySelector("#formDeposit");
const formWithdraw = document.querySelector("#formWithdraw");
const formChangePassword = document.querySelector("#formChangePassword");

const btnLogout = document.querySelector("#btnLogout");
const btnLogoutTop = document.querySelector("#btnLogoutTop");
const btnDeleteAccount = document.querySelector("#btnDeleteAccount");

const btnToggleSidebar = document.querySelector("#btnToggleSidebar");
const sidebar = document.querySelector("#sidebar");

function money(n) {
  return Number(n ?? 0).toLocaleString("fa-IR");
}

function render() {
  if (!profile) return;

  elUserName.textContent = `${profile.firstName} ${profile.lastName}`;

  elCardBalance.innerHTML = `
    <div class="muted">موجودی</div>
    <div style="font-size:28px;font-weight:800;margin-top:6px">${money(
      profile.balance
    )} تومان</div>
  `;

  elCardNumber.innerHTML = `
    <div class="muted">شماره کارت</div>
    <div style="font-size:18px;font-weight:800;margin-top:6px;letter-spacing:.8px">${profile.cardNumber}</div>
    <button class="btn" style="margin-top:10px" id="btnCopyCard">کپی</button>
  `;

  elAccountInfo.innerHTML = `
    <h3 style="margin:0 0 10px">اطلاعات حساب</h3>
    <div class="kv"><div class="k">نام</div><div class="v">${profile.firstName}</div></div>
    <div class="kv"><div class="k">نام خانوادگی</div><div class="v">${profile.lastName}</div></div>
    <div class="kv"><div class="k">نام کاربری</div><div class="v">${profile.username}</div></div>
    <div class="kv"><div class="k">کد ملی</div><div class="v">${profile.nationalId}</div></div>
    <div class="kv"><div class="k">شماره کارت</div><div class="v">${profile.cardNumber}</div></div>
  `;

  document
    .querySelector("#btnCopyCard")
    ?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(profile.cardNumber);
        await modal.success("کپی شد", "شماره کارت در کلیپ‌بورد کپی شد.");
      } catch {
        await modal.error("خطا", "امکان کپی وجود ندارد.");
      }
    });
}

async function loadProfile() {
  try {
    const res = await apiRequest("/api/account/me");
    profile = res.data;
    render();
  } catch (err) {
    if (err.status === 401) {
      await modal.error("نیاز به ورود", "لطفاً وارد شوید.");
      window.location.href = "/index.html";
      return;
    }
    await modal.error("خطا", err.message || "خطا در دریافت اطلاعات");
  }
}

btnLogout?.addEventListener("click", () => logout());
btnLogoutTop?.addEventListener("click", () => logout());

btnToggleSidebar?.addEventListener("click", () =>
  sidebar.classList.toggle("open")
);

document.querySelectorAll("[data-scroll]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = document.querySelector(btn.getAttribute("data-scroll"));
    target?.scrollIntoView({ behavior: "smooth" });
    document
      .querySelectorAll(".menu button")
      .forEach((x) => x.classList.remove("active"));
    btn.classList.add("active");
    sidebar.classList.remove("open");
  });
});

formDeposit.addEventListener("submit", async (e) => {
  e.preventDefault();
  const amount = String(new FormData(formDeposit).get("amount") ?? "").trim();
  try {
    const res = await apiRequest("/api/account/deposit", {
      method: "POST",
      body: { amount },
    });
    profile.balance = res.data.balance;
    render();
    formDeposit.reset();
    await modal.success("موفق", res.message || "واریز انجام شد");
  } catch (err) {
    await modal.error("خطا", err.message || "واریز ناموفق");
  }
});

formWithdraw.addEventListener("submit", async (e) => {
  e.preventDefault();
  const amount = String(new FormData(formWithdraw).get("amount") ?? "").trim();
  try {
    const res = await apiRequest("/api/account/withdraw", {
      method: "POST",
      body: { amount },
    });
    profile.balance = res.data.balance;
    render();
    formWithdraw.reset();
    await modal.success("موفق", res.message || "برداشت انجام شد");
  } catch (err) {
    await modal.error("خطا", err.message || "برداشت ناموفق");
  }
});

formChangePassword.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(formChangePassword);
  const currentPassword = String(fd.get("currentPassword") ?? "").trim();
  const newPassword = String(fd.get("newPassword") ?? "").trim();
  const confirmNewPassword = String(fd.get("confirmNewPassword") ?? "").trim();

  if (newPassword !== confirmNewPassword) {
    await modal.error("خطا", "رمز جدید و تکرار آن یکسان نیستند");
    return;
  }

  try {
    const res = await apiRequest("/api/account/change-password", {
      method: "POST",
      body: { currentPassword, newPassword },
    });
    formChangePassword.reset();
    await modal.success("موفق", res.message || "رمز عبور تغییر کرد");
  } catch (err) {
    await modal.error("خطا", err.message || "تغییر رمز ناموفق");
  }
});

btnDeleteAccount.addEventListener("click", async () => {
  const ok = await modal.confirm(
    "حذف حساب",
    "این عملیات غیرقابل بازگشت است. مطمئن هستید؟",
    { confirmText: "بله، حذف کن", cancelText: "انصراف", danger: true }
  );
  if (!ok) return;

  try {
    const res = await apiRequest("/api/account", { method: "DELETE" });
    await modal.success("انجام شد", res.message || "حساب حذف شد");
    await logout();
  } catch (err) {
    await modal.error("خطا", err.message || "حذف حساب ناموفق");
  }
});

loadProfile();
