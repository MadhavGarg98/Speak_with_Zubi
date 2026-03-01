import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const SparkleEffect = ({ active }) => {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: `${10 + Math.random() * 80}%`,
        top: `${10 + Math.random() * 80}%`,
        delay: Math.random() * 0.6,
        size: 3 + Math.random() * 4,
        duration: 1 + Math.random() * 0.8,
      })),
    []
  );

  if (!active) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="sparkle-dot"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0.8, 0],
            scale: [0.3, 1.5, 2, 2.5],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            ease: 'easeOut',
          }}
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
          }}
        />
      ))}
    </div>
  );
};

export default SparkleEffect;
