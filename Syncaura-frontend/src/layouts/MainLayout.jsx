import { useState } from "react";
import SupportChatbot from "../components/common/SupportChatbot";
import { useSelector } from "react-redux";

export default function MainLayout({
  children,
  TopbarComponent,
  SideBar,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isDark = useSelector((state) => state.theme.isDark);

  return (
    <div
      data-theme={isDark ? "dark" : "light"}
      className="
        min-h-screen
        md:h-screen
        md:overflow-hidden
        bg-[#f6f7fb]
        dark:bg-black
        md:flex
      "
    >
      {/* Sidebar */}
      {SideBar && (
        <SideBar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />
      )}

      {/* Main Area */}
      <div
        className="
          min-w-0
          flex-1
          min-h-screen
          md:h-screen
          flex
          flex-col
          overflow-x-hidden
        "
      >
        {/* Header */}
        {TopbarComponent && (
          <TopbarComponent
            open={sidebarOpen}
            setOpen={setSidebarOpen}
          />
        )}

        {/* Page Content */}
        <main
          className="
            min-w-0
            flex-1
            md:min-h-0
            md:overflow-y-auto
            overflow-x-hidden
          "
        >
          {children}
        </main>
      </div>

      {/* Support Chatbot */}
      <SupportChatbot />
    </div>
  );
}