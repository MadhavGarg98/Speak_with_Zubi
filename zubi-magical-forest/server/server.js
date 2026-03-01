const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest"
});

/* ------------------ IMAGE OBJECTS ------------------ */

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

/* ------------------ SYSTEM PROMPT ------------------ */

const SYSTEM_PROMPT = `
You are Zubi Buddy, a magical forest AI guide for children aged 4–7.

STRICT RULES:

IMAGE OBJECTS:
${IMAGE_OBJECTS.join(", ")}

1. Only treat these objects as valid.
2. If child mentions listed object → classification = "correct".
3. If object not in list → classification = "incorrect".
4. If vague statement → classification = "unclear".
5. If unrelated question → classification = "unrelated".
6. Praise only when classification = "correct".
7. Do NOT praise incorrect answers.
8. Do NOT default to "Amazing" or "Wow".
9. Keep response short (1–2 sentences).
10. Match child language (Hindi / English / Hinglish).
11. Do NOT speak emojis aloud.
12. Do NOT hallucinate objects.
13. Follow-up question must logically connect.

RESPONSE FORMAT (MANDATORY JSON ONLY):

{
  "classification": "correct | incorrect | unclear | unrelated",
  "text": "short child friendly reply",
  "highlight": "object_name_or_null"
}

Return ONLY JSON.
Do not add explanation.
`;

/* ------------------ LANGUAGE DETECTION ------------------ */

function detectLanguage(text) {
  const hindiRegex = /[ऀ-ॿ]/;
  const englishRegex = /[a-zA-Z]/;

  const hasHindi = hindiRegex.test(text);
  const hasEnglish = englishRegex.test(text);

  if (hasHindi && hasEnglish) return "hinglish";
  if (hasHindi) return "hindi";
  return "english";
}

/* ------------------ CHAT ROUTE ------------------ */

app.post("/chat", async (req, res) => {
  try {
    const { message, messages } = req.body;

    // First Welcome Message
    if (!messages || messages.length === 0) {
      return res.json({
        text: "Namaste dost! 🌙✨\nWelcome to our magical forest.\nDhyaan se dekho… what do you notice first?",
        tool: null
      });
    }

    const prompt = `
${SYSTEM_PROMPT}

Child says: "${message}"
`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.log("Invalid JSON from Gemini:", raw);

      return res.json({
        text: "Chalo dhyaan se dobara dekhein 😊 What animals can you see?",
        tool: null
      });
    }

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

  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({
      text: "Zubi ko thoda sa magic break chahiye ✨ Try again!",
      tool: null
    });
  }
});

/* ------------------ HEALTH CHECK ------------------ */

app.get('/health', (req, res) => {
  res.json({ status: "Zubi Gemini server running 🌲" });
});

/* ------------------ START SERVER ------------------ */

app.listen(3001, () => {
  console.log("🌲 Zubi Gemini Server Running on 3001");
});
