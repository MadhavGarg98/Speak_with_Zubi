import { useEffect, useRef } from "react";

export default function CountdownRing({ duration, timeLeft, isActive }) {
  const prevTimeRef = useRef(timeLeft);

  useEffect(() => {
    prevTimeRef.current = timeLeft;
  }, [timeLeft]);

  const size = 96;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = isActive ? (timeLeft / duration) * circumference : circumference;

  // Color transitions from gold to red as time runs out
  const timePercent = timeLeft / duration;
  let strokeColor = '#F4C95D';
  if (timePercent < 0.25) strokeColor = '#ef5350';
  else if (timePercent < 0.5) strokeColor = '#ffab40';

  return (
    <svg
      width={size}
      height={size}
      className="orb-countdown-ring"
      style={{ transform: 'rotate(-90deg)' }}
    >
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(244, 201, 93, 0.1)"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        style={{
          transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
          filter: timePercent < 0.25 ? 'drop-shadow(0 0 4px rgba(239, 83, 80, 0.5))' : 'none',
        }}
      />
    </svg>
  );
}
