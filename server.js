const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const PORT = process.env.PORT;
if (!PORT) {
  throw new Error("❌ Railway PORT not found in environment!");
}

app.use(cors());
app.use(express.json());

// ========== API Endpoint ==========
app.post('/api/chat', async (req, res) => {
  console.log("🔐 OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY);
  console.log("🛬 Incoming Body:", req.body); // 👈 See what's coming in

  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "❌ Missing 'message' in request body." });
  }

  const selectedModel = req.body.model || 'meta-llama/llama-3-70b-instruct';

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: selectedModel,
        messages: [
          { role: 'system', content: 'You are AustroX-GPT, an intelligent AI assistant.' },
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

    const aiReply = response.data.choices[0].message.content;
    res.json({ reply: aiReply });

  } catch (err) {
    console.error("❌ OpenRouter Error:", err.response?.data || err.message);
    res.status(500).json({ reply: "⚠️ OpenRouter API error. Check logs." });
  }
});

// ========== Health check ==========
app.get('/', (req, res) => {
  res.send('✅ AustroX Backend is running.');
});

app.listen(PORT, () => {
  console.log(`✅ AustroX-GPT server running on port ${PORT}`);
});
