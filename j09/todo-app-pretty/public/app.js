const list = document.getElementById("list");
const form = document.getElementById("form");
const input = document.getElementById("input");
const clearDoneBtn = document.getElementById("clearDoneBtn");
const emptyEl = document.getElementById("empty");

const statAll = document.getElementById("statAll");
const statDone = document.getElementById("statDone");
const statOpen = document.getElementById("statOpen");

let todos = [];

// درخواست ساده به سرور
async function api(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) throw new Error("خطا در ارتباط با سرور");
  return res.status === 204 ? null : res.json();
}

// گرفتن todo ها
async function loadTodos() {
  todos = await api("/api/todos");
  updateStats();
  render();
}

// آپدیت آمار
function updateStats() {
  const doneCount = todos.filter((t) => t.done).length;
  statAll.textContent = todos.length;
  statDone.textContent = doneCount;
  statOpen.textContent = todos.length - doneCount;
}

// ساخت لیست
function render() {
  list.innerHTML = "";
  emptyEl.classList.toggle("hidden", todos.length !== 0);

  todos.forEach((t) => {
    const li = document.createElement("li");
    li.className = "item" + (t.done ? " is-done" : "");

    // سمت چپ
    const left = document.createElement("div");
    left.className = "item__left";

    const checkBtn = document.createElement("button");
    checkBtn.className = "check" + (t.done ? " is-done" : "");
    checkBtn.textContent = "✓";
    checkBtn.onclick = async () => {
      await api(`/api/todos/${t.id}/toggle`, { method: "PATCH" });
      loadTodos();
    };

    const textWrap = document.createElement("div");
    textWrap.className = "item__text";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = t.title;
    title.onclick = async () => {
      await api(`/api/todos/${t.id}/toggle`, { method: "PATCH" });
      loadTodos();
    };

    textWrap.appendChild(title);

    left.appendChild(checkBtn);
    left.appendChild(textWrap);

    // سمت راست
    const actions = document.createElement("div");
    actions.className = "item__actions";

    const delBtn = document.createElement("button");
    delBtn.className = "iconbtn danger";
    delBtn.textContent = "🗑";
    delBtn.onclick = async () => {
      await api(`/api/todos/${t.id}`, { method: "DELETE" });
      loadTodos();
    };

    actions.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(actions);

    list.appendChild(li);
  });
}

// افزودن todo
form.onsubmit = async (e) => {
  e.preventDefault();

  const title = input.value.trim();
  if (!title) return;

  await api("/api/todos", {
    method: "POST",
    body: JSON.stringify({ title }),
  });

  input.value = "";
  input.focus();
  loadTodos();
};

// حذف همه انجام‌شده‌ها
clearDoneBtn.onclick = async () => {
  const doneTodos = todos.filter((t) => t.done);
  for (const t of doneTodos) {
    await api(`/api/todos/${t.id}`, { method: "DELETE" });
  }
  loadTodos();
};
