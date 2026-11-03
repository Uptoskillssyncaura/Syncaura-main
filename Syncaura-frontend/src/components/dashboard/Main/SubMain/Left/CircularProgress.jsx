import { useState, useEffect } from "react";

const CircularProgress = ({
  value = 50,
  radius = 40,
  strokeWidth = 2.5,
  color = "#3361FF",
  badgeAngle = 45,
  startAngle = -90,
  animationDuration = 2000,
  trackColor = "#D6DDFC",
  badgeFadeDuration = 500,
  shadowColor = "#D4F5D7",
  showShadow = false,
  children
}) => {
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  const size = radius * 2;

  const radians = (badgeAngle * Math.PI) / 180;
  const x = radius + normalizedRadius * Math.cos(radians);
  const y = radius + normalizedRadius * Math.sin(radians);

  const [progress, setProgress] = useState(0);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    setProgress(value);

    const timer = setTimeout(() => {
      setShowBadge(true);
    }, animationDuration);

    return () => clearTimeout(timer);
  }, [value, animationDuration]);

  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {showShadow && (
          <defs>
            <filter id="circleShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="2"
                floodColor={shadowColor}
                floodOpacity="1"
              />
            </filter>
          </defs>
        )}

        {/* Background */}
        <circle
          stroke={trackColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          filter={showShadow ? "url(#circleShadow)" : undefined}
        />

        {/* Progress */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(${startAngle} ${radius} ${radius})`}
          style={{
            transition: `stroke-dashoffset ${animationDuration}ms ease-in-out`,
          }}
          filter={showShadow ? "url(#circleShadow)" : undefined}
        />
      </svg>

      {/* Badge */}
      <div
        className="absolute px-4 py-2 text-xs font-semibold text-white rounded-full transition-opacity"
        style={{
          backgroundColor: color,
          left: x,
          top: y,
          transform: "translate(-50%, -50%)",
          opacity: showBadge ? 1 : 0,
          transition: `opacity ${badgeFadeDuration}ms ease-in-out`,
        }}
      >
        {Math.round(progress)}%
      </div>


      {/* Children */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </div>
  );
};

export default CircularProgress;
