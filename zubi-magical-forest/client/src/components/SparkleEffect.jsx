import React from 'react';

const SparkleEffect = ({ active }) => {
  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-goldAccent rounded-full animate-sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1.5}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SparkleEffect;
