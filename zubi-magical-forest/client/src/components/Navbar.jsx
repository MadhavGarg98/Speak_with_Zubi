import React from "react";
import { motion } from "framer-motion";
import { Trees } from "lucide-react";

export default function Navbar({ aiSpeaking, conversationActive, timeLeft, onEnd, onClear }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="navbar-brand">
        <div className="navbar-icon">
          <img 
            src="/zubi-logo-new.svg" 
            alt="Zubi Magical Forest" 
            style={{ width: 36, height: 36, borderRadius: '8px' }}
          />
        </div>
        <div className="navbar-brand-text">
          <span className="navbar-title">Zubi Magical Forest</span>
          <span className="navbar-tagline">AI Adventure</span>
        </div>
      </div>

      <div className="navbar-controls">
        <div className="live-badge">
          <div className={`live-dot ${aiSpeaking ? 'speaking' : conversationActive ? '' : 'offline'}`} />
          <span>{aiSpeaking ? 'SPEAKING' : conversationActive ? 'LIVE' : 'READY'}</span>
        </div>

        {conversationActive && (
          <motion.span
            className={`navbar-timer ${timeLeft <= 3 ? 'urgent' : timeLeft <= 10 ? 'warning' : ''}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            key="timer"
          >
            {formatTime(timeLeft)}
          </motion.span>
        )}

        <div className="navbar-btn-group">
          {conversationActive && (
            <motion.button
              className="btn-end"
              onClick={onEnd}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              End
            </motion.button>
          )}
          <motion.button
            className="btn-clear"
            onClick={onClear}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
