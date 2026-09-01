import { useCallback, useEffect, useState } from "react";
import {
  Menu,
  LayoutDashboard,
  Folder,
  CheckSquare,
  MessageCircle,
  Calendar,
  FileText,
  AlertTriangle,
  Megaphone,
  Clock,
  UserCheck,
  Settings,
  X,
  LogOut,
  User,
} from "lucide-react";
import LogoutConfirmationModal from "../common/LogoutConfirmationModal";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useIsDesktop } from "../dashboard/Main/SubMain/Left/hook/useMediaQuery";


export default function MobileSidebar({ open, setOpen }) {
  const { t } = useTranslation();
  const isDark = useSelector((state) => state.theme.isDark);
 const user = useSelector((state) => state.auth.user);
const channels = useSelector((state) => state.chat?.channels || []);
const isDesktop = useIsDesktop();
const dispatch = useDispatch();
const navigate = useNavigate();
  const dashboardPath =
  user?.role === "admin"
    ? "/admin"
    : user?.role === "co-admin"
      ? "/co-admin"
      : "/user-dashboard";

  const menuItems = [
  {
    label: "dashboard",
    icon: LayoutDashboard,
    path: dashboardPath,
    count: 0,
  },
  {
    label: "projects",
    icon: Folder,
    path: "/projects",
    count: 0,
  },
  {
    label: "chat",
    icon: MessageCircle,
    path: "/chat",
    count: 10,
  },
  {
    label: "meetings",
    icon: Calendar,
    path: "/meetings",
    count: 2,
  },
  {
    label: "tasks",
    icon: CheckSquare,
    path: "/tasks",
    count: 0,
  },
  {
    label: "notice",
    icon: Megaphone,
    path: "/notice",
    count: 0,
  },
  {
    label: "documents",
    icon: FileText,
    path: "/documents",
    count: 0,
  },
  {
    label: "complaints",
    icon: AlertTriangle,
    path: "/complaints",
    count: 0,
  },
  {
    label: "attendance",
    icon: Clock,
    path: "/attendance-leave",
    count: 0,
  },
  {
    label: "myAttendance",
    icon: UserCheck,
    path: "/my-attendance",
    count: 0,
  },
  {
    label: "settings",
    icon: Settings,
    path: "/settings",
    count: 0,
  },
  {
    label: "profile",
    icon: User,
    path: "/profile",
    count: 0,
  },
];

  // Calculate total unread messages from channels
  const totalUnreadChats = channels?.reduce((acc, chat) => acc + (parseInt(chat.unread) || 0), 0) || 0;

  // Dynamically update the Chat menu item's count
  const dynamicMenuItems = menuItems.map(item => 
    item.label === "Chat" ? { ...item, count: totalUnreadChats } : item
  );

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const logOutHandle = useCallback(() => {
    setShowLogoutModal(true); // Opens the popup overlay modal
  }, []);

  return (
    <>
      {!isDesktop && open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
        />
      )}

      <aside
        data-theme={isDark ? "dark" : "light"}
        className={`
        bg-[#F8F8F8] dark:bg-[#2E2F2F]
        h-screen flex flex-col
        fixed md:relative
        top-0 left-0 z-50 border-r border-[#E0DDDD] dark:border-[#575757]
        transition-all duration-300 ease-in-out shrink-0
        ${
          open
            ? "w-[240px] translate-x-0 opacity-100"
            : "w-0 -translate-x-full opacity-0 pointer-events-none border-none overflow-hidden"
        }
      `}
      >
        <div className="flex items-center justify-between px-4 py-4 min-w-[240px]">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-[#575757] transition-colors btn-hover cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <Menu size={28} className="text-[#000000] dark:text-[#F8F8F8]" />
          </button>
          {!isDesktop && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-[#575757] transition-colors btn-hover cursor-pointer"
              aria-label="Close sidebar"
            >
              <X size={20} className="text-[#000000] dark:text-[#F8F8F8]" />
            </button>
          )}
        </div>

        <nav className="px-1 space-y-1 flex-1 overflow-y-auto min-w-[238px]">
          {dynamicMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => !isDesktop && setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xl cursor-pointer
         text-black dark:text-[#F8F8F8]
         transition-colors
         ${
           isActive
             ? "bg-[#2457C529] dark:bg-[#73FBFD]/10 font-medium"
             : "hover:bg-gray-100 dark:hover:bg-[#575757]"
         }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span className="text-lg">{t(item.label)}</span>
                </div>

                {item.count > 0 && (
                  <span
                    className="
            size-5
            flex items-center justify-center
            rounded-full text-xs font-semibold
            bg-[#5361EB] text-white dark:text-[#000000]
            dark:bg-[#73FBFD]
        "
                  >
                    {item.count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex flex-col gap-5 px-4 py-4">
          <div className="h-px w-full bg-[#E0DDDD] dark:bg-[#575757]" />
          <button
            onClick={() => logOutHandle()}
            className="flex cursor-pointer items-center justify-center gap-5 w-full"
          >
            <LogOut className="size-6 text-[#FF0000]" />
            <h2 className="text-[#FF0000] text-xl font-semibold">
            {t("logout")}
            </h2>
          </button>
        </div>
      </aside>
      <LogoutConfirmationModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
      />
    </>
  );
}