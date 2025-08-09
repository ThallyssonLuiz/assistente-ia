const body = document.body;
const toggleBtn = document.getElementById("themeToggle");
const input = document.getElementById("userInput");
const button = document.getElementById("sendBtn");
const chatArea = document.querySelector(".chat-area");
const inputKeyApi = document.getElementById("inputApiKey");

inputKeyApi.addEventListener("keydown", function(event) {
  if (event.key == "Enter") {
    const chaveAPI = inputKeyApi.value.trim();
    if (chaveAPI) {
      localStorage.setItem("OPEN_API_KEY", chaveAPI);
      console.log("Chave salva no navegador");
      alert("Chave salva com sucesso!");
      inputKeyApi.value = "";
    }
  }
})

button.addEventListener("click", async() => {
  const textoUsuario = input.value.trim();
  if (!textoUsuario) return;

  const chave = localStorage.getItem("OPEN_API_KEY");

  if (!chave) {
    alert("Por favor, insira sua chave da API antes de enviar mensagens.");
    return;
  }

  let mensagens = JSON.parse(localStorage.getItem('conteudoUsuario')) || [];
  mensagens.push(textoUsuario);
  localStorage.setItem('conteudoUsuario', JSON.stringify(mensagens));
  //localStorage.setItem('conteudoUsuario', textoUsuario);

  //nesse ponto, o innerHTML é responsável por adicionar essa mensagem como um elemento dentro do bloco do chat
  chatArea.innerHTML += `
    <div class="message user">
      <div class="text">${textoUsuario}</div>
      <div class="avatar">👤</div>
    </div>
  `;

  input.value = "";

  //já nessa parte, é onde será enviada a dúvida ou consideração ao servidor
  try {
    const response = await fetch('/mensagem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      //nesse ponto, o stringify transforma o objeto recebido em json
      body: JSON.stringify({ 
        chave: chave,
        mensagem: textoUsuario 
      })
    });

    const data = await response.json();
    const respostaIA = data.resposta;

    let respostas = JSON.parse(localStorage.getItem('conteudoIA')) || [];
    respostas.push(respostaIA);
    localStorage.setItem('conteudoIA', JSON.stringify(respostas));


    chatArea.innerHTML += `
      <div class="message bot">
        <div class="avatar">
          <img src="imgs/lily.jpg" alt="Avatar do Assistente">
        </div>
        <div class="text">${respostaIA}</div>
      </div>
      `;
  } catch(error) {
    console.error("Erro:", error)
  }
});

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
