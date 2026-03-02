const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

console.log('🧪 Testing Groq API directly...');

async function testAPI() {
  try {
    console.log('📡 Making test call...');
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: "test" }],
      max_tokens: 10
    });
    console.log('✅ Success:', completion.choices[0].message.content);
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('Status:', err.status);
    console.error('Code:', err.code);
  }
}

testAPI();
