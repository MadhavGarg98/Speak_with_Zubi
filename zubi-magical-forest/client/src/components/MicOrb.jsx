import React, { useMemo } from "react";
import { Mic } from "lucide-react";
import CountdownRing from "./CountdownRing";

export default function MicOrb({ listening, onClick, duration, timeLeft, isActive, aiSpeaking, voiceLevel = 0 }) {
  const getStateClass = () => {
    if (listening) return "listening";
    if (aiSpeaking) return "speaking";
    return "idle";
  };

  // Generate voice-reactive bar heights
  const bars = useMemo(() => [0.6, 0.85, 0.7, 1, 0.75, 0.9, 0.65], []);

  const stateClass = getStateClass();

  // Voice level drives the glow intensity
  const glowIntensity = listening ? 0.3 + voiceLevel * 0.7 : aiSpeaking ? 0.5 : 0.2;

  return (
    <div className="mic-orb-wrapper">
      {/* Voice level outer rings - reactive to voice */}
      {listening && (
        <>
          <div
            className="orb-voice-ring orb-voice-ring-1"
            style={{
              transform: `scale(${1 + voiceLevel * 0.6})`,
              opacity: 0.15 + voiceLevel * 0.35,
            }}
          />
          <div
            className="orb-voice-ring orb-voice-ring-2"
            style={{
              transform: `scale(${1 + voiceLevel * 0.4})`,
              opacity: 0.1 + voiceLevel * 0.25,
            }}
          />
          <div
            className="orb-voice-ring orb-voice-ring-3"
            style={{
              transform: `scale(${1 + voiceLevel * 0.8})`,
              opacity: 0.05 + voiceLevel * 0.15,
            }}
          />
        </>
      )}

      {/* Status label */}
      <div className={`orb-status-label ${stateClass}`}>
        {listening ? "Listening..." : aiSpeaking ? "Zubi Speaking" : "Tap to Speak"}
      </div>

      <button
        className={`mic-orb-btn ${stateClass}`}
        onClick={onClick}
        aria-label={listening ? "Stop listening" : "Start speaking"}
        style={{
          '--glow-intensity': glowIntensity,
        }}
      >
        {/* Outer halo glow */}
        <div className="orb-halo" />

        {/* Shimmer ring */}
        <div className="orb-shimmer" />

        {/* Rotating border ring */}
        <div className="orb-rotating-border" />

        {/* Ripple rings when listening */}
        {listening && (
          <>
            <div className="orb-ripple" />
            <div className="orb-ripple" style={{ animationDelay: '0.5s' }} />
            <div className="orb-ripple" style={{ animationDelay: '1s' }} />
          </>
        )}

        {/* Volume ring that fills while listening */}
        {listening && (
          <svg className="orb-volume-ring" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(244, 201, 93, 0.2)"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(244, 201, 93, 0.8)"
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - voiceLevel)}`}
              transform="rotate(-90 50 50)"
              style={{
                transition: 'stroke-dashoffset 0.1s ease-out',
              }}
            />
          </svg>
        )}

        {/* Countdown ring */}
        <CountdownRing duration={duration} timeLeft={timeLeft} isActive={isActive} />

        {/* Center content */}
        <div className="orb-center-content">
          {aiSpeaking ? (
            <div className="orb-waveform">
              {bars.map((scale, i) => (
                <div
                  key={i}
                  className="orb-wave-bar"
                  style={{
                    animationDelay: `${i * 0.08}s`,
                    '--bar-scale': scale,
                  }}
                />
              ))}
            </div>
          ) : listening ? (
            <div className="orb-voice-visualizer">
              {bars.map((baseScale, i) => (
                <div
                  key={i}
                  className="orb-voice-bar"
                  style={{
                    height: `${Math.max(4, voiceLevel * 28 * baseScale)}px`,
                    transition: 'height 0.05s ease-out',
                  }}
                />
              ))}
            </div>
          ) : (
            <Mic className="orb-mic-icon" />
          )}
        </div>
      </button>

      {/* Time remaining below orb */}
      <div className="orb-time-display">
        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
      </div>
    </div>
  );
}
