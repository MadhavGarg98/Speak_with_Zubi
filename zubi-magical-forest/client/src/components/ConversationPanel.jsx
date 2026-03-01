import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

const ConversationPanel = ({ messages, isAiSpeaking, timeRemaining, highlighted }) => {
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isAiSpeaking) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAiSpeaking]);

  useEffect(() => {
    if (highlighted) {
      setShouldPulse(true);
      const timer = setTimeout(() => setShouldPulse(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [highlighted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`conversation-panel chat-panel-enhanced rounded-[28px] p-7 flex flex-col h-full relative scroll-fade-top scroll-fade-bottom ${shouldPulse ? 'message-bubble-pulse' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-goldAccent to-yellow-400 flex items-center justify-center ${isAiSpeaking ? 'ai-avatar-breathing' : ''}`}>
            <Sparkles className="w-7 h-7 text-forestDark" />
          </div>
          <div>
            <h2 className="text-creamText font-semibold text-xl">Zubi Forest Buddy</h2>
            <p className="text-goldAccent text-sm opacity-80">Your magical guide 🌲</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isAiSpeaking ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/50' : 'bg-gray-400'} `} />
          <span className="text-creamText text-sm font-medium">
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar-enhanced">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                  message.sender === 'ai'
                    ? 'bg-gradient-to-br from-forestMid to-forestDark text-creamText rounded-tl-none shadow-lg'
                    : 'bg-gradient-to-br from-goldAccent to-yellow-400 text-forestDark rounded-tr-none shadow-lg'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                {message.sender === 'ai' && (
                  <div className="flex items-center gap-2 mt-3">
                    <Heart className="w-3 h-3 text-goldAccent animate-pulse" />
                    <span className="text-xs text-goldAccent/80 font-medium">Zubi</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gradient-to-br from-forestMid to-forestDark text-creamText p-4 rounded-2xl rounded-tl-none shadow-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-goldAccent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-goldAccent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-goldAccent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Footer hint */}
      <div className="text-center text-goldAccent/60 text-xs font-medium">
        Press the magic orb to talk with Zubi ✨
      </div>
    </div>
  );
};

export default ConversationPanel;
