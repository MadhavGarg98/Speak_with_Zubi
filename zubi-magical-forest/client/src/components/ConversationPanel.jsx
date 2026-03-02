import React, { useRef, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw } from "lucide-react";

const GOODBYE_MESSAGE =
  "That was wonderful, dost.\n\nTumne jungle ko bahut dhyaan se dekha.\nOur magical adventure ends for now...\nBut a new adventure is waiting for you.";

const ConversationPanel = memo(function ConversationPanel({
  messages,
  isAiSpeaking,
  isProcessing,
  timeRemaining,
  conversationActive,
  sessionEnded,
  onStart,
  onRestart,
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const showStartScreen =
    !conversationActive && !sessionEnded && messages.length === 0;
  const showEndScreen = sessionEnded;

  return (
    <motion.div
      className="conversation-panel"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div className="panel-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <motion.div
            className={`panel-avatar ${isAiSpeaking ? "ai-speaking" : ""}`}
            animate={
              isAiSpeaking
                ? {
                    scale: [1, 1.08, 1],
                    boxShadow: [
                      "0 0 20px rgba(244,201,93,0.3)",
                      "0 0 32px rgba(244,201,93,0.5)",
                      "0 0 20px rgba(244,201,93,0.3)",
                    ],
                  }
                : { scale: 1 }
            }
            transition={{
              duration: 2,
              repeat: isAiSpeaking ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            <img
              src="/zubi-avatar-dark.svg"
              alt="Zubi"
              style={{ width: 50, height: 50, borderRadius: "50%" }}
            />
          </motion.div>
          <div className="panel-info">
            <div className="panel-name">Zubi Buddy</div>
            <div className="panel-subtitle">Magical Forest Guide</div>
          </div>
        </div>
        <div className="panel-session-time">
          <div
            className={`session-dot ${conversationActive ? "active" : ""}`}
          />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showStartScreen ? (
          /* Empty / initial state */
          <motion.div
            key="start"
            className="panel-empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="empty-state-icon"
              animate={{
                scale: [1, 1.08, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles
                style={{ width: 56, height: 56, color: "#F4C95D" }}
              />
            </motion.div>
            <div className="empty-state-heading">Ready for an Adventure?</div>
            <p className="empty-state-text">
              Explore the magical forest with Zubi, your friendly AI companion.
              Speak and discover wonders together.
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
          </motion.div>
        ) : showEndScreen ? (
          /* Session ended state with graceful design */
          <motion.div
            key="end"
            className="panel-empty-state session-end-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="empty-state-icon end-icon"
            >
              <Sparkles
                style={{ width: 56, height: 56, color: "#F4C95D" }}
              />
            </motion.div>

            <motion.div
              className="empty-state-heading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Adventure Complete!
            </motion.div>

            <motion.p
              className="goodbye-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {GOODBYE_MESSAGE}
            </motion.p>

            {/* Show messages summary */}
            {messages.length > 0 && (
              <motion.div
                className="session-summary"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <span className="summary-count">
                  {messages.filter((m) => m.sender === "user").length}
                </span>
                <span className="summary-label">messages exchanged</span>
              </motion.div>
            )}

            <motion.button
              className="btn-start-adventure btn-restart"
              onClick={onRestart}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              <RotateCcw
                style={{ width: 16, height: 16, marginRight: 8 }}
              />
              Start New Adventure
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            className="panel-chat-area"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Messages */}
            <div className="messages-area">
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 16, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{
                      duration: 0.35,
                      delay: 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`message-row ${message.sender}`}
                  >
                    {message.sender === "ai" && (
                      <div className="message-avatar-mini">
                        <img
                          src="/zubi-avatar-dark.svg"
                          alt="Zubi"
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                          }}
                        />
                      </div>
                    )}
                    {message.sender === "user" && (
                      <div className="message-avatar-mini user-avatar">
                        <img
                          src="/person-avatar.svg"
                          alt="You"
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                          }}
                        />
                      </div>
                    )}
                    <div className={`message-bubble ${message.sender}`}>
                      <p style={{ margin: 0, whiteSpace: "pre-line" }}>
                        {message.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing / processing indicator */}
              <AnimatePresence>
                {(isAiSpeaking || isProcessing) && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="message-row ai"
                  >
                    <div className="message-avatar-mini">
                      <img
                        src="/zubi-avatar-dark.svg"
                        alt="Zubi"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                    <div className="typing-indicator">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Footer hint */}
            <div className="panel-footer-hint">
              {conversationActive
                ? "Press the orb to talk with Zubi"
                : "Session ended"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default ConversationPanel;
