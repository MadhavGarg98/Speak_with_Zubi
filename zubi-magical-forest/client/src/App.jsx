import React, { useState, useEffect, useRef, useMemo } from "react";
import ForestImage from "./components/ForestImage";
import ConversationPanel from "./components/ConversationPanel";
import MicOrb from "./components/MicOrb";
import Navbar from "./components/Navbar";

const TOTAL_TIME = 60;

function App() {
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [highlighted, setHighlighted] = useState(null);
  const [conversationActive, setConversationActive] = useState(false);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (conversationActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && conversationActive) {
      endConversation();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, conversationActive]);

  // Speech recognition setup
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-IN";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        sendMessage(transcript);
      };

      recognitionRef.current.onerror = () => {
        setListening(false);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }
  }, []);

  const speak = (text) => {
    setAiSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    utterance.onend = () => setAiSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (userText) => {
    const userMessage = { sender: "user", text: userText };
    setMessages((prev) => [...prev, userMessage]);
    setProcessing(true);

    try {
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: messages.map((msg) => ({
            role: msg.sender === "ai" ? "assistant" : "user",
            content: msg.text,
          })),
        }),
      });

      const data = await response.json();
      const aiMessage = { sender: "ai", text: data.text };
      setMessages((prev) => [...prev, aiMessage]);

      if (data.tool) {
        setHighlighted(data.tool.target);
        setTimeout(() => setHighlighted(null), 1500);
      }

      speak(data.text);
    } catch (error) {
      const errorMessage = {
        sender: "ai",
        text: "Oops! Something went wrong. Can you try again?",
      };
      setMessages((prev) => [...prev, errorMessage]);
      speak(errorMessage.text);
    } finally {
      setProcessing(false);
    }
  };

  const startConversation = () => {
    setConversationActive(true);
    setTimeLeft(TOTAL_TIME);
    setMessages([]);

    const welcomeMessage = {
      sender: "ai",
      text: "Namaste dost! Hello friend! What can you see in our magical forest?",
    };
    setMessages([welcomeMessage]);
    speak(welcomeMessage.text);
  };

  const endConversation = () => {
    setConversationActive(false);
    setListening(false);
    setAiSpeaking(false);
    setHighlighted(null);

    const goodbyeMessage = {
      sender: "ai",
      text: "Thank you for exploring with me! Bye bye for now!",
    };
    setMessages((prev) => [...prev, goodbyeMessage]);
    speak(goodbyeMessage.text);
  };

  const clearConversation = () => {
    setMessages([]);
    setHighlighted(null);
    if (conversationActive) {
      endConversation();
    }
  };

  const toggleListening = () => {
    if (!conversationActive) {
      startConversation();
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setListening(true);
    }
  };

  // Generate floating particles with stable positions
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: `${5 + Math.random() * 90}%`,
        duration: `${18 + Math.random() * 14}s`,
        delay: `${Math.random() * 20}s`,
        size: Math.random() > 0.6 ? 3 : 2,
      })),
    []
  );

  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Cinematic background */}
      <div className="bg-cinematic" />
      <div className="bg-image-glow" />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            '--duration': p.duration,
            '--delay': p.delay,
          }}
        />
      ))}

      {/* Navbar */}
      <Navbar
        aiSpeaking={aiSpeaking}
        conversationActive={conversationActive}
        timeLeft={timeLeft}
        onEnd={endConversation}
        onClear={clearConversation}
      />

      {/* Main two-column grid */}
      <main className="main-grid">
        {/* Left Column: Forest Image */}
        <ForestImage highlighted={highlighted} />

        {/* Right Column: Conversation Panel */}
        <ConversationPanel
          messages={messages}
          isAiSpeaking={aiSpeaking}
          timeRemaining={timeLeft}
          conversationActive={conversationActive}
          onStart={startConversation}
        />
      </main>

      {/* Floating Mic Orb - visible after conversation starts */}
      {conversationActive && (
        <MicOrb
          listening={listening}
          onClick={toggleListening}
          duration={TOTAL_TIME}
          timeLeft={timeLeft}
          isActive={conversationActive}
          aiSpeaking={aiSpeaking}
        />
      )}
    </div>
  );
}

export default App;
