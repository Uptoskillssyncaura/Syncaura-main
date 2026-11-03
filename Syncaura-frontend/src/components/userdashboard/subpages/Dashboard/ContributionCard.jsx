import { motion } from "framer-motion";

const ContributionCard = ({
  title,
  subtitle,
  value,
  lightColor,
  darkColor,
}) => {
  return (
    <div className="flex flex-col items-center w-full md:px-5">
      {/* Bar Container */}
      <div className="relative w-full h-28 sm:h-32 md:h-36  rounded-t-4xl overflow-hidden">
        
        {/* Animated Bar */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: value / 100, opacity: 1 }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
          }}
          style={{
            transformOrigin: "bottom",
          }}
          className={`absolute bottom-0 w-full h-full ${lightColor} ${darkColor}  rounded-t-4xl`}
        />
      </div>

      {/* Labels */}
      <div className="mt-3 text-center">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default ContributionCard;