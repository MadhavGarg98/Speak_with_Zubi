import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [showCorrectSweep, setShowCorrectSweep] = useState(false);
  const [showSessionEndOverlay, setShowSessionEndOverlay] = useState(false);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const sessionStartRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const streamRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (conversationActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && conversationActive) {
      handleEndConversation();
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
        stopAudioAnalyser();
      };

      recognitionRef.current.onend = () => {
        setListening(false);
        stopAudioAnalyser();
      };
    }

    return () => {
      stopAudioAnalyser();
    };
  }, []);

  // Audio analyser for voice level
  const startAudioAnalyser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        // Compute average volume from frequency data
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        // Normalize to 0-1
        setVoiceLevel(Math.min(avg / 128, 1));
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // Mic access denied
      setVoiceLevel(0);
    }
  }, []);

  const stopAudioAnalyser = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setVoiceLevel(0);
  }, []);

  const cleanTextForSpeech = (text) => {
    return text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
  };

  const speak = (text) => {
    setAiSpeaking(true);
    const cleanedText = cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    utterance.onend = () => setAiSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (userText) => {
    const userMessage = { sender: "user", text: userText };
    
    // Get current messages before updating state
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setProcessing(true);

    // Calculate session duration
    const sessionDuration = sessionStartRef.current ? Date.now() - sessionStartRef.current : 0;
    const shouldEndSession = sessionDuration > 60000; // 60 seconds

    try {
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          messages: currentMessages.map((msg) => ({
            sender: msg.sender,
            text: msg.text,
          })),
          endSession: shouldEndSession
        }),
      });

      const data = await response.json();
      const aiMessage = { sender: "ai", text: data.text };
      setMessages((prev) => [...prev, aiMessage]);

      if (data.tool) {
        setHighlighted(data.tool.target);
        setTimeout(() => setHighlighted(null), 1500);
      }

      // Handle graceful session ending
      if (data.end) {
        setSessionEnded(true);
        setShowSessionEndOverlay(true);
        setTimeout(() => setShowSessionEndOverlay(false), 800);
        return; // Don't speak goodbye message, let frontend handle it
      }

      speak(data.text);
    } catch {
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
    setSessionEnded(false);
    setTimeLeft(TOTAL_TIME);
    setMessages([]);
    sessionStartRef.current = Date.now(); // Track session start time

    // Send welcome message request without adding user message
    fetchWelcomeMessage();
  };

  const fetchWelcomeMessage = async () => {
    setProcessing(true);
    try {
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "",
          messages: [] // Send empty array to trigger welcome
        }),
      });

      const data = await response.json();
      const welcomeMessage = { sender: "ai", text: data.text };
      setMessages([welcomeMessage]);
      speak(data.text);
    } catch {
      const errorMessage = {
        sender: "ai",
        text: "Oops! Something went wrong. Can you try again?",
      };
      setMessages([errorMessage]);
      speak(errorMessage.text);
    } finally {
      setProcessing(false);
    }
  };

  const handleEndConversation = useCallback(() => {
    setConversationActive(false);
    setListening(false);
    setAiSpeaking(false);
    setHighlighted(null);
    setSessionEnded(true);
    setShowSessionEndOverlay(true);
    stopAudioAnalyser();
    window.speechSynthesis.cancel();

    // Use the same graceful goodbye as backend
    const goodbyeMessage = {
      sender: "ai",
      text: "That was wonderful, dost 🌟\n\nTumne jungle ko bahut dhyaan se dekha.\nYou explored it like a true forest friend.\n\nOur magical adventure ends for now…\nBut don't worry — a new adventure is waiting for you.",
    };
    setMessages((prev) => [...prev, goodbyeMessage]);
    
    // Speak the cleaned goodbye message
    speak(goodbyeMessage.text);
    
    // Hide overlay after animation
    setTimeout(() => setShowSessionEndOverlay(false), 800);
  }, [stopAudioAnalyser, speak]);

  const clearConversation = () => {
    window.speechSynthesis.cancel();
    setConversationActive(false);
    setListening(false);
    setAiSpeaking(false);
    setHighlighted(null);
    setMessages([]);
    setTimeLeft(TOTAL_TIME);
    setSessionEnded(false);
    stopAudioAnalyser();
  };

  const restartConversation = () => {
    setSessionEnded(false);
    setMessages([]);
    startConversation();
  };

  const toggleListening = () => {
    if (!conversationActive) {
      startConversation();
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      stopAudioAnalyser();
    } else {
      recognitionRef.current?.start();
      setListening(true);
      startAudioAnalyser();
    }
  };

  // Generate floating particles with stable positions
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${5 + Math.random() * 90}%`,
        duration: `${18 + Math.random() * 14}s`,
        delay: `${Math.random() * 20}s`,
        size: Math.random() > 0.5 ? 3 : 2,
        glow: Math.random() > 0.7,
      })),
    []
  );

  // Generate floating golden dots
  const floatingDots = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        id: i,
        left: `${15 + Math.random() * 70}%`,
        duration: `${12 + Math.random() * 8}s`,
        delay: `${Math.random() * 15}s`,
      })),
    []
  );

  // Fireflies
  const fireflies = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: `${10 + Math.random() * 80}%`,
        top: `${20 + Math.random() * 60}%`,
        duration: `${4 + Math.random() * 6}s`,
        delay: `${Math.random() * 5}s`,
      })),
    []
  );

  return (
    <div className="app-root">
      {/* Cinematic background */}
      <div className="bg-cinematic" />
      <div className="bg-image-glow" />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`particle ${p.glow ? 'particle-glow' : ''}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            '--duration': p.duration,
            '--delay': p.delay,
          }}
        />
      ))}

      {/* Floating golden dots */}
      {floatingDots.map((d) => (
        <div
          key={`dot-${d.id}`}
          className="floating-dot"
          style={{
            left: d.left,
            '--dot-duration': d.duration,
            '--dot-delay': d.delay,
          }}
        />
      ))}

      {/* Fireflies */}
      {fireflies.map((f) => (
        <div
          key={`ff-${f.id}`}
          className="firefly"
          style={{
            left: f.left,
            top: f.top,
            '--ff-duration': f.duration,
            '--ff-delay': f.delay,
          }}
        />
      ))}

      {/* Navbar */}
      <Navbar
        aiSpeaking={aiSpeaking}
        conversationActive={conversationActive}
        timeLeft={timeLeft}
        onEnd={handleEndConversation}
        onClear={clearConversation}
      />

      {/* Main two-column grid */}
      <main className="main-grid">
        {/* Left Column: Forest Image */}
        <ForestImage highlighted={highlighted} conversationActive={conversationActive} />

        {/* Right Column: Conversation Panel */}
        <ConversationPanel
          messages={messages}
          isAiSpeaking={aiSpeaking}
          isProcessing={processing}
          timeRemaining={timeLeft}
          conversationActive={conversationActive}
          sessionEnded={sessionEnded}
          onStart={startConversation}
          onRestart={restartConversation}
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
          voiceLevel={voiceLevel}
        />
      )}

      {/* UX Micro-interactions */}
      {showCorrectSweep && (
        <div className="correct-answer-sweep" />
      )}
      
      {showSessionEndOverlay && (
        <div className="session-end-overlay" />
      )}
    </div>
  );
}

export default App;
