import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export default function FilterDropdown({ startVal, options = [], label, onChange }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(startVal);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setValue(startVal);
  }, [startVal]);

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
    <div ref={dropdownRef} className="flex flex-col gap-1 relative w-full">
      {/* Label */}
      {label && (
        <label className="text-[11px] font-bold tracking-wider uppercase text-gray-600 dark:text-gray-400">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((p) => !p)}
        className="
          w-full flex items-center justify-between h-[36px]
          rounded-xl px-3 py-1.5 text-xs font-medium
          border border-gray-300 dark:border-[#2A2A2A]
          bg-white dark:bg-[#0B0B0B]
          text-gray-900 dark:text-white
          hover:border-[#2461E6] dark:hover:border-[#73FBFD]
          transition-colors cursor-pointer
          focus:outline-none
        "
      >
        <span className="truncate">{value}</span>

        <ChevronDown className={`size-3.5 text-gray-500 dark:text-gray-400 transition-transform duration-200 shrink-0 ml-1.5 ${open ? "rotate-180" : ""}`} />
      </motion.button>

      {/* Dropdown Popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="
              absolute top-full mt-1 w-full min-w-[130px] z-50
              rounded-xl overflow-hidden
              border border-gray-200 dark:border-[#2A2A2A]
              bg-white dark:bg-[#121212]
              shadow-2xl max-h-60 overflow-y-auto py-1
            "
          >
            {options && options.length > 0 ? (
              options.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setValue(item);
                    onChange?.(item);
                    setOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left cursor-pointer transition-colors
                    ${
                      value === item
                        ? "bg-blue-50 dark:bg-blue-950/40 text-[#2461E6] dark:text-[#73FBFD] font-bold"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1C1C1C]"
                    }
                  `}
                >
                  <span className="truncate">{item}</span>
                  {value === item && <Check className="size-3.5 text-[#2461E6] dark:text-[#73FBFD] shrink-0 ml-1.5" />}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-gray-400">No options</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}