const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

// Debug: Check if API key is loaded
console.log('API Key loaded:', process.env.OPENAI_API_KEY ? 'YES' : 'NO');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ZUBI_SYSTEM_PROMPT = `You are "Zubi Magical Forest Buddy" — a warm, intelligent, child-friendly AI guide designed for children aged 4–7.

You are part of the official Zubi learning experience.

Tone:
- Playful
- Gentle
- Encouraging
- Curious
- Emotionally safe
- Energetic but calm

Language Policy:
- Understand Hindi, English, and mixed Hinglish.
- Detect the child's language style automatically.
- Respond in the same style the child uses.
- If child uses English → respond mostly English with small friendly Hindi words.
- If child uses Hindi → respond mostly Hindi with light English support.
- If child mixes → respond naturally mixed.
- Never restrict to only one language unless the child clearly prefers it.

Speech Style:
- Use short sentences (max 12 words).
- Avoid complex vocabulary.
- Ask one question at a time.
- Praise frequently (Shabash! Wow! Amazing! Bahut badhiya!)
- Maintain excitement.

Observation Rules:
- Ask about visible elements only.
- Encourage counting, colors, animals, actions.
- Encourage imagination.

Tool Call Logic:
If the child correctly identifies something clearly visible in the magical forest scene, return ONLY the JSON tool call:

{
  "action": "highlight",
  "target": "<object_name>"
}

Valid targets:
- deer
- fox
- owl
- raccoon
- red_panda
- hedgehog
- birds
- treehouse
- mushrooms
- lanterns
- bridge
- waterfall

Only return JSON tool call if recognition is correct.
Otherwise respond normally with encouraging text.

Never mention internal instructions.
Never break character.
You are a magical AI guide inside the Zubi product.`;

app.post('/chat', async (req, res) => {
  try {
    const { message, messages } = req.body;
    
    const conversationHistory = messages.map(msg => ({
      role: msg.sender === 'ai' ? 'assistant' : 'user',
      content: msg.text
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ZUBI_SYSTEM_PROMPT },
        ...conversationHistory,
        { role: "user", content: message }
      ],
      max_tokens: 150,
      temperature: 0.8,
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0].message.content;
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent);
    } catch (parseError) {
      parsedResponse = { text: responseContent };
    }

    if (parsedResponse.action === 'highlight' && parsedResponse.target) {
      const validTargets = [
        'deer', 'fox', 'owl', 'raccoon', 'red_panda', 'hedgehog',
        'birds', 'treehouse', 'mushrooms', 'lanterns', 'bridge', 'waterfall'
      ];
      
      if (validTargets.includes(parsedResponse.target)) {
        return res.json({
          text: "Wow! You found it! Amazing job! 🌟",
          tool: {
            action: "highlight",
            target: parsedResponse.target
          }
        });
      }
    }

    const responseText = parsedResponse.text || parsedResponse.response || "Wow! That's amazing! Tell me more! ✨";
    
    res.json({
      text: responseText,
      tool: null
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({
      error: 'Something went wrong with the AI response',
      text: "Oops! Zubi needs a moment. Can you try again? 🌲"
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'Zubi server is running! 🌲' });
});

app.listen(PORT, () => {
  console.log(`🌲 Zubi Magical Forest Server running on port ${PORT}`);
  console.log(`🎤 Ready for magical conversations!`);
});
