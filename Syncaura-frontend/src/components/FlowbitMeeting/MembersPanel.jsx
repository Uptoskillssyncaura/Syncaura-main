import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, MicOff, MoreVertical } from "lucide-react";

function generateGradient(color) {
  // convert hex → rgb
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  // lighter version
  const light = `rgb(${Math.min(r + 40, 255)}, ${Math.min(g + 40, 255)}, ${Math.min(b + 40, 255)})`;

  // darker version
  const dark = `rgb(${Math.max(r - 60, 0)}, ${Math.max(g - 60, 0)}, ${Math.max(b - 60, 0)})`;

  return `radial-gradient(circle at 30% 30%, ${light} 0%, ${color} 45%, ${dark} 100%)`;
}


const MembersPanel = ({PARTICIPANTS}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-col w-full h-full   ">
      {/* Header (fixed height) */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center border rounded-t-2xl  border-gray-300 dark:border-[#575757] justify-between px-4 py-3 cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <span className="text-base font-medium text-gray-800 dark:text-gray-300">Members</span>
        </div>

        <div className="flex items-center justify-center gap-2 ">
          <h2 className="text-lg font-normal text-[#000000] dark:text-gray-300">
            {PARTICIPANTS.length}
          </h2>
          <motion.div
            animate={{ rotate: open ? 0 : 180 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronUp size={18} className="text-gray-700 dark:text-gray-200" />
          </motion.div>
        </div>
      </div>

      {/* Scrollable List */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-y-auto  pb-2 min-h-0 w-full"
          >
            <div className="flex-1 border rounded-b-2xl  py-4  border-gray-300 dark:border-[#575757] overflow-y-auto px-2 min-h-0">
              {PARTICIPANTS.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-900 transition"
                >
                  {/* Left */}
                  <div className="flex items-center gap-3">
                    <div
                      className="size-10 flex items-center justify-center rounded-full text-white font-medium text-sm"
                      style={{
                        background: generateGradient(user.color),
                      }}
                    >
                      {user.initial}
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-lg font-normal text-black dark:text-white">
                        {user.name}
                      </span>
                      {user.isHost && (
                        <span className="text-xs font-light text-black -mt-1.5 dark:text-gray-300">
                          Meeting Host
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-3 text-gray-500">
                    <MicOff size={16} />
                    <MoreVertical size={16} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MembersPanel