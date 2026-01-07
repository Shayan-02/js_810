function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function createModal(rootSelector = "#modal-root") {
  const root = document.querySelector(rootSelector);
  if (!root) throw new Error("Modal root not found");

  function open({ title, message, okText, cancelText = null, danger = false }) {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "modal-overlay";
      overlay.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true">
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(message)}</p>
          <div class="modal-actions">
            ${cancelText ? `<button class="btn" data-action="cancel">${escapeHtml(cancelText)}</button>` : ""}
            <button class="btn ${danger ? "danger" : "primary"}" data-action="ok">${escapeHtml(okText)}</button>
          </div>
        </div>
      `;

      const cleanup = (value) => { overlay.remove(); resolve(value); };

      overlay.addEventListener("click", (e) => { if (e.target === overlay) cleanup(false); });
      overlay.querySelector('[data-action="ok"]').addEventListener("click", () => cleanup(true));
      const cancelBtn = overlay.querySelector('[data-action="cancel"]');
      if (cancelBtn) cancelBtn.addEventListener("click", () => cleanup(false));

      root.appendChild(overlay);
    });
  }

  return {
    info: (t, m) => open({ title: t, message: m, okText: "باشه" }),
    success: (t, m) => open({ title: t, message: m, okText: "عالی" }),
    error: (t, m) => open({ title: t, message: m, okText: "متوجه شدم" }),
    confirm: (t, m, opts = {}) => open({
      title: t, message: m,
      okText: opts.confirmText ?? "تأیید",
      cancelText: opts.cancelText ?? "انصراف",
      danger: Boolean(opts.danger)
    })
  };
}
