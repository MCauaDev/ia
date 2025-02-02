const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = 3000;

// Configuração da API Gemini
const API_KEY = 'AIzaSyAtoxg6QpRrOjxLj00wty83GZV0m_TiXnI'; // Substitua pela sua chave da API
const genAI = new GoogleGenerativeAI(API_KEY);
const modelo = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

app.use(cors());
app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    
    if (!userMessage) {
        return res.status(400).json({ error: 'Mensagem vazia' });
    }

    try {
        const chat = modelo.startChat({ history: [] });
        const resultado = await chat.sendMessage(userMessage);
        const resposta = await resultado.response;
        const texto = resposta.text();

        res.json({ reply: texto || 'Sem resposta disponível.' });
    } catch (error) {
        console.error('Erro ao processar a resposta:', error);
        res.status(500).json({ error: 'Erro ao obter resposta da IA' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});