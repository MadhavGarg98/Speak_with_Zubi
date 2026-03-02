import React, { useEffect, useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SparkleEffect from "./SparkleEffect";

const ForestImage = memo(function ForestImage({ highlighted, conversationActive }) {
  const [portalIntensified, setPortalIntensified] = useState(false);

  useEffect(() => {
    if (highlighted) {
      setPortalIntensified(true);
      const timeout = setTimeout(() => setPortalIntensified(false), 1200);
      return () => clearTimeout(timeout);
    }
  }, [highlighted]);

  // Extended highlight positions with sizes for different objects
  const highlightPositions = {
    deer: { top: "60%", left: "20%", width: 120, height: 100, label: "Deer" },
    fox: { top: "70%", left: "45%", width: 80, height: 70, label: "Fox" },
    boy: { top: "40%", left: "42%", width: 90, height: 110, label: "Boy" },
    girl: { top: "55%", left: "55%", width: 80, height: 100, label: "Girl" },
    owl: { top: "20%", left: "75%", width: 60, height: 60, label: "Owl" },
    red_panda: { top: "55%", left: "35%", width: 70, height: 70, label: "Red Panda" },
    raccoon: { top: "65%", left: "60%", width: 90, height: 70, label: "Raccoons" },
    raccoons: { top: "65%", left: "60%", width: 90, height: 70, label: "Raccoons" },
    hedgehog: { top: "75%", left: "15%", width: 60, height: 50, label: "Hedgehog" },
    lanterns: { top: "40%", left: "30%", width: 100, height: 80, label: "Lanterns" },
    house: { top: "15%", left: "50%", width: 130, height: 120, label: "Treehouse" },
    treehouse: { top: "15%", left: "50%", width: 130, height: 120, label: "Treehouse" },
    bridge: { top: "85%", left: "50%", width: 140, height: 60, label: "Bridge" },
    waterfall: { top: "25%", left: "85%", width: 90, height: 120, label: "Waterfall" },
    birds: { top: "30%", left: "40%", width: 100, height: 60, label: "Birds" },
    mushrooms: { top: "80%", left: "70%", width: 80, height: 60, label: "Mushrooms" },
  };

  // Ambient lanterns
  const lanterns = useMemo(
    () => [
      { top: "38%", left: "28%", delay: 0 },
      { top: "33%", left: "53%", delay: 1 },
      { top: "43%", left: "70%", delay: 2.2 },
      { top: "55%", left: "15%", delay: 3.5 },
      { top: "28%", left: "82%", delay: 1.7 },
    ],
    []
  );

  const highlightData = highlighted ? highlightPositions[highlighted] : null;

  return (
    <motion.div
      className="image-panel"
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Portal glow behind the image */}
      <div
        className={`image-portal-glow ${portalIntensified ? "intensified" : ""} ${
          conversationActive ? "active" : ""
        }`}
      />

      <div className="image-container">
        <img
          src="/magical-forest-scene.jpg"
          alt="A magical enchanted forest scene with animals, lanterns, treehouse, mushrooms and a waterfall"
          crossOrigin="anonymous"
        />

        {/* Ambient mist overlay */}
        <div className="image-mist-overlay" />

        {/* Inner glow overlay */}
        <div className="image-inner-glow" />

        {/* Golden border highlight */}
        <div className="image-border-highlight" />

        {/* Lantern flickers */}
        {lanterns.map((l, i) => (
          <div
            key={i}
            className="lantern-glow"
            style={{
              top: l.top,
              left: l.left,
              animationDelay: `${l.delay}s`,
            }}
          />
        ))}

        {/* Magical highlight overlay for identified objects */}
        <AnimatePresence>
          {highlightData && (
            <motion.div
              className="highlight-zone"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.15 }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                top: highlightData.top,
                left: highlightData.left,
                width: highlightData.width,
                height: highlightData.height,
              }}
            >
              {/* Radial golden glow */}
              <motion.div
                className="highlight-glow"
                animate={{
                  opacity: [0.6, 0.9, 0.6],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Soft golden border */}
              <motion.div
                className="highlight-border"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Label tooltip */}
              <motion.div
                className="highlight-label"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ delay: 0.2, duration: 0.35 }}
              >
                {highlightData.label}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <SparkleEffect active={!!highlighted} />
      </div>
    </motion.div>
  );
});

export default ForestImage;
