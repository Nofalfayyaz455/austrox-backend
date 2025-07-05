const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ CORS setup to allow your frontend on Vercel
app.use(cors({
  origin: 'https://austrox-gpt.vercel.app', // ✅ Replace with your actual deployed frontend
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Main AI chat route
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  const selectedModel = req.body.model || 'meta-llama/llama-3-70b-instruct';
  const systemPrompt = req.body.system || "You are AustroX-GPT, a helpful assistant created by Nofal Fayyaz in Pakistan.";

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
          'HTTP-Referer': 'https://austrox-gpt.vercel.app',
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
