import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, X, Check, Loader2 } from "lucide-react";

const getOptionKey = (opt, index) => {
  if (opt && typeof opt === "object") {
    return opt.id || opt.email || opt.value || opt.name || index;
  }
  return `${opt}-${index}`;
};

const getOptionLabel = (opt) => {
  if (!opt) return "";
  if (typeof opt === "object") {
    return opt.name || opt.label || opt.title || opt.email || "";
  }
  return String(opt);
};

const getOptionSubLabel = (opt) => {
  if (!opt || typeof opt !== "object") return "";
  const parts = [];
  if (opt.email) parts.push(opt.email);
  if (opt.role) parts.push(opt.role);
  if (parts.length > 0) return parts.join(" · ");
  return opt.subLabel || "";
};

const getOptionValue = (opt) => {
  if (!opt) return "";
  if (typeof opt === "object") {
    return opt.id || opt.email || opt.name || opt.value || "";
  }
  return String(opt);
};

const isOptionSelected = (opt, currentValue, multiple) => {
  if (!currentValue) return false;
  const optVal = String(getOptionValue(opt) || "").toLowerCase();
  const optId = opt?.id ? String(opt.id).toLowerCase() : null;
  const optEmail = opt?.email ? String(opt.email).toLowerCase() : null;
  const optName = opt?.name ? String(opt.name).toLowerCase() : null;

  const matchItem = (item) => {
    if (!item) return false;
    if (typeof item === "object") {
      if (optId && item.id && String(item.id).toLowerCase() === optId) return true;
      if (optEmail && item.email && String(item.email).toLowerCase() === optEmail) return true;
      if (optName && item.name && String(item.name).toLowerCase() === optName) return true;
      const itemVal = String(getOptionValue(item) || "").toLowerCase();
      return itemVal === optVal;
    }
    const itemStr = String(item).toLowerCase();
    return (
      itemStr === optVal ||
      (optId && itemStr === optId) ||
      (optEmail && itemStr === optEmail) ||
      (optName && itemStr === optName)
    );
  };

  if (multiple) {
    if (!Array.isArray(currentValue)) return false;
    return currentValue.some(matchItem);
  }
  return matchItem(currentValue);
};

const MotionSelect = ({
  options = [],
  startVal = "Select...",
  value,
  onChange,
  searchable = false,
  multiple = false,
  loading = false,
  error = null,
  hasError = false,
  searchPlaceholder = "Search users...",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropUp, setDropUp] = useState(false);
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

  const filteredOptions = (options || []).filter((opt) => {
    if (!search.trim()) return true;
    const query = search.trim().toLowerCase();
    const label = getOptionLabel(opt).toLowerCase();
    const sub = getOptionSubLabel(opt).toLowerCase();
    return label.includes(query) || sub.includes(query);
  });

  const handleSelect = (opt) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? [...value] : [];
      const selected = isOptionSelected(opt, currentValues, true);
      let nextValues;
      if (selected) {
        nextValues = currentValues.filter((v) => !isOptionSelected(opt, v, false));
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

  const handleRemove = (itemToRemove, e) => {
    if (e) e.stopPropagation();
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const nextValues = currentValues.filter((v) => !isOptionSelected(itemToRemove, v, false));
      onChange(nextValues);
    }
  };

  const handleOpen = () => {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // If space below is limited and there is more space above, open upwards
      setDropUp(spaceBelow < 320 && spaceAbove > spaceBelow);
    }
    setOpen((prev) => !prev);
    setSearch("");
  };

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        className={`w-full flex items-center justify-between min-h-[46px] bg-white dark:bg-[#2E2F2F] py-2 px-5 rounded-2xl text-sm font-semibold transition-colors text-left cursor-pointer border ${
          hasError
            ? "border-red-500"
            : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
        } focus:outline-none`}
      >
        {multiple && Array.isArray(value) && value.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 items-center w-full py-0.5">
            {value.map((item, idx) => {
              const label = getOptionLabel(item);
              return (
                <span
                  key={getOptionKey(item, idx)}
                  className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-[#73FBFD] px-2.5 py-1 rounded-xl text-xs font-semibold"
                >
                  <span className="truncate max-w-[140px]">{label}</span>
                  <span
                    onClick={(e) => handleRemove(item, e)}
                    className="cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900 rounded-full p-0.5 text-blue-500 dark:text-[#73FBFD] transition-colors flex items-center justify-center"
                    title="Remove"
                  >
                    <X size={12} />
                  </span>
                </span>
              );
            })}
          </div>
        ) : (
          <span className={value ? "text-black dark:text-white font-medium" : "text-[#898888]"}>
            {value ? getOptionLabel(value) : startVal}
          </span>
        )}
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform shrink-0 ml-2 ${open ? "rotate-180 text-blue-500 dark:text-[#73FBFD]" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute left-0 right-0 z-[100] ${
              dropUp ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top"
            } rounded-2xl bg-white dark:bg-[#2E2F2F] shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-gray-200 dark:border-gray-700 overflow-hidden`}
          >
            {/* Search box (Sticky at top) */}
            {searchable && (
              <div className="sticky top-0 z-10 p-2.5 bg-white dark:bg-[#2E2F2F] border-b border-gray-200 dark:border-[#525353]">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#3A3B3B] rounded-xl px-3 border border-transparent focus-within:border-blue-500 dark:focus-within:border-[#73FBFD] transition-colors">
                  <Search size={16} className="text-gray-400 dark:text-gray-500 shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={searchPlaceholder || "Search users..."}
                    autoFocus
                    className="w-full bg-transparent outline-none py-2 text-sm text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Scrollable List Container (max-h around 300px) */}
            <ul className="max-h-[280px] sm:max-h-[320px] overflow-y-auto divide-y divide-gray-100 dark:divide-[#383a3d]">
              {loading ? (
                <li className="px-5 py-6 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin text-blue-600 dark:text-[#73FBFD]" />
                  <span>Loading users...</span>
                </li>
              ) : error ? (
                <li className="px-5 py-4 text-xs text-red-500 text-center">
                  {error}
                </li>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((opt, idx) => {
                  const isSelected = isOptionSelected(opt, value, multiple);
                  const label = getOptionLabel(opt);
                  const subLabel = getOptionSubLabel(opt);

                  return (
                    <li
                      key={getOptionKey(opt, idx)}
                      onClick={() => handleSelect(opt)}
                      className={`cursor-pointer px-4 py-2.5 text-sm transition-colors flex items-center justify-between gap-3 hover:bg-gray-100 dark:hover:bg-[#3A3B3B] ${
                        isSelected
                          ? "bg-blue-50/70 dark:bg-[#333a42] text-blue-600 dark:text-[#73FBFD]"
                          : "text-gray-900 dark:text-[#E0E0E0]"
                      }`}
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className={`text-sm font-semibold truncate ${isSelected ? "text-blue-600 dark:text-[#73FBFD]" : "text-gray-900 dark:text-white"}`}>
                          {label}
                        </span>
                        {subLabel && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {subLabel}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <div className="shrink-0 flex items-center justify-center size-5 rounded-full bg-blue-600 dark:bg-[#73FBFD] text-white dark:text-black">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </li>
                  );
                })
              ) : (
                <li className="px-5 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                  No users found
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MotionSelect;
