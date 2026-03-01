import React from "react";

export default function Navbar({ aiSpeaking, conversationActive, timeLeft, onEnd, onClear }) {
  return (
    <header className="navbar-logo-shimmer" style={{
      background: 'rgba(15, 26, 22, 0.75)',
      backdropFilter: 'blur(25px)',
      borderBottom: '1px solid rgba(232, 197, 71, 0.12)',
      padding: '20px 40px',
      position: 'relative',
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#e8c547',
            margin: 0,
            textShadow: '0 0 16px rgba(232, 197, 71, 0.3)',
            letterSpacing: '-0.5px'
          }}>
            🌲 Zubi Magical Forest
          </h1>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}>
          {/* Live Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#b8c1ba',
            fontWeight: 500,
            fontSize: '13px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            <div style={{
              width: '7px',
              height: '7px',
              background: aiSpeaking ? '#ef5350' : '#b8c1ba',
              borderRadius: '50%',
              animation: aiSpeaking ? 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
              boxShadow: aiSpeaking ? '0 0 8px rgba(239, 83, 80, 0.5)' : 'none',
              transition: 'all 0.3s ease'
            }} />
            <span>READY</span>
          </div>
          
          {/* Timer */}
          <span style={{
            color: '#e8c547',
            fontWeight: 600,
            fontSize: '15px',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.3px',
            minWidth: '50px',
            textAlign: 'right'
          }}>
            {conversationActive ? String(timeLeft).padStart(2, '0') : '00'}
          </span>
          
          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '8px'
          }}>
            <button
              onClick={onEnd}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid rgba(232, 197, 71, 0.3)',
                color: '#e8c547',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'rgba(232, 197, 71, 0.6)';
                e.target.style.boxShadow = '0 0 12px rgba(232, 197, 71, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(232, 197, 71, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            >
              End
            </button>
            <button
              onClick={onClear}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid rgba(184, 193, 186, 0.2)',
                color: '#b8c1ba',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'rgba(184, 193, 186, 0.4)';
                e.target.style.color = '#e8c547';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(184, 193, 186, 0.2)';
                e.target.style.color = '#b8c1ba';
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
