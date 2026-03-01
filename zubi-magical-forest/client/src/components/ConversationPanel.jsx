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
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 26, 22, 0.75), rgba(26, 71, 42, 0.35))',
      backdropFilter: 'blur(25px)',
      border: '1px solid rgba(232, 197, 71, 0.12)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(232, 197, 71, 0.08)',
      borderRadius: '24px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative'
    }} className={shouldPulse ? 'message-bubble-pulse' : ''}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(232, 197, 71, 0.08)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #f5d96b, #e8c547, #d4b23a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(232, 197, 71, 0.4)',
            animation: isAiSpeaking ? 'avatarBreathe 3s ease-in-out infinite' : 'none'
          }}>
            <Sparkles style={{width: '24px', height: '24px', color: '#0f1a16'}} />
          </div>
          <div>
            <h2 style={{
              color: '#f8f9fa',
              fontWeight: 600,
              fontSize: '16px',
              margin: 0,
              letterSpacing: '-0.3px'
            }}>Zubi Buddy</h2>
            <p style={{
              color: '#e8c547',
              fontSize: '12px',
              opacity: 0.7,
              margin: '4px 0 0 0',
              letterSpacing: '0.3px'
            }}>Magical Guide ✨</p>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#b8c1ba',
          fontSize: '12px'
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: isAiSpeaking ? '#ef5350' : 'rgba(232, 197, 71, 0.3)',
            animation: isAiSpeaking ? 'pulse 2s ease-in-out infinite' : 'none',
            boxShadow: isAiSpeaking ? '0 0 8px rgba(239, 83, 80, 0.4)' : 'none'
          }} />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '12px',
        paddingRight: '8px'
      }} className="custom-scrollbar-enhanced">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              style={{
                display: 'flex',
                justifyContent: message.sender === 'ai' ? 'flex-start' : 'flex-end'
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  background: message.sender === 'ai' 
                    ? 'rgba(45, 95, 63, 0.4)' 
                    : 'linear-gradient(135deg, #e8c547, #f5d96b)',
                  color: message.sender === 'ai' ? '#f8f9fa' : '#0f1a16',
                  borderBottomLeftRadius: message.sender === 'ai' ? '4px' : '16px',
                  borderBottomRightRadius: message.sender === 'ai' ? '16px' : '4px',
                  boxShadow: message.sender === 'ai'
                    ? '0 4px 16px rgba(0, 0, 0, 0.2)'
                    : '0 4px 16px rgba(232, 197, 71, 0.2)',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  wordWrap: 'break-word'
                }}
              >
                <p style={{margin: 0}}>{message.text}</p>
                {message.sender === 'ai' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '8px',
                    fontSize: '10px',
                    color: '#e8c547'
                  }}>
                    <Heart style={{width: '12px', height: '12px', animation: 'pulse 2s ease-in-out infinite'}} />
                    <span style={{fontWeight: 500}}>Zubi</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{display: 'flex', justifyContent: 'flex-start'}}
          >
            <div style={{
              background: 'rgba(45, 95, 63, 0.4)',
              color: '#f8f9fa',
              padding: '12px 16px',
              borderRadius: '16px',
              borderBottomLeftRadius: '4px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{display: 'flex', gap: '4px', alignItems: 'center'}}>
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    style={{
                      width: '6px',
                      height: '6px',
                      background: '#e8c547',
                      borderRadius: '50%',
                      animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Footer hint */}
      <div style={{
        textAlign: 'center',
        color: 'rgba(232, 197, 71, 0.4)',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.3px'
      }}>
        Press the orb to talk with Zubi ✨
      </div>
    </div>
  );
};

export default ConversationPanel;
