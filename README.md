# 🌲 Speak with Zubi: Real-Time AI Forest Adventure

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-6366f1?style=for-the-badge&logo=vercel)](https://speak-with-zubi-ten.vercel.app/)

An immersive, voice-enabled AI experience where children explore a magical forest through natural conversation.

---

## 🌟 Overview

**Speak with Zubi** is a high-performance, real-time AI web application tailored for children aged 4–7. By bridging the gap between Conversational AI and dynamic UI feedback, it creates an educational "look-and-find" adventure that feels alive.

### 🧠 The Core Experience
The AI guides children through a magical forest, asking observation-based questions. As the AI mentions specific animals or objects, the UI **dynamically highlights** them on the screen, creating a powerful multi-sensory learning loop.

---

## 🎯 Key Features

### 🗣️ Natural Voice Interaction
* **Zero-Latency Feel:** Powered by Groq (LLaMA 3) for near-instant responses.
* **Multilingual:** Full support for **English**, **Hindi**, and **Hinglish**.
* **Smart TTS:** Custom-tuned speech synthesis (Rate: 0.9, Pitch: 1.05) designed for kid-friendly pacing.
* **Emoji-Free Speech:** Intelligent filtering ensures the AI speaks naturally without "reading" emojis aloud.

### 🪄 Intelligent Object Highlighting
When the AI mentions any of the following, they glow dynamically:
> *Deer, Fox, Owl, Red Panda, Raccoons, Hedgehog, Treehouse, Waterfall, Bridge, and more.*

### 🛡️ Controlled AI Logic
* **Anti-Hallucination:** Grounded in a strict system prompt to ensure the AI only talks about what is actually in the image.
* **Structured Intelligence:** Responses are classified into `correct`, `incorrect`, `unclear`, or `unrelated` to guide the conversation logically.
* **Zero Praise-Looping:** Avoids repetitive "Great job!" filler for a more authentic interaction.

### 🎨 Premium UI/UX
* **Cinematic Theme:** Dark forest aesthetic with Glassmorphism panels.
* **Fluid Animations:** Powered by **Framer Motion** for smooth transitions and "breathing" mic effects.
* **Responsive Math:** Highlight overlays use percentage-based positioning to remain pixel-perfect on mobile and desktop.

---

## 🏗️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), Framer Motion, Native Web Speech API |
| **Backend** | Node.js, Express |
| **AI Engine** | Groq Cloud (LLaMA 3 70B/8B) |
| **Styling** | Tailwind CSS / Responsive CSS |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 🧠 System Architecture

### AI Response Protocol
The backend enforces a strict JSON schema to ensure the frontend can react to the AI's "thoughts" in real-time.

`json
{
  "classification": "correct",
  "text": "Yes, that is a deer! Can you see where the little hedgehog is hiding?",
  "highlight": "hedgehog"
} 
`
## Adventure Flow
Discovery: Spotting the animals.

Numeracy: Counting specific groups.

Detailing: Identifying colors or positions.

Creative: An imagination-based closing question.

---

### ⚙️ Local Development

1. Clone the Repository
Bash
git clone [https://github.com/yourusername/Speak_with_Zubi.git](https://github.com/yourusername/Speak_with_Zubi.git)
cd Speak_with_Zubi
2. Backend Setup

`cd server`
`npm install`

# Create a .env file and add:
# GROQ_API_KEY=your_key_here

`node server.js`
3. Frontend Setup


`cd ../client`
`npm install`
`npm run dev`

--- 

## 🌍 Deployment Configuration
Backend (Render): Set Root Directory to server. Use npm install for the build command and node server.js for the start command.

Frontend (Vercel): Set Root Directory to client. Ensure the VITE_API_URL environment variable points to your deployed Render URL.

### 👨‍💻 Author
Developed as part of the AI Interaction Engineering Task. Focused on prompt engineering, voice UX, and responsive mathematics.

“Every adventure begins with curiosity.”
