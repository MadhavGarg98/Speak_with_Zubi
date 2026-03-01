import React, { useState, useEffect, useRef } from "react";
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

  useEffect(() => {
    if (conversationActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && conversationActive) {
      endConversation();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, conversationActive]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-IN";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        sendMessage(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
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
    
    utterance.onend = () => {
      setAiSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (userText) => {
    const userMessage = { sender: "user", text: userText };
    setMessages(prev => [...prev, userMessage]);
    setProcessing(true);

    try {
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userText, 
          history: messages.map(msg => ({
            role: msg.sender === "ai" ? "assistant" : "user",
            content: msg.text
          }))
        })
      });

      const data = await response.json();
      
      const aiMessage = { sender: "ai", text: data.text };
      setMessages(prev => [...prev, aiMessage]);
      
      if (data.tool) {
        setHighlighted(data.tool.target);
        setTimeout(() => setHighlighted(null), 1500);
      }
      
      speak(data.text);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = { 
        sender: "ai", 
        text: "Oops! Something went wrong. Can you try again?" 
      };
      setMessages(prev => [...prev, errorMessage]);
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
      text: "Namaste dost! Hello friend! What can you see in our magical forest? 🌲"
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
      text: "Thank you for exploring with me! Bye bye for now! 🌟"
    };
    setMessages(prev => [...prev, goodbyeMessage]);
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

  const createFireflies = () => {
    return Array.from({ length: 8 }, (_, i) => (
      <div
        key={i}
        className="firefly"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 15}s`,
          animationDuration: `${15 + Math.random() * 10}s`
        }}
      />
    ));
  };

  const createGoldenDust = () => {
    return Array.from({ length: 12 }, (_, i) => (
      <div
        key={`dust-${i}`}
        className="golden-dust"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 20}s`,
          animationDuration: `${20 + Math.random() * 10}s`
        }}
      />
    ));
  };

  const createTwinklingStars = () => {
    return Array.from({ length: 20 }, (_, i) => (
      <div
        key={`star-${i}`}
        className="twinkling-star"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 40}%`, // Stars in upper portion
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }}
      />
    ));
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Cinematic Background Layers */}
      <div className="cinematic-bg">
        <div className={`bg-layer-1 ${aiSpeaking ? 'spatial-enhanced' : ''}`}></div>
        <div className="night-sky-layer"></div>
        <div className={`bg-layer-2 ${aiSpeaking ? 'spatial-enhanced' : ''}`}></div>
        <div className="bg-layer-3"></div>
        <div className={`bg-layer-4 ${aiSpeaking ? 'spatial-enhanced' : ''}`}></div>
        <div className="bg-layer-5"></div>
      </div>
      
      {/* Spatial Lighting Overlay */}
      <div className={`spatial-lighting ${aiSpeaking ? 'ai-speaking' : ''}`}></div>
      
      {/* Time-Based Theme Elements */}
      {createTwinklingStars()}
      {createFireflies()}
      {createGoldenDust()}
      
      <Navbar 
        aiSpeaking={aiSpeaking}
        conversationActive={conversationActive}
        timeLeft={timeLeft}
        onEnd={endConversation}
        onClear={clearConversation}
      />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="main-layout">
          {/* Left Column - Forest Image */}
          <div className="left-column">
            <ForestImage highlighted={highlighted} />
          </div>
          
          {/* Right Column - Conversation Panel and Mic Orb */}
          <div className="right-column">
            <ConversationPanel 
              messages={messages}
              isAiSpeaking={aiSpeaking}
              timeRemaining={timeLeft}
              highlighted={highlighted}
            />
            
            {/* Mic Orb at the bottom of the right column */}
            <div className="flex justify-center mt-4">
              <MicOrb
                listening={listening}
                onClick={toggleListening}
                duration={TOTAL_TIME}
                timeLeft={timeLeft}
                isActive={conversationActive}
                aiSpeaking={aiSpeaking}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
