const body = document.body;
const toggleBtn = document.getElementById("themeToggle");
const apiKeyInput = document.getElementById('apiKeyInput');

function toggleTheme() {
  body.classList.toggle("dark-mode");
  updateIcon();
  saveThemePreference();
}

function updateIcon() {
  if (body.classList.contains("dark-mode")) {
    toggleBtn.textContent = "☀️";
  } else {
    toggleBtn.textContent = "🌙";
  }
}

function saveThemePreference() {
  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

function loadThemePreference() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
  } else {
    body.classList.remove("dark-mode");
  }
  updateIcon();
}

function loadApiKey() {
  const savedKey = sessionStorage.getItem('geminiApiKey');
  if (savedKey) {
    apiKeyInput.value = savedKey;
  }
}

apiKeyInput.addEventListener('input', () => {
  sessionStorage.setItem('geminiApiKey', apiKeyInput.value.trim());
});


window.onload = () => {
  loadThemePreference();            
};