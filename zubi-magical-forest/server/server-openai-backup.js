const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* --------------------------
   IMAGE GROUNDING CONTEXT
-------------------------- */

const IMAGE_OBJECTS = [
  "boy",
  "girl",
  "deer",
  "fox",
  "owl",
  "red panda",
  "raccoons",
  "hedgehog",
  "birds",
  "lanterns",
  "bridge",
  "waterfall",
  "mountains",
  "mushrooms",
  "moon",
  "stars"
];

/* --------------------------
   SYSTEM PROMPT
-------------------------- */

const ZUBI_SYSTEM_PROMPT = `
You are Zubi Buddy, a magical forest AI guide for children aged 4–7.

You are interacting about a specific magical forest image.

IMAGE OBJECTS:
${IMAGE_OBJECTS.join(", ")}

STRICT BEHAVIOR RULES:

1. Only consider objects listed above as valid.
2. If child mentions listed object → classification = "correct"
3. If mentions object not in list → classification = "incorrect"
4. If vague statement → classification = "unclear"
5. If unrelated question → classification = "unrelated"

DO NOT:
- Praise incorrect answers
- Default to saying "Amazing"
- Repeat same question
- Invent new objects

LANGUAGE RULES:
- Match child’s dominant language (English, Hindi, or Hinglish).
- Do not randomly switch language.
- Keep responses short (1–2 sentences).
- Do not speak emojis aloud.

RESPONSE FORMAT (MANDATORY JSON ONLY):

{
  "classification": "correct | incorrect | unclear | unrelated",
  "text": "child-friendly response",
  "highlight": "object_name_or_null"
}

If classification is "correct":
- highlight must contain object name (exact match from list)

If not correct:
- highlight must be null

Return ONLY valid JSON.
Do NOT include extra text.
`;

/* --------------------------
   SIMPLE LANGUAGE DETECTION
-------------------------- */

function detectLanguage(text) {
  const hindiRegex = /[ऀ-ॿ]/;
  const englishRegex = /[a-zA-Z]/;

  const hasHindi = hindiRegex.test(text);
  const hasEnglish = englishRegex.test(text);

  if (hasHindi && hasEnglish) return "hinglish";
  if (hasHindi) return "hindi";
  return "english";
}

/* --------------------------
   CHAT ROUTE
-------------------------- */

app.post('/chat', async (req, res) => {
  try {
    const { message, messages } = req.body;

    // FIRST MESSAGE (Fixed Welcome)
    if (!messages || messages.length === 0) {
      return res.json({
        text: "Namaste dost! 🌙✨\nWelcome to our magical forest.\nDhyaan se dekho… what do you notice first?",
        tool: null
      });
    }

    const childLanguage = detectLanguage(message);

    console.log("Sending to OpenAI:", message);

    const conversationHistory = [
      { role: "system", content: ZUBI_SYSTEM_PROMPT },
      ...messages.map(msg => ({
        role: msg.sender === "ai" ? "assistant" : "user",
        content: msg.text
      })),
      { role: "user", content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: conversationHistory,
      temperature: 0.2,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "zubi_response",
          schema: {
            type: "object",
            properties: {
              classification: {
                type: "string",
                enum: ["correct", "incorrect", "unclear", "unrelated"]
              },
              text: { type: "string" },
              highlight: { type: ["string", "null"] }
            },
            required: ["classification", "text", "highlight"],
            additionalProperties: false
          }
        }
      }
    });

    const raw = completion.choices[0].message.content;
    console.log("Raw model output:", raw);

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("Invalid JSON from model:", raw);

      return res.json({
        text:
          childLanguage === "hindi"
            ? "Chalo dhyaan se dobara dekhein 😊 Kaunse jaanwar dikh rahe hain?"
            : "Let's look carefully again 😊 What animals can you see?",
        tool: null
      });
    }

    // Safety check
    if (!parsed.classification || !parsed.text) {
      return res.json({
        text: "Let's look carefully again 😊 What can you see?",
        tool: null
      });
    }

    // Validate highlight
    let tool = null;
    if (
      parsed.classification === "correct" &&
      parsed.highlight &&
      IMAGE_OBJECTS.includes(parsed.highlight)
    ) {
      tool = {
        action: "highlight",
        target: parsed.highlight
      };
    }

    res.json({
      text: parsed.text,
      tool
    });

  } catch (error) {
    console.error("Chat Error:", error);

    res.status(500).json({
      text: "Oops! Zubi needs a little magic break ✨ Try again!",
      tool: null
    });
  }
});

/* --------------------------
   HEALTH CHECK
-------------------------- */

app.get('/health', (req, res) => {
  res.json({ status: "Zubi server running 🌲" });
});

/* --------------------------
   START SERVER
-------------------------- */

app.listen(PORT, () => {
  console.log(`🌲 Zubi Magical Forest Server running on port ${PORT}`);
});