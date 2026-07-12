import { useState } from "react";
import SupportChatbot from "../components/SupportChatbot";
import { useSelector } from "react-redux";

export default function MainLayout({ children, TopbarComponent, SideBar }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDark=useSelector((state)=> state.theme.isDark)

  return (
    <div data-theme={isDark? "dark": "light"} className="flex h-screen overflow-hidden bg-[#f6f7fb] dark:bg-black">
      {SideBar && <SideBar open={sidebarOpen} setOpen={setSidebarOpen} />}

      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Render the Topbar passed from parent */}
        {TopbarComponent && <TopbarComponent setOpen={setSidebarOpen} />}

       
          {children}
       
      </div>
    </div>
  );
}
