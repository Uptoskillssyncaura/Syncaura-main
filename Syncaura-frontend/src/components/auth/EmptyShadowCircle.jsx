const EmptyShadowCircle = ({
  sizeClass = "size-40",
  borderClass = "border-2",
}) => {
  return (
    <div className={`relative ${sizeClass}`}>
      {/* Neon glow */}
      <div
        className={`
          absolute inset-0 rounded-[50%_50%]
          border border-cyan-400
          blur-xl opacity-70
        `}
      />

      {/* Strong glow */}
      <div
        className={`
          absolute inset-0 rounded-[50%_50%]
          border border-blue-400
          blur-md opacity-80
        `}
      />

      {/* Main sharp outline */}
      <div
        className={`
          absolute inset-0 rounded-[50%_50%]
          border ${borderClass}
          border-blue-400
          shadow-[0_0_25px_rgba(34,211,238,0.9)]
        `}
      />
    </div>
  );
};

export default EmptyShadowCircle