import React, { useEffect, useState } from "react";
import SparkleEffect from "./SparkleEffect";

export default function ForestImage({ highlighted }) {
  const [portalIntensified, setPortalIntensified] = useState(false);

  useEffect(() => {
    if (highlighted) {
      setPortalIntensified(true);
      const timeout = setTimeout(() => setPortalIntensified(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [highlighted]);

  const getHighlightPosition = (target) => {
    const positions = {
      deer: "top-[60%] left-[20%]",
      fox: "top-[70%] left-[45%]",
      owl: "top-[20%] left-[75%]",
      raccoon: "top-[65%] left-[60%]",
      red_panda: "top-[55%] left-[35%]",
      hedgehog: "top-[75%] left-[15%]",
      birds: "top-[30%] left-[40%]",
      treehouse: "top-[15%] left-[50%]",
      mushrooms: "top-[80%] left-[70%]",
      lanterns: "top-[40%] left-[30%]",
      bridge: "top-[85%] left-[50%]",
      waterfall: "top-[25%] left-[85%]",
    };
    return positions[target] || "";
  };

  return (
    <div className="relative rounded-[28px] overflow-hidden shadow-2xl cursor-glow">
      {/* Portal Glow Behind Image */}
      <div className={`portal-glow ${portalIntensified ? 'intensified' : ''}`}></div>
      
      <img
        src="/magical-forest-scene.jpg"
        alt="Magical Forest Scene"
        className="w-full h-auto object-cover rounded-[28px] hotspot-glow"
      />

      {/* Lantern Flicker Effects */}
      <div className="absolute top-[40%] left-[30%] lantern-flicker"></div>
      <div className="absolute top-[35%] left-[55%] lantern-flicker" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-[45%] left-[70%] lantern-flicker" style={{ animationDelay: '2s' }}></div>

      {highlighted && (
        <div
          className={`absolute w-24 h-24 border-4 border-goldAccent rounded-full animate-pulseGlow image-hotspot ${getHighlightPosition(highlighted)}`}
        />
      )}

      <SparkleEffect active={!!highlighted} />
    </div>
  );
}
