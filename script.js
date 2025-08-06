const body = document.body;
const toggleBtn = document.getElementById("themeToggle");

function toggleTheme() {
  body.classList.toggle("dark-mode");
  updateIcon();
}

function updateIcon() {
  if (body.classList.contains("dark-mode")) {
    toggleBtn.textContent = "☀️";
  } else {
    toggleBtn.textContent = "🌙";
  }
}

updateIcon();
