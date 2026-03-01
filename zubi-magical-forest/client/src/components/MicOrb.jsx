import React from "react";
import { Mic } from "lucide-react";
import CountdownRing from "./CountdownRing";

export default function MicOrb({ listening, onClick, duration, timeLeft, isActive, aiSpeaking }) {
  const getStateClass = () => {
    if (listening) return "listening";
    if (aiSpeaking) return "speaking";
    return "idle";
  };

  return (
    <div className="mic-orb-wrapper">
      <button
        className={`mic-orb-btn ${getStateClass()}`}
        onClick={onClick}
        aria-label={listening ? "Stop listening" : "Start speaking"}
      >
        {/* Outer halo glow */}
        <div className="orb-halo" />

        {/* Shimmer ring */}
        <div className="orb-shimmer" />

        {/* Ripple rings when listening */}
        {listening && (
          <>
            <div className="orb-ripple" />
            <div className="orb-ripple" />
          </>
        )}

        {/* Countdown ring */}
        <CountdownRing duration={duration} isActive={isActive} />

        {/* Center content */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {aiSpeaking ? (
            <div className="orb-waveform">
              <div className="orb-wave-bar" />
              <div className="orb-wave-bar" />
              <div className="orb-wave-bar" />
              <div className="orb-wave-bar" />
              <div className="orb-wave-bar" />
            </div>
          ) : (
            <Mic className="orb-mic-icon" />
          )}
        </div>
      </button>
    </div>
  );
}
