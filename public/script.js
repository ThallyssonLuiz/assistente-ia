document.getElementById('sendBtn').addEventListener('click', async () => {
    const apiKey = document.getElementById('apiKey').value.trim();
    const pergunta = document.getElementById('userInput').value.trim();

    if (!apiKey || !pergunta) {
        alert("Preencha a API key e sua pergunta!");
        return;
    }

    try {
        const resposta = await obterResposta(apiKey, pergunta);
        mostrarResposta(resposta);
    } catch (erro) {
        mostrarResposta("Ocorreu um erro ao buscar a resposta.");
    }
});

// Função para chamar a API da OpenAI
async function obterResposta(apiKey, pergunta) {
    const url = "https://api.openai.com/v1/chat/completions";

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: pergunta }],
            max_tokens: 100
        })
    };

    const response = await fetch(url, requestOptions);
    const data = await response.json();

// Função para mostrar a resposta
function mostrarResposta(texto) {
    const container = document.getElementById('responseContainer');
    const resposta = document.getElementById('responseText');

    resposta.textContent = texto;
    container.style.display = 'block'; // aparece só quando tem resposta
}

// Botão para copiar texto
document.getElementById('copyBtn').addEventListener('click', () => {
    const texto = document.getElementById('responseText').textContent;
    navigator.clipboard.writeText(texto).then(() => {
        alert("Texto copiado para a área de transferência!");
    }).catch(err => {
        console.error("Erro ao copiar:", err);
    });
});

// Botão para limpar resposta
document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('responseContainer').style.display = 'none';
    document.getElementById('responseText').textContent = '';
});

// Copiar para área de transferência
function copyToClipboard(button) {
  const text = button.parentElement.parentElement.innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("Mensagem copiada!");
  });
}

// Exportar como PDF
function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

      back-en-anna
  const element = document.getElementById("bot-response");
  html2canvas(element).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    doc.addImage(imgData, "PNG", 10, 10, 180, 0);
    doc.save("resposta.pdf");
  });
 
//parte de persistência de tema
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
