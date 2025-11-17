const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Carrega as variáveis do .env

const app = express();
const port = 3000;

// 1. Configurações do Servidor
// Permite que o frontend (hospedado no mesmo servidor) fale com o backend
app.use(cors()); 
// Permite receber JSONs grandes (com imagens)
app.use(express.json({ limit: '50mb' }));

// 2. Rota para a API (O "Backend")
// Esta é a rota que o index.html chama
app.post('/generate-enigmas', async (req, res) => {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            throw new Error("API Key não encontrada. Verifique seu arquivo .env");
        }

        // O 'payload' (corpo) enviado pelo frontend (HTML)
        const frontendPayload = req.body; 

        // 3. A chamada segura para a API do Google
        const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        // Usamos o fetch nativo do Node.js (disponível desde a v18)
        const response = await fetch(googleApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(frontendPayload) // Repassa o payload para o Google
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro da API do Google: ${errorText}`);
        }

        const data = await response.json();
        
        // 4. Envia a resposta do Google de volta para o Frontend
        res.json(data);

    } catch (error) {
        console.error('Erro no servidor:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// 5. Rota para o HTML (O "Frontend")
// Serve o arquivo index.html quando você acessa o site
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 6. Inicia o servidor
app.listen(port, () => {
    console.log(`🚀 Ferramenta Local Pronta!`);
    console.log(`Acesse http://localhost:${port} no seu navegador.`);
});