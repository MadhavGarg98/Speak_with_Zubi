import { useEffect, useState } from "react";

export default function CountdownRing({ duration, onComplete, isActive }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration);
      return;
    }

    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isActive, duration, onComplete]);

  const radius = 42; // Adjusted for 96px container
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / duration) * circumference;

  return (
    <svg width="96" height="96" className="transform -rotate-90 absolute inset-0">
      <circle
        cx="48"
        cy="48"
        r={radius}
        stroke="rgba(244, 201, 93, 0.2)"
        strokeWidth="4"
        fill="transparent"
      />
      <circle
        cx="48"
        cy="48"
        r={radius}
        stroke="#F4C95D"
        strokeWidth="4"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-linear"
      />
    </svg>
  );
}
