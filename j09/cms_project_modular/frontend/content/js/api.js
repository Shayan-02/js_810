async function apiGet(url){
  const res = await fetch(url);
  const txt = await res.text();
  if(!res.ok){
    throw new Error(txt || "Request failed");
  }
  try { return JSON.parse(txt); } catch { return txt; }
}

async function apiSend(url, method, payload){
  const res = await fetch(url, {
    method,
    headers: { "Content-Type":"application/json" },
    body: payload ? JSON.stringify(payload) : undefined
  });
  const txt = await res.text();
  if(!res.ok){
    throw new Error(txt || "Request failed");
  }
  try { return JSON.parse(txt); } catch { return txt; }
}
