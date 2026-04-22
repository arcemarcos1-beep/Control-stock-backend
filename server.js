const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));

const APP_TOKEN = process.env.APP_TOKEN; // configurar en Render

// Middleware: verificar token en todas las rutas protegidas
function checkToken(req, res, next) {
  if (!APP_TOKEN || req.headers['x-app-token'] !== APP_TOKEN) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
}

app.get('/health', (req, res) => res.json({ status: 'ok', ia: 'claude' }));

app.post('/api/analizar', checkToken, async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000);
