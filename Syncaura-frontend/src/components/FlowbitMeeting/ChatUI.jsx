import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizonal } from "lucide-react";

const ChatUI = ({ chatMessages, setChatMessages }) => {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Auto scroll to bottom
  const scrollToBottom = (smooth = true) => {
    bottomRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  // Scroll when new message added
  useEffect(() => {
    scrollToBottom(true);
  }, [chatMessages]);

  // Scroll to bottom when component first mounts
  useEffect(() => {
    scrollToBottom(false);
  }, []);

  // Auto resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [input]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      message: input.trim(),
      isMe: true,
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setInput("");

    // fake reply after 1 sec
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          message: "Got it dude",
          isMe: false,
        },
      ]);
    }, 1000);
  };

  // Handle Enter & Shift+Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Messages Container */}
      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col min-h-full justify-end">
          <AnimatePresence initial={false}>
            {chatMessages.map((msg) => (
              <motion.div
  key={msg.id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25 }}
  className={`max-w-[75%] mb-3 px-4 py-2 rounded-2xl text-sm shadow 
whitespace-pre-wrap break-words break-all
${
  msg.isMe
    ? "ml-auto bg-blue-500 text-white dark:bg-[#73FBFD] dark:text-[#000000] rounded-br-md"
    : "mr-auto bg-gray-200 dark:bg-[#2E2F2F] dark:text-[#F8F8F8] text-gray-800 rounded-bl-md"
}`}

>
  {msg.message}
</motion.div>

            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3">
        <div
          className={`flex items-end w-full py-1 px-2 xl:px-4 xl:py-2
          gap-3 xl:gap-5 rounded-lg border
          transition-all duration-200
          ${
            isFocused
              ? "border-blue-500 ring-2 ring-blue-200"
              : "border-[#989696]"
          }`}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Send a Message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="text-lg w-full resize-none max-h-32 overflow-y-auto
              placeholder:text-[#989696]
              text-[#989696] font-normal
              border-none outline-none bg-transparent"
          />

          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className={`btn-hover transition duration-200 ${
              input.trim()
                ? "text-blue-500 hover:scale-110"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            <SendHorizonal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
