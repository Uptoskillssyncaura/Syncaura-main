import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, X, Check } from "lucide-react";


const MotionSelect = ({ options, startVal, value, onChange, searchable = false, multiple = false }) => {
    const [open, setOpen] = useState(false);
    // const [value, setValue] = useState(startVal);
    const [search, setSearch] = useState("");
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);
    
    const filteredOptions = options.filter((opt) =>
        opt.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (opt) => {
        if (multiple) {
            const currentValues = Array.isArray(value) ? value : [];
            let nextValues;
            if (currentValues.includes(opt)) {
                nextValues = currentValues.filter((v) => v !== opt);
            } else {
                nextValues = [...currentValues, opt];
            }
            onChange(nextValues);
        } else {
            onChange(opt);
            setOpen(false);
        }
        setSearch("");
    };

    const handleRemove = (opt) => {
        if (multiple) {
            const currentValues = Array.isArray(value) ? value : [];
            const nextValues = currentValues.filter((v) => v !== opt);
            onChange(nextValues);
        }
    };

    const handleOpen = () => {
        setOpen((prev) => !prev);
        setSearch("");
    };
   
    return (
        <div ref={ref} className="relative w-full">
            {/* Trigger */}
            <button
                type="button"
                onClick={handleOpen}
                className="w-full flex items-center justify-between bg-white dark:bg-[#2E2F2F] py-2 px-5 rounded-2xl text-sm font-semibold text-[#898888] btn-hover text-left"
            >
                {multiple && Array.isArray(value) && value.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 items-center w-full">
                        {value.map((val) => (
                            <span
                                key={val}
                                className="flex items-center gap-1 bg-[#2461E6]/10 dark:bg-[#73FBFD]/10 text-[#2461E6] dark:text-[#73FBFD] px-2.5 py-1 rounded-xl text-xs font-bold"
                            >
                                {val}
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(val);
                                    }}
                                    className="cursor-pointer hover:text-red-500 ml-0.5 flex items-center justify-center"
                                >
                                    <X size={12} />
                                </span>
                            </span>
                        ))}
                    </div>
                ) : (
                    <span>{value || startVal}</span>
                )}
                <ChevronDown
                    size={18}
                    className={`transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
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
                        max-h-48 overflow-hidden
            
                    "
                    >
                         {/* Search box */}
                        {searchable && (
                            <div className="p-2 border-b border-gray-200 dark:border-[#525353]">
                                <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#3A3B3B] rounded-xl px-3">
                                    <Search
                                        size={16}
                                        className="text-gray-500"
                                    />

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search..."
                                        autoFocus
                                        className="
                                            w-full
                                            bg-transparent
                                            outline-none
                                            py-2
                                            text-sm
                                            text-black
                                            dark:text-white
                                            placeholder:text-gray-500
                                        "
                                    />
                                </div>
                            </div>
                        )}

                        {/* Options */}
                        <ul className="max-h-48 overflow-y-auto no-scrollbar">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt, idx) => {
                                    const isSelected = multiple
                                        ? Array.isArray(value) && value.includes(opt)
                                        : value === opt;
                                    return (
                                        <li
                                            key={idx}
                                            onClick={() => handleSelect(opt)}
                                            className={`
                                                cursor-pointer
                                                px-5 py-2
                                                text-sm
                                                text-black
                                                dark:text-[#c4bfbf]
                                                dark:hover:bg-[#525353]
                                                hover:bg-gray-100
                                                flex items-center justify-between
                                                ${isSelected ? "bg-gray-50 dark:bg-[#3A3B3B] font-semibold text-[#2461E6] dark:text-[#73FBFD]" : ""}
                                            `}
                                        >
                                            <span>{opt}</span>
                                            {isSelected && (
                                                <Check size={16} className="text-[#2461E6] dark:text-[#73FBFD]" />
                                            )}
                                        </li>
                                    );
                                })
                            ) : (
                                <li
                                    className="
                                        px-5 py-3
                                        text-sm
                                        text-gray-500
                                        text-center
                                    "
                                >
                                    No results found
                                </li>
                            )}
                        </ul>
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MotionSelect;
