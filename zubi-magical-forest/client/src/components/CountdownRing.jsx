import { useEffect, useState } from "react";

export default function CountdownRing({ duration, isActive }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration);
      return;
    }

    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isActive, duration]);

  const size = 88;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / duration) * circumference;

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
        stroke="rgba(244, 201, 93, 0.15)"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#F4C95D"
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
    </svg>
  );
}
