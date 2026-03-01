import React, { useEffect, useState } from "react";
import SparkleEffect from "./SparkleEffect";

export default function ForestImage({ highlighted }) {
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

  return (
    <div className="image-panel">
      {/* Portal glow behind the image */}
      <div className={`image-portal-glow ${portalIntensified ? 'intensified' : ''}`} />

      <div className="image-container">
        <img
          src="/magical-forest-scene.jpg"
          alt="A magical enchanted forest scene with animals, lanterns, treehouse, mushrooms and a waterfall"
          crossOrigin="anonymous"
        />

        {/* Inner glow overlay */}
        <div className="image-inner-glow" />

        {/* Golden border highlight */}
        <div className="image-border-highlight" />

        {/* Lantern flickers */}
        <div className="lantern-glow" style={{ top: '40%', left: '30%' }} />
        <div className="lantern-glow" style={{ top: '35%', left: '55%', animationDelay: '1s' }} />
        <div className="lantern-glow" style={{ top: '45%', left: '72%', animationDelay: '2.2s' }} />

        {/* Highlight circle for identified objects */}
        {highlighted && highlightPositions[highlighted] && (
          <div
            className="highlight-circle"
            style={{
              top: highlightPositions[highlighted].top,
              left: highlightPositions[highlighted].left,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}

        <SparkleEffect active={!!highlighted} />
      </div>
    </div>
  );
}
