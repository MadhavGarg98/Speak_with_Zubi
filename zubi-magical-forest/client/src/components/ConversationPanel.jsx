import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw } from 'lucide-react';

const ConversationPanel = ({
  messages,
  isAiSpeaking,
  isProcessing,
  timeRemaining,
  conversationActive,
  sessionEnded,
  onStart,
  onRestart,
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

  const showStartScreen = !conversationActive && !sessionEnded && messages.length === 0;
  const showEndScreen = sessionEnded && !conversationActive;

  return (
    <motion.div
      className="conversation-panel"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className={`panel-avatar ${isAiSpeaking ? 'ai-speaking' : ''}`}>
            <img 
              src="/blue-elephant-avatar.svg" 
              alt="Zubi Buddy" 
              style={{ width: 36, height: 36, borderRadius: '50%' }}
            />
          </div>
          <div className="panel-info">
            <div className="panel-name">Zubi Buddy</div>
            <div className="panel-subtitle">Magical Forest Guide</div>
          </div>
        </div>
        <div className="panel-session-time">
          <div className={`session-dot ${conversationActive ? 'active' : ''}`} />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {showStartScreen ? (
        /* Empty / initial state */
        <div className="panel-empty-state">
          <motion.div
            className="empty-state-icon"
            animate={{
              scale: [1, 1.08, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles style={{ width: 56, height: 56, color: '#F4C95D' }} />
          </motion.div>
          <div className="empty-state-heading">Ready for an Adventure?</div>
          <p className="empty-state-text">
            Explore the magical forest with Zubi, your friendly AI companion. Speak and discover wonders together.
          </p>
          <motion.button
            className="btn-start-adventure"
            onClick={onStart}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="btn-start-sparkle" />
            Start Adventure
          </motion.button>
        </div>
      ) : showEndScreen ? (
        /* Session ended state */
        <div className="panel-empty-state">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="empty-state-icon"
          >
            <Sparkles style={{ width: 56, height: 56, color: '#F4C95D' }} />
          </motion.div>
          <div className="empty-state-heading">Adventure Complete!</div>
          <p className="empty-state-text">
            Great job exploring the magical forest! Ready for another round?
          </p>

          {/* Show recent messages summary */}
          {messages.length > 0 && (
            <div className="session-summary">
              <span className="summary-count">{messages.filter(m => m.sender === 'user').length}</span>
              <span className="summary-label">messages exchanged</span>
            </div>
          )}

          <motion.button
            className="btn-start-adventure btn-restart"
            onClick={onRestart}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            <RotateCcw style={{ width: 16, height: 16, marginRight: 8 }} />
            New Adventure
          </motion.button>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="messages-area">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className={`message-row ${message.sender}`}
                >
                  {message.sender === 'ai' && (
                    <div className="message-avatar-mini">
                      <img 
                        src="/blue-elephant-avatar.svg" 
                        alt="Zubi" 
                        style={{ width: 32, height: 32, borderRadius: '50%' }}
                      />
                    </div>
                  )}
                  {message.sender === 'user' && (
                    <div className="message-avatar-mini">
                      <img 
                        src="/person-avatar.svg" 
                        alt="You" 
                        style={{ width: 32, height: 32, borderRadius: '50%' }}
                      />
                    </div>
                  )}
                  <div className={`message-bubble ${message.sender}`}>
                    <p style={{ margin: 0 }}>{message.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing / processing indicator */}
            {(isAiSpeaking || isProcessing) && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="message-row ai"
              >
                <div className="message-avatar-mini">
                  <img 
                    src="/blue-elephant-avatar.svg" 
                    alt="Zubi" 
                    style={{ width: 32, height: 32, borderRadius: '50%' }}
                  />
                </div>
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
          <div className="panel-footer-hint">
            {conversationActive ? 'Press the orb to talk with Zubi' : 'Session ended'}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ConversationPanel;
