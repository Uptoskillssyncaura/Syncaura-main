import { useState } from "react";
import SupportChatbot from "../components/common/SupportChatbot";
import { useSelector } from "react-redux";

export default function MainLayout({ children, TopbarComponent, SideBar }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isDark = useSelector((state) => state.theme.isDark);

  return (
    <div
      data-theme={isDark ? "dark" : "light"}
      className="flex h-screen overflow-hidden bg-[#f6f7fb] dark:bg-black"
    >
      {SideBar && <SideBar open={sidebarOpen} setOpen={setSidebarOpen} />}

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Render the Topbar passed from parent */}
        {TopbarComponent && <TopbarComponent open={sidebarOpen} setOpen={setSidebarOpen} />}

        <div className="min-w-0 flex-1 min-h-0">{children}</div>
      </div>
      <SupportChatbot />
    </div>
  );
}
