import {
  Calendar,
  CheckCircle2,
  Ellipsis,
  Flag,
  Tally2,
  Eye,
  Edit3,
  Copy,
  Trash2,
  ChevronRight,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

const ProjectCard = ({
  id,
  title,
  department,
  priority,
  progress,
  avatars = [],
  dueDate,
  onAction,
}) => {
  const user = useSelector((state) => state.auth.user);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const [showStatusSubmenu, setShowStatusSubmenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
        setShowStatusSubmenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showMenu]);

  const handleAction = (actionType, targetStatus = null) => {
    setShowMenu(false);
    setShowStatusSubmenu(false);

    if (onAction) {
      onAction(
        actionType,
        { id, title, department, priority, progress, dueDate },
        targetStatus
      );
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "N/A";
    const parsed = new Date(iso);
    if (isNaN(parsed.getTime())) return iso;
    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
  };

  const priorityColor = {
    Critical: "bg-[#FEE2E2] text-[#C71212]",
    Ongoing: "bg-[#DBEAFE] text-[#0000A5]",
    "On Hold": "bg-[#F3F4F6] text-[#69707E]",
    Completed: "bg-[#DCFCE7] text-[#004500]",
  };

  const bottomIconBgColor = {
    Critical: "bg-[#FEE2E2] text-[#C71212] dark:bg-[#212121]",
    Ongoing: "bg-[#DBEAFE] text-[#0000A5] dark:bg-[#212121]",
    "On Hold": "bg-[#F3F4F6] text-[#69707E] dark:bg-[#212121]",
    Completed: "bg-[#DCFCE7] text-[#004500] dark:bg-[#212121]",
  };

  const bottomIcon = {
    Critical: <Flag className="size-3.5 text-[#C71212] fill-[#C71212]" />,
    Ongoing: <Calendar className="size-3.5 text-[#0000A5]" />,
    "On Hold": <Tally2 className="size-5 text-[#69707E]" />,
    Completed: <CheckCircle2 className="size-5 text-[#004500]" />,
  };

  const visibleAvatars = (avatars || []).slice(0, 2);
  const extraCount = (avatars || []).length - visibleAvatars.length;

  return (
    <div className="relative bg-white dark:bg-[#2E2F2F] w-60 md:w-80 flex flex-col gap-12 shrink-0 box-border px-4 py-3 rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col w-full gap-3">
        <div className="flex items-center justify-between w-full relative">
          <div className={`px-3 py-1 rounded-xl ${priorityColor[priority] || priorityColor.Ongoing}`}>
            <p className="text-xs font-semibold">{priority}</p>
          </div>

          {/* Action Menu Button */}
          <div className="relative">
            <button
              ref={buttonRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu((prev) => !prev);
              }}
              aria-label="Project Actions Menu"
              className="p-1.5 rounded-full text-[#989696] hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#404040] transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
            >
              <Ellipsis className="size-5" />
            </button>

            {/* Dropdown Action Menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-9 z-50 w-44 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-1.5 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => handleAction("view")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors text-left cursor-pointer"
                  >
                    <Eye className="size-4 text-blue-500" />
                    <span>View Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction("edit")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors text-left cursor-pointer"
                  >
                    <Edit3 className="size-4 text-emerald-500" />
                    <span>Edit Project</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction("duplicate")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors text-left cursor-pointer"
                  >
                    <Copy className="size-4 text-purple-500" />
                    <span>Duplicate</span>
                  </button>

                  {/* Change Status Submenu Toggle */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowStatusSubmenu((prev) => !prev)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="size-4 text-amber-500" />
                        <span>Change Status</span>
                      </div>
                      <ChevronRight className={`size-3.5 text-gray-400 transition-transform ${showStatusSubmenu ? "rotate-90" : ""}`} />
                    </button>

                    {/* Status Options Submenu */}
                    <AnimatePresence>
                      {showStatusSubmenu && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.15 }}
                          className="bg-gray-50 dark:bg-[#151515] py-1 border-y border-gray-100 dark:border-gray-800 overflow-hidden"
                        >
                          {[
                            { label: "Ongoing", color: "bg-[#0000A5]" },
                            { label: "Completed", color: "bg-[#004500]" },
                            { label: "On Hold", color: "bg-[#69707E]" },
                            { label: "Critical", color: "bg-[#C71212]" },
                          ].map((st) => (
                            <button
                              key={st.label}
                              type="button"
                              onClick={() => handleAction("status", st.label)}
                              className={`w-full flex items-center gap-2 px-5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#252525] transition-colors text-left cursor-pointer ${priority === st.label ? "font-bold text-black dark:text-white bg-gray-200/60 dark:bg-[#202020]" : ""
                                }`}
                            >
                              <span className={`size-2 rounded-full ${st.color}`} />
                              <span>{st.label}</span>
                              {priority === st.label && <Check className="size-3 ml-auto text-blue-500 dark:text-[#73FBFD]" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

                  {user?.role === "admin" && (
                    <button
                      type="button"
                      onClick={() => handleAction("delete")}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left cursor-pointer"
                    >
                      <Trash2 className="size-4 text-red-500" />
                      <span>Delete Project</span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-black dark:text-[#FFFFFF]">{title}</h1>
          <p className="text-sm text-[#989696] dark:text-[#989696]">{department}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between px-2">
            <p className="text-sm font-semibold text-[#989696]">Progress</p>
            <p className="text-sm font-semibold text-[#989696]">{progress}%</p>
          </div>

          <div className="relative w-full h-2 bg-[#F3F4F6] rounded-2xl overflow-hidden">
            <motion.div
              style={{ width: `${progress}%` }}
              className={`h-2 ${priority === "Critical"
                ? "bg-[#C71212]"
                : priority === "Ongoing"
                  ? "bg-[#0000A5]"
                  : priority === "On Hold"
                    ? "bg-[#69707E]"
                    : "bg-[#004500]"
                } rounded-l-2xl ${progress === 100 ? "rounded-r-2xl" : ""}`}
            />
          </div>
        </div>

        {/* Avatars + Date */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center -space-x-3">
            {visibleAvatars.map((src, i) => (
              <img
                key={i}
                src={src}
                className="size-8 rounded-full border-2 border-white object-cover"
                alt="Member avatar"
              />
            ))}

            {extraCount > 0 && (
              <span className="size-8 text-xs font-semibold flex items-center justify-center bg-[#F3F4F6] rounded-full border border-white text-[#000000]">
                +{extraCount}
              </span>
            )}
          </div>

          <div
            className={`flex items-center gap-1 ${bottomIconBgColor[priority] || bottomIconBgColor.Ongoing} px-3 py-1 rounded-lg`}
          >
            {bottomIcon[priority] || bottomIcon.Ongoing}
            <p className="text-xs font-semibold">
              {priority === "Completed"
                ? "Done"
                : priority === "On Hold" || priority === "on Hold"
                  ? "TBD"
                  : formatDate(dueDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
