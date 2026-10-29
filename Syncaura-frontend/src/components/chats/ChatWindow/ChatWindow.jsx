import ChatInput from "../ChatInput";
import ChatHeader from "../ChatHeader/ChatHeader";
import ChatMessages from "../ChatMessage/ChatMessages";
import GeometricBackground from "../ChatMessage/GeometricBackground";
import { useChatSocket } from "../../../hooks/useChatSocket";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchMessages } from "../../../redux/features/chatThunks";

export default function ChatWindow({ chat, onBack, setOpen, viewMode = "chat" }) {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.chat);
  const { sendMessageText, sendTyping, emitRead } = useChatSocket(chat?.id);

  useEffect(() => {
    if (chat?.id) {
      dispatch(fetchMessages(chat.id));
    }
  }, [chat?.id, dispatch]);

  const channelMessages = messages[chat?.id] || [];

  return (
    <section
      className={
        "relative flex-1 flex flex-col min-h-0 " +
        (chat ? "flex" : "hidden md:flex")
      }
    >
      {chat ? (
        <>
          <ChatHeader chat={chat} setOpen={setOpen} onBack={onBack} />

          {/* Chat body */}
          <div className="relative flex-1 overflow-hidden min-h-0 bg-[#E0F2FE] dark:bg-[#0B141A]">
            {/* Content */}
            <div className="relative z-10 flex flex-col h-full min-h-0">
              <ChatMessages viewMode={viewMode} currentChat={chat} messages={channelMessages} emitRead={emitRead} />
              {viewMode === "chat" && <ChatInput sendMessageText={sendMessageText} sendTyping={sendTyping} />}
            </div>
          </div>
        </>
      ) : (
        <div className="relative flex-1 hidden md:flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-10 pointer-events-none">
            <GeometricBackground />
          </div>

          <div className="absolute inset-0 z-5 bg-white/50 dark:bg-black/50 backdrop-blur-sm" />

          <div className="relative z-10 text-gray-600 dark:text-gray-300 text-sm font-medium">
            {viewMode === "starred" 
              ? "Select a conversation to view starred messages"
              : viewMode === "archived"
              ? "Select an archived conversation"
              : "Select a conversation to start chatting"}
          </div>
        </div>
      )}
    </section>
  );
}