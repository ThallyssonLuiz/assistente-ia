const body = document.body;
const toggleBtn = document.getElementById("themeToggle");
const input = document.getElementById("userInput");
const button = document.getElementById("sendBtn");
const chatArea = document.querySelector(".chat-area");
const inputKeyApi = document.getElementById("inputApiKey");
const aiSelect = document.getElementById('aiSelect');
 
function switchAI() {
  const selectedAI = aiSelect.value;
  console.log(`Modelo selecionado: ${selectedAI}`);
}

inputKeyApi.addEventListener("keydown", function(event) {
  if (event.key == "Enter") {
    const chaveAPI = inputKeyApi.value.trim();
     const modelo = document.getElementById("aiSelect").value;

    if (modelo === 'gpt4o' && !chaveAPI.startsWith('sk-')) {
      alert("Chave inválida para o modelo GPT-4o.");
      return;
    }

    if (modelo === 'gemini' && !chaveAPI.startsWith('AIza')) {
      alert("Chave inválida para o modelo Gemini.");
      return;
    }
      localStorage.setItem("OPEN_API_KEY", chaveAPI);
      console.log("Chave salva no navegador");
      alert("Chave salva com sucesso!");
      inputKeyApi.value = "";
    }
  })

button.addEventListener("click", async() => {
  const textoUsuario = input.value.trim();
  const chave = localStorage.getItem("OPEN_API_KEY");
    const modelo = document.getElementById("aiSelect").value

  if (!textoUsuario){
    alert("Por favor, digite uma mensagem antes de enviar.");
     return;
    }


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
  
 copy()

  input.value = "";

  //já nessa parte, é onde será enviada a dúvida ou consideração ao servidor
  try {
    const response = await fetch('/mensagem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      //nesse ponto, o stringify transforma o objeto recebido em json
      body: JSON.stringify({ 
        chave: chave,
        mensagem: textoUsuario,
        modelo
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

document.getElementById("exportBtn").addEventListener("click", () => {
  const element = document.getElementById("chatArea");
  html2pdf().from(element).save("chat.pdf");
})

function copy() {
  const msgUser = document.querySelectorAll(".message.user")
  
  msgUser.forEach(msg => {
    if (!msg.querySelector(".copy-btn")) {
      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.innerHTML = `<img id="imgCopy" src="./imgs/copyBlack.svg">`
      msg.appendChild(btn);
    }
  })

}

window.addEventListener('DOMContentLoaded', () => {
  const mensagens = JSON.parse(localStorage.getItem('conteudoUsuario') || '[]');
  const respostas = JSON.parse(localStorage.getItem('conteudoIA') || '[]');

  for (let i=0; i < mensagens.length; i++) {
    chatArea.innerHTML += `
      <div class="message user">
        <div class="text">${mensagens[i]}</div>
        <div class="avatar">👤</div>
      </div>
    `;
    if (respostas[i]) {
      chatArea.innerHTML += `
        <div class="message bot">
          <div class="avatar">
            <img src="imgs/lily.jpg" alt="Avatar do Assistente">
          </div>
          <div class="text">${respostas[i]}</div>
        </div>
      `;
    }
    copy();
  }
});

function toggleTheme() {
  body.classList.toggle("dark-mode");
  updateIcon();
  saveThemePreference();
}

function updateIcon() {
  if (body.classList.contains("dark-mode")) {
    toggleBtn.textContent = "☀️";

    document.querySelectorAll(".copy-btn img").forEach(img => {
      img.src = "./imgs/copy.svg"; 
    });
    
  } else {
    toggleBtn.textContent = "🌙";
    
    document.querySelectorAll(".copy-btn img").forEach(img => {
      img.src = "./imgs/copyBlack.svg";
    });
  }
}

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
}

window.onload = () => {
  loadThemePreference();
  updateIcon(); 
};

/* clipboar */
function copyToClipboard(button) {
  const messageText = button.parentElement.textContent.replace('📋', '').trim();

  navigator.clipboard.writeText(messageText).then(() => {
    button.textContent = '✅'; 
    setTimeout(() => {
      button.textContent = '📋';
    }, 1500);
  }).catch(err => {
    console.error('Erro ao copiar:', err);
  });
}

const userInput = document.getElementById('userInput');
const charCount = document.getElementById('charCount');
const sendBtn = document.getElementById('sendBtn');
const maxLength = 200;

userInput.addEventListener('input', () => {
  const currentLength = userInput.value.length;
  charCount.textContent = `${currentLength} / ${maxLength}`;
});

sendBtn.addEventListener('click', () => {
  userInput.value = '';                      
  charCount.textContent = `0 / ${maxLength}`;
});

document.getElementById("clearBtn").addEventListener("click", () => {
  if (confirm("Tem certeza que deseja limpar todo o chat?")) {
    
    chatArea.innerHTML = `
      <div class="message bot" role="region" aria-label="Mensagem da assistente Lily">
        <div class="avatar">
          <img src="imgs/lily.jpg" alt="Avatar da assistente Lily">
        </div>
        <div class="text">
          Olá! Como posso te ajudar hoje?📋
        </div>
      </div>
    `;

    
    localStorage.removeItem("conteudoUsuario");
    localStorage.removeItem("conteudoIA");
  }
});
