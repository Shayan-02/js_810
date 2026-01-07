// Add your JavaScript code here
const btn = document.querySelector('#toggleTheme');

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme);

btn.addEventListener('click', () => {
  const current = localStorage.getItem('theme');
  const next = current === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', next);
  applyTheme(next);
});