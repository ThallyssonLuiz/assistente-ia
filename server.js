import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

//Esta etapa se refere às configurações de diretório
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

app.use(cors());
app.use(express.json())
app.use(express.static(path.join(_dirname, 'public')));

async function handleGPT4o(apiKey, mensagem) {
    const openai = new OpenAI({ apiKey: apiKey});
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Você será uma assistente virtual do grupo Boticário, chamada Lily. Você retornará informações úteis de forma resumida(com no máximo 400 caracteres), em português do Brasil. O Grupo Boticário é um conglomerado brasileiro de beleza que engloba diversas marcas, sendo elas: O Boticário, Eudora, Quem Disse, Berenice?, Vult, O.U.i., Dr. Jones, e a plataforma de beleza online, Beleza na Web. Além dessas, o grupo também licencia marcas como Australian Gold, Bio-Oil, Nuxe e Pampers."
            },
            {
                role: "user",
                content: mensagem
            },
        ],
        store: true,
    });
    return completion.choices[0].message.content;
}

// Função para lidar com Gemini 2.5 Flash
async function handleGemini(apiKey, mensagem) {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: "Você será uma assistente virtual do grupo Boticário, chamada Lily. Você retornará informações úteis de forma resumida(com no máximo 400 caracteres), em português do Brasil. O Grupo Boticário é um conglomerado brasileiro de beleza que engloba diversas marcas, sendo elas: O Boticário, Eudora, Quem Disse, Berenice?, Vult, O.U.i., Dr. Jones, e a plataforma de beleza online, Beleza na Web. Além dessas, o grupo também licencia marcas como Australian Gold, Bio-Oil, Nuxe e Pampers."},  
                            { text: mensagem }, // Envia a mensagem diretamente
                        ],
                    },
                ],
            }),
        }
    );
    
    
    if (!response.ok) {
        const errorMsg = (await response.json())?.error?.message || "Erro na requisição";
        throw new Error(errorMsg);
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

//Essa rota POST é a responsável por receber as mensagens do front
app.post('/mensagem', async (req, res) => {
    const { chave, mensagem, modelo } = req.body;
    //const mensagem = req.body.mensagem;

    if (!chave) {
        return res.status(400).json({ erro: "Chave da API não fornecida" });
    }

     if (!mensagem) {
        return res.status(400).json({ erro: "Mensagem não fornecida" });
    }

    try {
        // Chama diretamente a função correspondente ao modelo
        const resposta = modelo === 'gpt4o'
            ? await handleGPT4o(chave, mensagem)
            : await handleGemini(chave, mensagem)

        res.json({ resposta });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao gerar a resposta da IA" });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

