function openModal({ title, bodyHTML, onConfirm, confirmText="ثبت", cancelText="لغو" }){
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-head">
      <div class="modal-title">${title}</div>
      <button class="modal-close" aria-label="close">×</button>
    </div>
    <div class="modal-body">${bodyHTML}</div>
    <div class="modal-foot">
      <button class="btn" id="mConfirm">${confirmText}</button>
      <button class="btn light" id="mCancel">${cancelText}</button>
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  function close(){ backdrop.remove(); }

  backdrop.addEventListener("click", (e)=>{ if(e.target === backdrop) close(); });
  modal.querySelector(".modal-close").addEventListener("click", close);
  modal.querySelector("#mCancel").addEventListener("click", close);

  modal.querySelector("#mConfirm").addEventListener("click", async ()=>{
    if(onConfirm){
      const ok = await onConfirm({ modal, close });
      if(ok !== false) close();
    } else close();
  });

  return { close, modal, backdrop };
}

function confirmModal({ title="حذف", message="مطمئنی؟", confirmText="حذف", cancelText="لغو" }){
  return new Promise((resolve)=>{
    const { backdrop, modal } = openModal({
      title,
      bodyHTML: `<p style="margin:0;font-weight:900">${message}</p>`,
      confirmText,
      cancelText,
      onConfirm: () => resolve(true)
    });

    const deny = () => resolve(false);
    backdrop.addEventListener("click", (e)=>{ if(e.target === backdrop) deny(); }, { once:true });
    modal.querySelector(".modal-close").addEventListener("click", deny, { once:true });
    modal.querySelector("#mCancel").addEventListener("click", deny, { once:true });
  });
}
