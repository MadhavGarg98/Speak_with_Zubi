import React, { useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";
import CountdownRing from "./CountdownRing";

const MicOrb = memo(function MicOrb({
  listening,
  onClick,
  duration,
  timeLeft,
  isActive,
  aiSpeaking,
  voiceLevel = 0,
}) {
  const state = aiSpeaking ? "speaking" : listening ? "listening" : "idle";

  // Generate stable bar scales for waveform
  const bars = useMemo(() => [0.6, 0.85, 0.7, 1, 0.75, 0.9, 0.65], []);

  // Glow intensity driven by state and voice level
  const glowIntensity =
    state === "listening"
      ? 0.3 + voiceLevel * 0.7
      : state === "speaking"
      ? 0.5
      : 0.2;

  // Disable click while AI is speaking
  const handleClick = () => {
    if (state === "speaking") return;
    onClick?.();
  };

  // Smooth orb background variants
  const orbVariants = {
    idle: {
      scale: [1, 1.025, 1],
      transition: {
        scale: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
      },
    },
    listening: {
      scale: [1, 1.05, 1],
      transition: {
        scale: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
      },
    },
    speaking: {
      scale: [1, 1.03, 0.97, 1.04, 0.98, 1],
      transition: {
        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      },
    },
  };

  // Status label text
  const statusText =
    state === "listening"
      ? "Listening..."
      : state === "speaking"
      ? "Zubi Speaking"
      : "Tap to Speak";

  return (
    <motion.div
      className="mic-orb-wrapper"
      initial={{ opacity: 0, y: 40, scale: 0.6 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Voice-reactive outer rings (listening only) */}
      <AnimatePresence>
        {state === "listening" && (
          <>
            <motion.div
              className="orb-voice-ring orb-voice-ring-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 0.15 + voiceLevel * 0.35,
                scale: 1 + voiceLevel * 0.6,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.08, ease: "easeOut" }}
            />
            <motion.div
              className="orb-voice-ring orb-voice-ring-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 0.1 + voiceLevel * 0.25,
                scale: 1 + voiceLevel * 0.4,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
            />
            <motion.div
              className="orb-voice-ring orb-voice-ring-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 0.05 + voiceLevel * 0.15,
                scale: 1 + voiceLevel * 0.8,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Soundwave rings (speaking only) */}
      <AnimatePresence>
        {state === "speaking" && (
          <>
            {[0, 0.7, 1.4].map((delay, i) => (
              <motion.div
                key={`sw-${i}`}
                className="orb-soundwave-ring"
                initial={{ opacity: 0, scale: 1 }}
                animate={{
                  opacity: [0.4, 0.15, 0],
                  scale: [1, 1.5, 1.9],
                }}
                transition={{
                  duration: 2.1,
                  repeat: Infinity,
                  delay,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Status label */}
      <motion.div
        className={`orb-status-label ${state}`}
        animate={{
          opacity: state === "listening" ? [0.7, 1, 0.7] : state === "speaking" ? 0.8 : 0.6,
        }}
        transition={{
          duration: state === "listening" ? 1.5 : 0.3,
          repeat: state === "listening" ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {statusText}
      </motion.div>

      {/* Main orb button */}
      <motion.button
        className={`mic-orb-btn ${state}`}
        onClick={handleClick}
        aria-label={
          state === "listening"
            ? "Stop listening"
            : state === "speaking"
            ? "AI is speaking"
            : "Start speaking"
        }
        style={{
          "--glow-intensity": glowIntensity,
          cursor: state === "speaking" ? "default" : "pointer",
        }}
        variants={orbVariants}
        animate={state}
        whileHover={
          state !== "speaking" ? { y: -4, scale: 1.04 } : undefined
        }
        whileTap={state !== "speaking" ? { scale: 0.97 } : undefined}
      >
        {/* Outer halo glow */}
        <div className="orb-halo" />

        {/* Shimmer ring */}
        <div className="orb-shimmer" />

        {/* Rotating border ring */}
        <div className="orb-rotating-border" />

        {/* Ripple rings when listening */}
        <AnimatePresence>
          {state === "listening" && (
            <>
              {[0, 0.5, 1].map((delay, i) => (
                <motion.div
                  key={`ripple-${i}`}
                  className="orb-ripple"
                  initial={{ opacity: 0.7, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.8 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Volume ring SVG that fills while listening */}
        <AnimatePresence>
          {state === "listening" && (
            <motion.svg
              className="orb-volume-ring"
              viewBox="0 0 100 100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
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
                  transition: "stroke-dashoffset 0.1s ease-out",
                }}
              />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Countdown ring */}
        <CountdownRing
          duration={duration}
          timeLeft={timeLeft}
          isActive={isActive}
        />

        {/* Center content with smooth transitions */}
        <div className="orb-center-content">
          <AnimatePresence mode="wait">
            {state === "speaking" ? (
              <motion.div
                key="waveform"
                className="orb-waveform"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                {bars.map((scale, i) => (
                  <div
                    key={i}
                    className="orb-wave-bar"
                    style={{
                      animationDelay: `${i * 0.08}s`,
                      "--bar-scale": scale,
                    }}
                  />
                ))}
              </motion.div>
            ) : state === "listening" ? (
              <motion.div
                key="voice-viz"
                className="orb-voice-visualizer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                {bars.map((baseScale, i) => (
                  <div
                    key={i}
                    className="orb-voice-bar"
                    style={{
                      height: `${Math.max(4, voiceLevel * 28 * baseScale)}px`,
                      transition: "height 0.05s ease-out",
                    }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="mic-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <Mic className="orb-mic-icon" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>

      {/* Time remaining below orb */}
      <motion.div
        className="orb-time-display"
        animate={{
          opacity: timeLeft <= 10 ? [0.5, 1, 0.5] : 0.5,
        }}
        transition={{
          duration: 1,
          repeat: timeLeft <= 10 ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
      </motion.div>
    </motion.div>
  );
});

export default MicOrb;
