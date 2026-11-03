import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy } from "lucide-react";

const MeetingDetail = ({ meetingLink, isDarkTheme }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="flex items-start justify-start w-full px-5 mt-3 ">
      <div className="flex flex-col items-start justify-center w-full gap-4 ">
        <div className="flex flex-col items-start justify-center w-full gap-1 ">
          <h1
            className={`${isDarkTheme ? "text-white" : "text-black"} text-lg font-normal`}
          >
            Joining Information
          </h1>
          <p
            className={`${isDarkTheme ? "text-white" : "text-black"} text-base font-light`}
          >
            {meetingLink}
          </p>
        </div>

        {/* Copy Section */}
        <motion.div
          onClick={handleCopy}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          className="relative flex items-center justify-start gap-3 cursor-pointer"
        >
          {/* Animated Icon */}
          <motion.div
            animate={copied ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Copy
              className={`${
                isDarkTheme ? "text-[#73FBFD]" : "text-[#2461E6]"
              } size-5`}
            />
          </motion.div>

          <p
            className={`${
              isDarkTheme ? "text-[#73FBFD]" : "text-[#2461E6]"
            } text-base hover:underline`}
          >
            Copy Joining Info
          </p>

          {/* Tooltip */}
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`absolute -top-10 left-0 px-3 py-1 rounded-md text-xs shadow-md
                ${
                  isDarkTheme
                    ? "bg-white text-black"
                    : "bg-black text-white"
                }`}
              >
                Link copied successfully
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default MeetingDetail