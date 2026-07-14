export default function Avatar({ label, gradient }) {
  return (
    <div
      className={`w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 text-base md:text-lg lg:text-xl rounded-full flex items-center justify-center text-white font-medium bg-linear-to-b ${gradient} shrink-0`}
    >
      {label}
    </div>
  );
}