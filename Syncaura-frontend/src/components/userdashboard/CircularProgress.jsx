import React from "react";
import { motion } from "framer-motion";

const CircularProgress = ({
  percentage = 75,
  size = 160,
  data = null,
  strokeWidth = 25,
  progressColor = "#127FEC",
  trackColor = "#E5E7EB",
  startAngle = -90,
  showText = true,
  label = "FINISHED",
  textColor = "#000", // This is the prop we send from Dashboard
  labelColor = "#9CA3AF",
  fontSize = 28,
  duration = 2,
  textSize = 15,
  innerBg = "bg-white",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={`relative flex items-center justify-center rounded-full ${innerBg}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: `rotate(${startAngle}deg)` }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progressOffset }}
          transition={{ duration, ease: "easeInOut" }}
        />
      </svg>

      {showText && (
        <div className="absolute flex flex-col items-center">
          <span
            // THE FIX: We apply the textColor prop here via inline styles
            style={{ fontSize, color: textColor }} 
            className="font-bold"
          >
            {data ?? `${percentage}%`}
          </span>
          <span
            style={{ fontSize: textSize, color: labelColor }}
            className="text-xs font-semibold uppercase"
          >
            {label}
          </span>
        </div>
      )}
    </div>
  );
};

export default CircularProgress;