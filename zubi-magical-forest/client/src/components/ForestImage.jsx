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

  // Corrected percentage-based highlight positions for actual forest image
  const highlightPositions = {
    deer: { top: "64%", left: "18%", width: "25%", height: "30%", label: "Deer" },
    fox: { top: "65%", left: "56%", width: "15%", height: "30%", label: "Fox" },
    boy: { top: "38%", left: "56%", width: "10%", height: "20%", label: "Boy" },
    girl: { top: "49%", left: "32%", width: "10%", height: "20%", label: "Girl" },
    owl: { top: "37%", left: "63%", width: "8%", height: "15%", label: "Owl" },
    "red panda": { top: "33%", left: "37%", width: "10%", height: "20%", label: "Red Panda" },
    raccoon: { top: "15%", left: "64%", width: "12%", height: "12%", label: "Raccoons" },
    raccoons: { top: "15%", left: "64%", width: "12%", height: "12%", label: "Raccoons" },
    hedgehog: { top: "58%", left: "76%", width: "6%", height: "6%", label: "Hedgehog" },
    lanterns: { top: "38%", left: "32%", width: "14%", height: "12%", label: "Lanterns" },
    house: { top: "12%", left: "48%", width: "18%", height: "18%", label: "Treehouse" },
    treehouse: { top: "12%", left: "35%", width: "50%", height: "50%", label: "Treehouse" },
    "rope bridge": { top: "55%", left: "15%", width: "35%", height: "13%", label: "Bridge" },
    waterfall: { top: "42%", left: "76%", width: "12%", height: "18%", label: "Waterfall" },
    birds: { top: "30%", left: "22%", width: "16%", height: "20%", label: "Birds" },
    "mushroom house": { top: "36%", left: "86%", width: "10%", height: "30%", label: "Mushrooms" },
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

      <div className="image-wrapper">
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

        {/* Overlay layer for highlights - positioned relative to image */}
        <div className="overlay-layer">
          {/* Magical highlight overlay for identified objects */}
          <AnimatePresence>
            {highlightData && (
              <motion.div
                className="highlight-box"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  top: highlightData.top,
                  left: highlightData.left,
                  width: highlightData.width,
                  height: highlightData.height,
                }}
              >
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
        </div>

        <SparkleEffect active={!!highlighted} />
      </div>
    </motion.div>
  );
});

export default ForestImage;
