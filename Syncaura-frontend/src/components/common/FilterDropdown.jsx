import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FilterDropdown({ startVal, options = [], label, onChange }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(startVal);
  const dropdownRef = useRef(null);

  // Keep internal state in sync if parent component updates startVal
  useEffect(() => {
    setValue(startVal);
  }, [startVal]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="flex flex-col gap-2 relative">
      {/* Label */}
      {label && (
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 500, damping: 22 }}
        onClick={() => setOpen((p) => !p)}
        className="
          w-full flex items-center justify-between
          rounded-full px-4 py-2 text-sm
          border border-gray-200 dark:border-[#3A3A3A]
          bg-white dark:bg-[#121212]
          text-gray-800 dark:text-gray-200
          focus:outline-none
        "
      >
        <span>{value}</span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown className="size-4" />
        </motion.span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className="
              absolute top-full mt-2 w-full z-50
              rounded-2xl overflow-hidden
              border border-gray-200 dark:border-[#3A3A3A]
              bg-white dark:bg-[#121212]
              shadow-lg max-h-60 overflow-y-auto
            "
          >
            {options && options.length > 0 ? (
              options.map((item) => (
                <motion.button
                  key={item}
                  type="button"
                  whileHover={{ backgroundColor: "rgba(36,97,230,0.08)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setValue(item);
                    onChange?.(item);
                    setOpen(false);
                  }}
                  className={`
                    w-full text-left px-4 py-2 text-sm
                    text-gray-700 dark:text-gray-200
                    ${value === item ? "font-semibold text-[#2461E6] dark:text-[#73FBFD]" : ""}
                  `}
                >
                  {item}
                </motion.button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-400">No options</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}