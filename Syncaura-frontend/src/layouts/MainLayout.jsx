import { useState } from "react";
import SupportChatbot from "../components/SupportChatbot";
import { useSelector } from "react-redux";

export default function MainLayout({ children, TopbarComponent, SideBar }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDark=useSelector((state)=> state.theme.isDark)

  return (
    <div data-theme={isDark? "dark": "light"} className="flex h-screen overflow-hidden bg-[#f6f7fb] dark:bg-black">
      {SideBar && <SideBar open={sidebarOpen} setOpen={setSidebarOpen} />}

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Render the Topbar passed from parent */}
        {TopbarComponent && <TopbarComponent setOpen={setSidebarOpen} />}

       
          <div className="min-w-0 flex-1">{children}</div>
       
      </div>
     <div className="relative">
       <SupportChatbot/>
     </div>
    </div>
  );
}
