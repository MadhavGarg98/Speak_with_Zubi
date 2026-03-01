import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SparkleEffect from "./SparkleEffect";

export default function ForestImage({ highlighted, conversationActive }) {
  const [portalIntensified, setPortalIntensified] = useState(false);

  useEffect(() => {
    if (highlighted) {
      setPortalIntensified(true);
      const timeout = setTimeout(() => setPortalIntensified(false), 1200);
      return () => clearTimeout(timeout);
    }
  }, [highlighted]);

  const highlightPositions = {
    deer: { top: '60%', left: '20%' },
    fox: { top: '70%', left: '45%' },
    owl: { top: '20%', left: '75%' },
    raccoon: { top: '65%', left: '60%' },
    red_panda: { top: '55%', left: '35%' },
    hedgehog: { top: '75%', left: '15%' },
    birds: { top: '30%', left: '40%' },
    treehouse: { top: '15%', left: '50%' },
    mushrooms: { top: '80%', left: '70%' },
    lanterns: { top: '40%', left: '30%' },
    bridge: { top: '85%', left: '50%' },
    waterfall: { top: '25%', left: '85%' },
  };

  // Ambient lanterns
  const lanterns = useMemo(() => [
    { top: '38%', left: '28%', delay: 0 },
    { top: '33%', left: '53%', delay: 1 },
    { top: '43%', left: '70%', delay: 2.2 },
    { top: '55%', left: '15%', delay: 3.5 },
    { top: '28%', left: '82%', delay: 1.7 },
  ], []);

  return (
    <motion.div
      className="image-panel"
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Portal glow behind the image */}
      <div className={`image-portal-glow ${portalIntensified ? 'intensified' : ''} ${conversationActive ? 'active' : ''}`} />

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
            style={{ top: l.top, left: l.left, animationDelay: `${l.delay}s` }}
          />
        ))}

        {/* Highlight circle for identified objects */}
        <AnimatePresence>
          {highlighted && highlightPositions[highlighted] && (
            <motion.div
              className="highlight-circle"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                top: highlightPositions[highlighted].top,
                left: highlightPositions[highlighted].left,
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}
        </AnimatePresence>

        <SparkleEffect active={!!highlighted} />
      </div>
    </motion.div>
  );
}
