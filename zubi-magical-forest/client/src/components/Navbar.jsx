import React from "react";
import { Trees } from "lucide-react";

export default function Navbar({ aiSpeaking, conversationActive, timeLeft, onEnd, onClear }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="navbar-icon">
          <Trees style={{ width: 20, height: 20, color: '#FDF6E3' }} />
        </div>
        <span className="navbar-title">Zubi Magical Forest</span>
      </div>

      <div className="navbar-controls">
        <div className="live-badge">
          <div className={`live-dot ${aiSpeaking ? 'speaking' : ''}`} />
          <span>{aiSpeaking ? 'SPEAKING' : conversationActive ? 'LIVE' : 'READY'}</span>
        </div>

        {conversationActive && (
          <span className="navbar-timer">{formatTime(timeLeft)}</span>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-end" onClick={onEnd}>End</button>
          <button className="btn-clear" onClick={onClear}>Clear</button>
        </div>
      </div>
    </nav>
  );
}
