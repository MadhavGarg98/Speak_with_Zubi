import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const ConversationPanel = ({
  messages,
  isAiSpeaking,
  timeRemaining,
  conversationActive,
  onStart,
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="conversation-panel">
      {/* Header */}
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className={`panel-avatar ${isAiSpeaking ? 'breathing' : ''}`}>
            <Sparkles style={{ width: 20, height: 20, color: '#081410' }} />
          </div>
          <div className="panel-info">
            <div className="panel-name">Zubi Buddy</div>
            <div className="panel-subtitle">Magical Guide</div>
          </div>
        </div>
        <div className="panel-session-time">
          <div className={`session-dot ${conversationActive ? 'active' : ''}`} />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Conversation content */}
      {!conversationActive && messages.length === 0 ? (
        /* Empty / initial state */
        <div className="panel-empty-state">
          <div style={{ opacity: 0.15 }}>
            <Sparkles style={{ width: 48, height: 48, color: '#F4C95D' }} />
          </div>
          <p className="empty-state-text">
            Press Start to begin your magical forest adventure.
          </p>
          <button className="btn-start-adventure" onClick={onStart}>
            Start Adventure
          </button>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="messages-area">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className={`message-row ${message.sender}`}
                >
                  <div className={`message-bubble ${message.sender}`}>
                    <p style={{ margin: 0 }}>{message.text}</p>
                    {message.sender === 'ai' && (
                      <div className="message-sender">
                        <Sparkles style={{ width: 10, height: 10 }} />
                        <span>Zubi</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isAiSpeaking && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="message-row ai"
              >
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer hint */}
          <div style={{
            textAlign: 'center',
            color: 'rgba(244, 201, 93, 0.3)',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.3px',
            flexShrink: 0,
            paddingTop: 8,
          }}>
            Press the orb to talk with Zubi
          </div>
        </>
      )}
    </div>
  );
};

export default ConversationPanel;
