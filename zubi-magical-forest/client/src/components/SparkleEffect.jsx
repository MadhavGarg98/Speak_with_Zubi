import React from 'react';

const SparkleEffect = ({ active }) => {
  if (!active) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className="sparkle-dot"
          style={{
            left: `${15 + Math.random() * 70}%`,
            top: `${15 + Math.random() * 70}%`,
            animationDelay: `${Math.random() * 0.8}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SparkleEffect;
