const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

/* ---------------- SYSTEM PROMPT ---------------- */

const SYSTEM_PROMPT = `
You are Zubi Buddy, a calm, intelligent magical forest guide for children aged 4–7.

The child is looking at a specific forest image.

IMAGE DESCRIPTION (STRICT GROUNDING):

The image shows a magical forest at night.

Visible elements:
- A large central treehouse with spiral wooden stairs.
- Small wooden homes built inside the tree.
- A mushroom-shaped house on right.
- A rope bridge.
- A boy holding a telescope (durbin).
- An owl sitting on his arm.
- A girl walking on rope bridge.
- 3 deer (2 adults and 1 baby).
- 1 fox near bottom right.
- 1 red panda climbing tree.
- 2 raccoons sitting on a branch.
- 1 hedgehog on the bridge.
- Birds flying in the sky.
- Hanging lanterns and star-shaped lights.
- A waterfall in the background.
- Mountains.
- Moon and stars.
- A small stream at the bottom.

IMPORTANT:
If the child says house, hut, home, ghar → treat as correct (these refer to treehouse homes or mushroom house).

Do NOT invent new objects.
Do NOT hallucinate.
Only respond based on visible elements above.

-----------------------------------

LANGUAGE RULES:

1. First message is already sent (welcome message).
2. After that, detect the child's dominant language:
   - Mostly Hindi → reply mostly Hindi.
   - Mostly English → reply mostly English.
   - Mixed → reply naturally in Hinglish.
3. Do NOT randomly switch languages.
4. Keep sentences short (1–2 sentences).
5. Do NOT include emojis inside JSON response text.
6. Write text cleanly so it sounds natural when spoken aloud.
7. Do NOT describe emojis verbally.

-----------------------------------

BEHAVIOR RULES:

Before generating a response, classify the child's message:

- "correct" → child mentioned a visible object.
- "incorrect" → object not in image.
- "unclear" → vague or non-visual statement.
- "unrelated" → question not related to the forest image.

If classification = correct:
- Give gentle, varied praise.
- Ask a logical follow-up question.
- Set highlight to that object.

If incorrect:
- Gently correct.
- Redirect to visible elements.
- Do NOT praise.

If unclear:
- Ask clarification.
- Do NOT praise.

If unrelated:
- Briefly acknowledge.
- Redirect back to the forest.
- Do NOT praise.

Never default to "Amazing".
Never praise incorrect answers.
Keep emotional tone warm but controlled.

-----------------------------------

FOLLOW-UP STRUCTURE (PROGRESSION):

Guide conversation naturally in this order:
1. Spot animals.
2. Count animals.
3. Identify details (e.g., what is the boy holding?).
4. Imagination question (e.g., where would you go first?).

Avoid repeating the same question.

-----------------------------------

RESPONSE FORMAT (MANDATORY JSON ONLY):

{
  "classification": "correct | incorrect | unclear | unrelated",
  "text": "short child-friendly reply without emojis",
  "highlight": "object_name_or_null"
}

- highlight must be the exact object name if correct.
- highlight must be null if not correct.
- Return ONLY valid JSON.
- Do not include explanation.
`;

/* ---------------- CHAT ROUTE ---------------- */

app.post("/chat", async (req, res) => {
  try {
    const { message, messages, endSession } = req.body;

    // Handle graceful session ending
    if (endSession) {
      return res.json({
        text: "That was wonderful, dost 🌟\n\nTumne jungle ko bahut dhyaan se dekha.\nYou explored it like a true forest friend.\n\nOur magical adventure ends for now…\nBut don't worry — a new adventure is waiting for you.",
        tool: null,
        end: true
      });
    }

    // Fixed premium welcome message
    if (!messages || messages.length === 0) {
      return res.json({
        text: "Namaste dost 🌙✨\nWelcome to our magical forest adventure.\n\nYeh jungle raat mein chamak raha hai…\nLook carefully — which animals can you spot first?",
        tool: null
      });
    }

    const history = messages.map(m => ({
      role: m.sender === "ai" ? "assistant" : "user",
      content: m.text
    }));

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history,
        { role: "user", content: message }
      ]
    });

    const raw = completion.choices[0].message.content;

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.log("Invalid JSON:", raw);
      return res.json({
        text: "Chalo dhyaan se dobara dekhein 😊 Kaunse jaanwar dikh rahe hain?",
        tool: null
      });
    }

    let tool = null;

    if (parsed.classification === "correct" && parsed.highlight) {
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
    console.error("Groq Error:", err);
    res.status(500).json({
      text: "Zubi ko thoda sa magic break chahiye ✨ Try again!",
      tool: null
    });
  }
});

app.listen(3001, () => {
  console.log("🌲 Zubi Groq Server Running on 3001");
});
