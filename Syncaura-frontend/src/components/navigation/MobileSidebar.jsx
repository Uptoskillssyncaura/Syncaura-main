import { useCallback, useState } from "react";
import {
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
  ClipboardCheck,
} from "lucide-react";
import LogoutConfirmationModal from "../common/LogoutConfirmationModal";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { useIsDesktop } from "../dashboard/Main/SubMain/Left/hook/useMediaQuery";

export default function MobileSidebar({ open, setOpen }) {
  const { t } = useTranslation();

  const isDark = useSelector(
    (state) => state.theme.isDark
  );

  const user = useSelector(
    (state) => state.auth.user
  );

  const channels = useSelector(
    (state) => state.chat?.channels || []
  );

  const isDesktop = useIsDesktop();

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  /* ---------------------------------
     Dashboard path based on role
  ---------------------------------- */
  const dashboardPath =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "co-admin"
        ? "/co-admin"
        : "/user-dashboard";

  /* ---------------------------------
     Sidebar menu items
  ---------------------------------- */
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
      count: 0,
    },
    {
      label: "meetings",
      icon: Calendar,
      path: "/meetings",
      count: 0,
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
      label: "Issues & Complaints",
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

  /* ---------------------------------
     Calculate unread chat messages
  ---------------------------------- */
  const totalUnreadChats =
    channels?.reduce(
      (acc, chat) =>
        acc + (parseInt(chat.unread) || 0),
      0
    ) || 0;

  /* ---------------------------------
     Update Chat notification count
  ---------------------------------- */
  const dynamicMenuItems = menuItems.map(
    (item) =>
      item.label === "chat"
        ? {
            ...item,
            count: totalUnreadChats,
          }
        : item
  );

  /* ---------------------------------
     Logout
  ---------------------------------- */
  const logOutHandle = useCallback(() => {
    setShowLogoutModal(true);
  }, []);

  return (
    <>
      {/* =====================================
          MOBILE OVERLAY
      ====================================== */}
      {!isDesktop && open && (
        <div
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            bg-black/30
            z-[9998]
            md:hidden
          "
          aria-hidden="true"
        />
      )}

      {/* =====================================
          SIDEBAR
      ====================================== */}
      <aside
        data-theme={isDark ? "dark" : "light"}
        className={`
          bg-[#F8F8F8]
          dark:bg-[#2E2F2F]

          h-screen

          flex
          flex-col

          fixed
          md:relative

          top-0
          left-0

          z-[9999]

          border-r
          border-[#E0DDDD]
          dark:border-[#575757]

          transition-all
          duration-300
          ease-in-out

          shrink-0

          ${
            open
              ? `
                w-[240px]
                translate-x-0
                opacity-100
              `
              : `
                w-0
                -translate-x-full
                opacity-0
                pointer-events-none
                border-none
                overflow-hidden
              `
          }
        `}
      >
        {/* =====================================
            SIDEBAR TOP
        ====================================== */}
        <div
          className="
            flex
            items-center
            justify-between

            px-4
            py-4

            min-w-[240px]

            shrink-0
          "
        >
          {/* Logo */}
          <div
            className="
              text-xl
              font-semibold
              text-black
              dark:text-white
            "
          >
            Flowbit
          </div>

          {/* Close button - Mobile only */}
          {!isDesktop && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="
                p-1.5
                rounded-lg

                hover:bg-gray-200
                dark:hover:bg-[#575757]

                transition-colors

                btn-hover
                cursor-pointer
              "
              aria-label="Close sidebar"
            >
              <X
                size={20}
                className="
                  text-[#000000]
                  dark:text-[#F8F8F8]
                "
              />
            </button>
          )}
        </div>

        {/* =====================================
            SCROLLABLE MENU
        ====================================== */}
        <nav
          className="
            flex-1
            min-h-0
            overflow-y-auto
            overflow-x-hidden
            px-2
            pb-4
            min-w-[240px]
          "
        >
          <div className="space-y-1">
            {dynamicMenuItems.map((item) => {
              const Icon = item.icon;

              return (

                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={() => {
                    if (!isDesktop) {
                      setOpen(false);
                    }
                  }}
                  className={({ isActive }) =>
                    `
                      flex
                      items-center
                      justify-between

                      w-full

                      px-3
                      py-2.5

                      rounded-lg

                      cursor-pointer

                      text-black
                      dark:text-[#F8F8F8]

                      transition-colors

                      ${
                        isActive
                          ? `
                            bg-[#2457C529]
                            dark:bg-[#73FBFD]/10
                            font-medium
                          `
                          : `
                            hover:bg-gray-100
                            dark:hover:bg-[#575757]
                          `
                      }
                    `
                  }
                >
                  {/* Menu item left side */}
                  <div
                    className="
                      flex
                      items-center
                      gap-3

                      min-w-0
                    "
                  >
                    <Icon
                      size={20}
                      className="shrink-0"
                    />

                    <span
                      className="
                        text-lg
                        truncate
                      "
                    >
                      {t(item.label)}
                    </span>
                  </div>

                  {/* Notification count */}
                  {item.count > 0 && (
                    <span
                      className="
                        size-5
                        shrink-0

                        flex
                        items-center
                        justify-center

                        rounded-full

                        text-xs
                        font-semibold

                        bg-[#5361EB]
                        text-white

                        dark:bg-[#73FBFD]
                        dark:text-black
                      "
                    >
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* =====================================
            LOGOUT SECTION
        ====================================== */}
        <div
          className="
            shrink-0

            flex
            flex-col
            gap-4

            px-4
            py-4

            min-w-[240px]

            bg-[#F8F8F8]
            dark:bg-[#2E2F2F]
          "
        >
          {/* Divider */}
          <div
            className="
              h-px
              w-full

              bg-[#E0DDDD]
              dark:bg-[#575757]
            "
          />

          {/* Logout button */}
          <button
            type="button"
            onClick={logOutHandle}
            className="
              flex
              items-center
              justify-center

              gap-4

              w-full

              cursor-pointer
              rounded-lg

              py-2

              hover:bg-red-50
              dark:hover:bg-red-900/10

              transition-colors
            "
          >
            <LogOut
              className="
                size-6
                text-[#FF0000]
              "
            />

            <span
              className="
                text-[#FF0000]
                text-xl
                font-semibold
              "
            >
              {t("logout")}
            </span>
          </button>
        </div>
      </aside>

      {/* =====================================
          LOGOUT CONFIRMATION MODAL
      ====================================== */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() =>
          setShowLogoutModal(false)
        }
      />
    </>
  );
}