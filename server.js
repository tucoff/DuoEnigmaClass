const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

// Configurações originais que funcionavam
app.use(cors());
// Aumentamos o limite para 50mb para aguentar as imagens em Base64
app.use(express.json({ limit: '50mb' }));

app.post('/generate-enigmas', async (req, res) => {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) throw new Error("API Key não configurada no .env");

        // Recebe as imagens JÁ em Base64 e o prompt do frontend
        const { images, prompt } = req.body;

        const parts = [{ text: prompt }];

        // Adiciona as imagens que vieram do HTML ao payload do Gemini
        if (images && images.length > 0) {
            images.forEach(base64String => {
                // Remove o cabeçalho do base64 se vier (ex: "data:image/jpeg;base64,")
                const cleanBase64 = base64String.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
                
                parts.push({
                    inline_data: {
                        mime_type: "image/jpeg",
                        data: cleanBase64
                    }
                });
            });
        }

        const googlePayload = {
            contents: [{ parts: parts }],
            generationConfig: {
                response_mime_type: "application/json"
            }
        };

        const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(googleApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(googlePayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Google API Error: ${errorText}`);
        }

        const data = await response.json();
        
        let enigmasText = "";
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            enigmasText = data.candidates[0].content.parts[0].text;
        }

        res.json({ enigmasText });

    } catch (error) {
        console.error('Erro no servidor:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});