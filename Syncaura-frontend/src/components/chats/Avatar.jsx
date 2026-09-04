export default function Avatar({ label, gradient, src }) {
  const defaultGradient = "from-blue-500 to-blue-700";
  return (
    <div
      className={`w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 text-base md:text-lg lg:text-xl rounded-full flex items-center justify-center text-white font-medium bg-gradient-to-b ${gradient || defaultGradient} shrink-0 overflow-hidden shadow-sm`}
    >
      {src ? (
        <img src={src} alt="avatar" className="w-full h-full object-cover" />
      ) : (
        label || "U"
      )}
    </div>
  );
}