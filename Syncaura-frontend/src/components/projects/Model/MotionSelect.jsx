import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";


const MotionSelect = ({ options, startVal, value, onChange }) => {
    const [open, setOpen] = useState(false);
    // const [value, setValue] = useState(startVal);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative w-full">
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between bg-white dark:bg-[#2E2F2F] py-2 px-5 rounded-2xl text-sm font-semibold text-[#898888] btn-hover"
            >
                {value || startVal}
                <ChevronDown
                    size={18}
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.ul
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="
        absolute z-50 mt-2 w-full
        rounded-2xl bg-white dark:bg-[#2E2F2F]
        shadow-[0_0_20px_0_#C8C6C6] dark:shadow-none
        max-h-48 overflow-y-auto
        no-scrollbar
      "
                    >
                        {options.map((opt, idx) => (
                            <li
                                key={idx}
                                onClick={() => {
                                    onChange(opt);
                                    setOpen(false);
                                }}
                                className="cursor-pointer px-5 py-2 text-sm text-black dark:text-[#c4bfbf] dark:hover:bg-[#525353] hover:bg-gray-100"
                            >
                                {opt}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>

        </div>
    );
};

export default MotionSelect;
