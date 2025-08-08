import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

//Esta etapa se refere às configurações de diretório
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

app.use(cors());
app.use(express.json())
app.use(express.static(path.join(_dirname, 'public')));

const openai = new OpenAI({
    'apiKey': '//ponha sua chave da API aqui'
});

//Essa rota POST é a responsável por receber as mensagens do front
app.post('/mensagem', async (req, res) => {
    const mensagem = req.body.mensagem;

    try {
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
        const resposta = completion.choices[0].message.content;
        res.json({ resposta });
    } catch(error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao gerar a resposta da IA" });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

