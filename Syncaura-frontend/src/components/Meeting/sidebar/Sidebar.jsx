import { X, Settings, Menu, LogOut } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Exact icons matching Figma design - using outlined style
const GridIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const FolderIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const ChatIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const DocumentIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const WarningIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const MegaphoneIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 11l18-5v12L3 13z" />
    <path d="M11 16a3 3 0 0 1-6 0" />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const SettingsIcon = () => <Settings className="w-5 h-5" />;

const menuItems = [
  { icon: GridIcon, label: "Dashboard", path: "/user-dashboard", badge: null },
  { icon: FolderIcon, label: "Projects", path: "/projects", badge: null },
  { icon: ChatIcon, label: "Chat", path: "/chat", badge: 10 },
  { icon: CalendarIcon, label: "Meetings", path: "/meetings", badge: 2 },
  {
    icon: DocumentIcon,
    label: "Documents And Report",
    path: "/documents",
    badge: null,
  },
  { icon: WarningIcon, label: "Complaints", path: "/complaints", badge: null },
  { icon: MegaphoneIcon, label: "Notice", path: "/notice", badge: 3 },
  {
    icon: ClockIcon,
    label: "Attendance And Leave",
    path: "/attendance-leave",
    badge: null,
  },
  { icon: SettingsIcon, label: "Settings", path: "/settings", badge: null },
];

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Backdrop - below header */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed top-[72px] left-0 right-0 bottom-0 bg-white/40 dark:bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar - below header */}
      <div
        className={`
    fixed top-[72px] left-0 bottom-0
    w-[220px]
    bg-[#ECEAEA] dark:bg-[#1A1A1A]
    shadow-[4px_0_10px_rgba(0,0,0,0.1)]
    z-50
    transform transition-transform duration-300 ease-in-out
    lg:hidden
    overflow-y-auto
    ${open ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        <div className="flex flex-col h-full">
          {/* Header with Profile and Close Button */}
          <div className="px-5 pt-2 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-start justify-between">
              {/* Profile Section */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col pt-2 cursor-pointer gap-1">
                  <Menu className="w-6 h-6 text-black cursor-pointer" />
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors btn-hover"
                aria-label="Close menu"
              >
                <X
                  className="w-6 h-6 text-black dark:text-gray-400"
                  strokeWidth={2}
                />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 py-1">
            {menuItems.map((item, index) => {
              const active = isActive(item.path);
              const Icon = item.icon;

              return (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  className={`btn-hover w-full flex items-center gap-4 px-4 py-2 transition-colors duration-150 relative ${
                      active
                        ? "bg-[#E8EEFF] dark:bg-[#1E293B]"
                        : "hover:bg-gray-50 dark:hover:bg-[#252525]"
                    } `}
                >
                  <div
                    className={`
                    flex-shrink-0
                    ${active ? "text-black dark:text-[#73FBFD]" : "text-black dark:text-gray-300"}
                  `}
                  >
                    <Icon />
                  </div>

                  <span
                    className={`
                      text-[15px] flex-1 text-left
                      ${
                        active
                          ? "text-black dark:text-white font-medium"
                          : "text-black dark:text-gray-300 font-normal"
                      }
                    `}
                  >
                    {item.label}
                  </span>

                  {item.badge && (
                    <span className="w-[22px] h-[22px] flex items-center justify-center text-[11px] font-semibold text-white bg-[#6366F1] dark:bg-[#6366F1] rounded-full flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Log Out */}
          <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
  <button 
    onClick={() => {
      console.log("Logging out...");
      // add your logout logic here
      setOpen(false);
    }}
    className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-950/20 btn-hover"
  >
    <LogOut className="w-5 h-5 text-[#EF4444]" />
    <span className="text-[#EF4444] font-semibold text-base">
      Log Out
    </span>
  </button>
</div>
        </div>
      </div>
    </>
  );
}
