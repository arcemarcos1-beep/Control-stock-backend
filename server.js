const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
 
const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));
 
app.post('/api/analizar', async (req, res) => {
  try {
    const { prompt, imageBase64, mimeType } = req.body;
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mimeType, data: imageBase64 } }
            ]
          }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1000 }
        })
      }
    );
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 
app.get('/health', (req, res) => res.json({ status: 'ok', ia: 'gemini' }));
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

