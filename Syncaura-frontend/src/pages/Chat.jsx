import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/chats/ChatSideBar/Sidebar";
import ChatWindow from "../components/chats/ChatWindow/ChatWindow";
import ProfilePanel from "../components/chats/ProfilePanel";
import { fetchChannels } from "../redux/features/chatThunks";
import { setActiveChannel } from "../redux/slices/chatSlice";

export default function Chat() {
  const dispatch = useDispatch();
  const { channels, activeChannel } = useSelector((state) => state.chat);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);

  useEffect(() => {
    setOpen(false);
  }, [activeChannel?.id]);

  const handleSelectChat = (chat) => {
    dispatch(setActiveChannel(chat));
  };

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
      <div className="w-full md:w-[280px] lg:w-[320px] border-r border-gray-200 dark:border-gray-800 overflow-hidden h-full flex-shrink-0">
        <Sidebar
          chats={channels}
          selectedChat={activeChannel}
          onSelect={handleSelectChat}
        />
      </div>

      {/* CHAT WINDOW */}
      <div className="flex-1 w-full flex flex-col min-w-0 min-h-0">
        <ChatWindow
          chat={activeChannel}
          setOpen={setOpen}
          onBack={() => dispatch(setActiveChannel(null))}
        />
      </div>

      {/* PROFILE PANEL (ONLY DESKTOP) */}
      <div className="hidden lg:block">
        <ProfilePanel
          isOpen={open}
          onClose={() => setOpen(false)}
          profile={activeChannel?.profile}
          chatDetails={activeChannel?.chatDetails}
          files={activeChannel?.files || []}
        />
      </div>
    </div>
  );
}