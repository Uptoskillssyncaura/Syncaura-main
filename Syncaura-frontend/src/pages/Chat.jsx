import { useEffect, useState } from "react";
import Sidebar from "../components/chats/ChatSideBar/Sidebar";
import ChatWindow from "../components/chats/ChatWindow/ChatWindow";
import { CHATS } from "../constant/constant";
import ProfilePanel from "../components/chats/ProfilePanel";

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [selectedChat?.id]);

  return (
    <div
      className="
        h-[calc(100vh-3.3rem)] 
        xl:h-[calc(100vh-4.9rem)] 
        w-full mt-1 
        flex flex-col md:flex-row 
        bg-gray-100 dark:bg-[#121212] 
        transition-colors duration-500
        overflow-hidden
      "
    >
      {/* SIDEBAR */}
      <div className="w-full md:w-[280px] lg:w-[320px] border-r border-gray-200 dark:border-gray-800">
        <Sidebar
          chats={CHATS}
          selectedChat={selectedChat}
          onSelect={setSelectedChat}
        />
      </div>

      {/* CHAT WINDOW */}
      <div className="flex-1 w-full flex flex-col">
        <ChatWindow
          chat={selectedChat}
          setOpen={setOpen}
          onBack={() => setSelectedChat(null)}
        />
      </div>

      {/* PROFILE PANEL (ONLY DESKTOP) */}
      <div className="hidden lg:block w-[320px] border-l border-gray-200 dark:border-gray-800">
        <ProfilePanel
          isOpen={open}
          onClose={() => setOpen(false)}
          profile={selectedChat?.profile}
          chatDetails={selectedChat?.chatDetails}
          files={selectedChat?.files || []}
        />
      </div>
    </div>
  );
}