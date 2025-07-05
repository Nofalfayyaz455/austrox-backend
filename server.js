const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  const selectedModel = req.body.model || 'meta-llama/llama-3-70b-instruct';
  const systemPrompt = req.body.system || "You are AustroX-GPT, a helpful assistant created \'Nofal Fayyaz In Pakistan.";

  console.log("User:", userMessage);
  console.log("Model:", selectedModel);

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: selectedModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3001',
          'X-Title': 'AustroX-GPT'
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    console.log("AI:", reply);
    res.json({ reply });

  } catch (err) {
    console.error("❌ OpenRouter Error:", err.response?.data || err.message);
    res.status(500).json({ reply: "⚠️ API error. Check console." });
  }
});

