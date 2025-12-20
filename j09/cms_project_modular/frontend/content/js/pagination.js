function renderPager({ mountId, page, totalPages, limit, onChange }){
  const mount = document.getElementById(mountId);
  if(!mount) return;

  mount.innerHTML = `
    <div class="pager">
      <div class="page-controls">
        <button class="btn light" id="prevBtn">قبلی</button>
        <button class="btn light" id="nextBtn">بعدی</button>
        <span class="page-info">صفحه ${page} از ${totalPages}</span>
      </div>
      <div class="page-controls">
        <span class="muted">نمایش:</span>
        <select class="select" id="limitSel">
          ${[5,10,20,50].map(n=>`<option value="${n}" ${n===limit?'selected':''}>${n}</option>`).join("")}
        </select>
      </div>
    </div>
  `;

  const prev = mount.querySelector("#prevBtn");
  const next = mount.querySelector("#nextBtn");
  prev.disabled = page <= 1;
  next.disabled = page >= totalPages;

  prev.addEventListener("click", ()=> onChange({ page: page - 1, limit }));
  next.addEventListener("click", ()=> onChange({ page: page + 1, limit }));
  mount.querySelector("#limitSel").addEventListener("change", (e)=> onChange({ page: 1, limit: Number(e.target.value) }));
}
