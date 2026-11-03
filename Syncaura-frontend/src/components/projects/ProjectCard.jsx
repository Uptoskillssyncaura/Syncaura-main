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
  members = [],
  owner = null,
  dueDate,
  onAction,
}) => {
  const user = useSelector((state) => state.auth.user);
  const userRole = (user?.role || localStorage.getItem("role") || "").toLowerCase();
  const isAdminOrCoAdmin = userRole === "admin" || userRole === "co-admin" || userRole === "coadmin";
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
    "In Progress": "bg-[#DBEAFE] text-[#0000A5]",
    ACTIVE: "bg-[#DBEAFE] text-[#0000A5]",
    "Not Started": "bg-[#EDE9FE] text-[#6D28D9]",
    Planning: "bg-[#FEF3C7] text-[#D97706]",
    Backlog: "bg-[#F3F4F6] text-[#4B5563]",
    "On Hold": "bg-[#F3F4F6] text-[#69707E]",
    Completed: "bg-[#DCFCE7] text-[#004500]",
  };

  const bottomIconBgColor = {
    Critical: "bg-[#FEE2E2] text-[#C71212] dark:bg-[#212121]",
    Ongoing: "bg-[#DBEAFE] text-[#0000A5] dark:bg-[#212121]",
    "In Progress": "bg-[#DBEAFE] text-[#0000A5] dark:bg-[#212121]",
    ACTIVE: "bg-[#DBEAFE] text-[#0000A5] dark:bg-[#212121]",
    "Not Started": "bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#212121]",
    Planning: "bg-[#FEF3C7] text-[#D97706] dark:bg-[#212121]",
    Backlog: "bg-[#F3F4F6] text-[#4B5563] dark:bg-[#212121]",
    "On Hold": "bg-[#F3F4F6] text-[#69707E] dark:bg-[#212121]",
    Completed: "bg-[#DCFCE7] text-[#004500] dark:bg-[#212121]",
  };

  const bottomIcon = {
    Critical: <Flag className="size-3.5 text-[#C71212] fill-[#C71212]" />,
    Ongoing: <Calendar className="size-3.5 text-[#0000A5]" />,
    "In Progress": <Calendar className="size-3.5 text-[#0000A5]" />,
    ACTIVE: <Calendar className="size-3.5 text-[#0000A5]" />,
    "Not Started": <Calendar className="size-3.5 text-[#6D28D9]" />,
    Planning: <Calendar className="size-3.5 text-[#D97706]" />,
    Backlog: <Calendar className="size-3.5 text-[#4B5563]" />,
    "On Hold": <Tally2 className="size-5 text-[#69707E]" />,
    Completed: <CheckCircle2 className="size-5 text-[#004500]" />,
  };

  const membersList = (Array.isArray(members) && members.length > 0)
    ? members
    : (Array.isArray(avatars) && avatars.length > 0)
      ? avatars.map((a, i) => (typeof a === "object" ? a : { id: i, profile_pic: a }))
      : (owner ? [owner] : []);

  const visibleMembers = membersList.slice(0, 3);
  const extraCount = membersList.length - visibleMembers.length;

  const getInitials = (item) => {
    const name = typeof item === "string" ? item : item?.name || item?.email || "U";
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getAvatarColor = (idx) => {
    const colors = [
      "bg-blue-600 text-white",
      "bg-emerald-600 text-white",
      "bg-purple-600 text-white",
      "bg-amber-600 text-white",
      "bg-rose-600 text-white",
    ];
    return colors[idx % colors.length];
  };

  return (
    <div className="relative bg-white dark:bg-[#2E2F2F] w-full flex flex-col justify-between gap-8 box-border p-5 rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-gray-800/80 transition-colors duration-300 hover:shadow-lg">
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

                  {isAdminOrCoAdmin && (
                    <>
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
                                { label: "Not Started", color: "bg-[#6D28D9]" },
                                { label: "In Progress", color: "bg-[#0000A5]" },
                                { label: "Planning", color: "bg-[#D97706]" },
                                { label: "On Hold", color: "bg-[#69707E]" },
                                { label: "Completed", color: "bg-[#004500]" },
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

                      <button
                        type="button"
                        onClick={() => handleAction("delete")}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left cursor-pointer"
                      >
                        <Trash2 className="size-4 text-red-500" />
                        <span>Delete Project</span>
                      </button>
                    </>
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
                : priority === "Ongoing" || priority === "In Progress" || priority === "ACTIVE"
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
          <div className="flex items-center -space-x-2">
            {visibleMembers.length > 0 ? (
              visibleMembers.map((m, i) => {
                const pic = typeof m === "object" ? m.profile_pic : m;
                const mName = typeof m === "object" ? (m.name || m.email || "Member") : "Member";
                return pic ? (
                  <img
                    key={i}
                    src={pic}
                    title={mName}
                    className="size-8 rounded-full border-2 border-white dark:border-[#2E2F2F] object-cover"
                    alt={mName}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    key={i}
                    title={mName}
                    className={`size-8 rounded-full border-2 border-white dark:border-[#2E2F2F] flex items-center justify-center text-xs font-bold ${getAvatarColor(i)}`}
                  >
                    {getInitials(m)}
                  </div>
                );
              })
            ) : (
              <span className="text-[11px] text-gray-400 font-medium">No members</span>
            )}

            {extraCount > 0 && (
              <span className="size-8 text-xs font-semibold flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-white dark:border-[#2E2F2F] text-gray-700 dark:text-gray-200">
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
