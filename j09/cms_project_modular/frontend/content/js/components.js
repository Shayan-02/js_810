async function injectPartial(selector, url){
  const el = document.querySelector(selector);
  if(!el) return;
  const html = await (await fetch(url)).text();
  el.innerHTML = html;
}

async function bootLayout(activePage){
  await injectPartial("#asideMount", "./partials/aside.html");
  await injectPartial("#headerMount", "./partials/header.html");

  const nav = document.querySelector("#nav");
  if(nav){
    [...nav.querySelectorAll("a[data-page]")].forEach(a=>{
      if(a.getAttribute("data-page") === activePage) a.classList.add("active");
    });
  }
}

function setHeaderSubtitle(text){
  const role = document.querySelector("#headerMount .role");
  if(role) role.textContent = text;
}
