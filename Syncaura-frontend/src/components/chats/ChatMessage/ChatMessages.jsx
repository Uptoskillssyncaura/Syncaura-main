import MessageBubble from "../MessageBubble";
import { Star } from "lucide-react";
import { useState } from "react";

export default function ChatMessages({ viewMode = "chat", currentChat }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey bro, you free ah? Need to ask something.",
      isOwn: false,
      starred: true,
      timestamp: "2:30 PM",
      sender: "Aarav M",
      avatar: "A"
    },
    {
      id: 2,
      text: "Ya I'm free. What do you want to ask?",
      isOwn: true,
      starred: true,
      timestamp: "2:30 PM",
      sender: "You",
      avatar: "J"
    },
    {
      id: 3,
      text: "Can you help me with the project?",
      isOwn: false,
      starred: false,
      timestamp: "2:31 PM",
      sender: "Aarav M",
      avatar: "A"
    },
    {
      id: 4,
      text: "Sure, what do you need?",
      isOwn: true,
      starred: false,
      timestamp: "2:31 PM",
      sender: "You",
      avatar: "J"
    },
  ]);

  const toggleStar = (id) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, starred: !msg.starred } : msg))
    );
  };

  // Filter messages based on view mode
  const displayMessages =
    viewMode === "starred" ? messages.filter((msg) => msg.starred) : messages;

  // If in starred view, show special layout
  if (viewMode === "starred") {
    return (
      <div className="relative flex-1 overflow-hidden h-full">
        <div className="relative flex-1 overflow-y-auto p-3 md:p-4 z-20">
          {displayMessages.length > 0 ? (
            displayMessages.map((message) => (
              <div
                key={message.id}
                className="mb-4 bg-[#ECECEC] dark:bg-[#3A3A3A] rounded-2xl p-3 md:p-4"
              >
                {/* Header with sender info */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-medium text-[#000000] dark:text-[#FFFFFF]">
                      {message.sender}
                    </span>
                    <span className="text-sm text-[#666666] dark:text-[#999999]">{">"}</span>
                    <span className="text-sm font-medium text-[#000000] dark:text-[#FFFFFF]">
                      {message.isOwn ? currentChat?.name || "Aarav M" : "You"}
                    </span>
                  </div>
                  <span className="text-xs text-[#666666] dark:text-[#999999]">
                    {message.timestamp}
                  </span>
                </div>

                {/* Message bubble */}
                <div className="relative">
                  <MessageBubble text={message.text} isOwn={message.isOwn} />
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <p>No starred messages</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Regular chat view
  return (
    <div className="relative flex-1 overflow-hidden h-full">
      <div className="relative flex-1 overflow-y-auto p-3 md:p-4 z-20">
        <div className="flex justify-center mb-4">
          <span className="text-xs md:text-sm font-semibold bg-[#C5D7FF] text-[#1C1C1C] dark:text-[#E0E0E0] dark:bg-[#408485] px-3 py-1 rounded-full">
            Today
          </span>
        </div>

        {displayMessages.length > 0 ? (
          displayMessages.map((message) => (
            <div key={message.id} className="relative group">
              <MessageBubble text={message.text} isOwn={message.isOwn} />
              
              {/* Star button - shows on hover */}
              <button
                onClick={() => toggleStar(message.id)}
                className={`btn-hover absolute ${
                  message.isOwn ? "left-2" : "right-2"
                } top-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700`}
              >
                <Star
                  size={16}
                  className={`${
                    message.starred
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              </button>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p className="text-center text-sm">No messages</p>
          </div>
        )}
      </div>
    </div>
  );
}