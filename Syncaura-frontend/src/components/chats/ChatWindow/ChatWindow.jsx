import ChatInput from "../ChatInput";
import ChatHeader from "../ChatHeader/ChatHeader";
import ChatMessages from "../ChatMessage/ChatMessages";
import GeometricBackground from "../ChatMessage/GeometricBackground";

export default function ChatWindow({ chat, onBack, setOpen, viewMode = "chat" }) {
  return (
    <section
      className={
        "relative flex-1 flex flex-col " +
        (chat ? "flex" : "hidden md:flex")
      }
    >
      {chat ? (
        <>
          <ChatHeader chat={chat} setOpen={setOpen} onBack={onBack} />

          {/* Chat body */}
          <div className="relative flex-1 overflow-hidden min-h-0">
            {/* Background */}
            <div className="absolute w-full inset-0 z-0 pointer-events-none">
              <GeometricBackground />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full min-h-0">
              <ChatMessages viewMode={viewMode} currentChat={chat} />
              {viewMode === "chat" && <ChatInput />}
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