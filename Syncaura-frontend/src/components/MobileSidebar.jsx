import { useCallback, useEffect } from "react";
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
    Settings,
    X,
    LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useIsDesktop } from "./dashboard/Main/SubMain/Left/hook/useMediaQuery";

const menuItems = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/user-dashboard",
        count: 0,
    },
    { label: "Projects", icon: Folder, path: "/projects", count: 0 },
    { label: "Chat", icon: MessageCircle, path: "/chat", count: 10 },
    { label: "Meetings", icon: Calendar, path: "/meetings", count: 2 },
    { label: "Tasks", icon: CheckSquare, path: "/tasks", count: 0 },
    { label: "Notice", icon: Megaphone, path: "/notice", count: 0 },
    { label: "Documents", icon: FileText, path: "/documents", count: 0 },
    { label: "Complaints", icon: AlertTriangle, path: "/complaints", count: 0 },
    {
        label: "Attendance & Leave",
        icon: Clock,
        path: "/attendance-leave",
        count: 0,
    },
    { label: "Settings", icon: Settings, path: "/settings", count: 0 },
];

export default function MobileSidebar({ open, setOpen }) {
    const isDark = useSelector((state) => state.theme.isDark);
    const isDesktop = useIsDesktop();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isDesktop && open) {
            setOpen(false);
        }
    }, [isDesktop, open, setOpen]);

    const logOutHandle = useCallback(() => {
        console.log("LogOut SUccessfully");
        dispatch(logout());
        navigate("/");
    }, [dispatch, navigate]);

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
        w-[280px]
        h-screen flex flex-col
        fixed md:static
        top-0 left-0 z-50 border-r border-[#E0DDDD] dark:border-[#575757]
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
    `}
            >
                <div className="flex md:hidden items-center justify-between px-4 py-4">
                    <button onClick={() => setOpen(false)}>
                        <X size={20} className="text-[#000000] dark:text-[#F8F8F8]" />
                    </button>
                </div>
                <div className="md:flex hidden items-center justify-between px-4 py-4">
                    <Menu size={30} className="text-[#000000] dark:text-[#F8F8F8]" />
                </div>

                <nav className="px-1 space-y-1 flex-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center justify-between px-3 py-2 rounded-lg text-xl cursor-pointer
         text-black dark:text-[#F8F8F8]
         transition-colors
         ${isActive
                                        ? "bg-[#2457C529] dark:bg-[#73FBFD]/10 font-medium"
                                        : "hover:bg-gray-100 dark:hover:bg-[#575757]"
                                    }`
                                }
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={20} />
                                    <span className="text-lg">{item.label}</span>
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
                        <h2 className="text-[#FF0000] text-xl font-semibold">Log Out</h2>
                    </button>
                </div>
            </aside>
        </>
    );
}
