import React from "react";
import CountdownRing from "./CountdownRing";

export default function MicOrb({ listening, onClick, duration, timeLeft, isActive, aiSpeaking }) {
  const getCoreState = () => {
    if (listening) return "listening";
    if (aiSpeaking) return "speaking";
    return "idle";
  };

  const coreState = getCoreState();

  return (
    <button
      onClick={onClick}
      className="relative focus:outline-none sound-indicator premium-hover"
    >
      {/* Outer Shimmer Ring */}
      <div className="shimmer-ring"></div>
      
      {/* Ripple Effect (only when listening) */}
      {listening && <div className="ripple-ring"></div>}
      
      {/* Main Forest Core */}
      <div className={`forest-core ${coreState}`}>
        {/* Countdown Ring */}
        <CountdownRing 
          duration={duration} 
          isActive={isActive}
          onComplete={() => console.log("Timer completed")}
        />
        
        {/* Core Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {aiSpeaking ? (
            // Animated waveform when AI is speaking
            <div className="waveform-container">
              <div className="waveform-bar"></div>
              <div className="waveform-bar"></div>
              <div className="waveform-bar"></div>
              <div className="waveform-bar"></div>
              <div className="waveform-bar"></div>
            </div>
          ) : (
            // Forest icon when idle or listening
            <span className="text-2xl filter drop-shadow-sm">
              🌲
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
