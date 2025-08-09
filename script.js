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

updateIcon();

function copyToClipboard(button) {
  const messageText = button.parentElement.textContent.replace('📋', '').trim();

  navigator.clipboard.writeText(messageText).then(() => {
    button.textContent = '✅'; // feedback
    setTimeout(() => {
      button.textContent = '📋';
    }, 1500);
  }).catch(err => {
    console.error('Erro ao copiar:', err);
  });
}