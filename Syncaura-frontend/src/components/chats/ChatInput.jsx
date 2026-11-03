import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import { Paperclip, Smile, Send } from "lucide-react";
import { useRef, useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import api from "../../config/axios";

export default function ChatInput({ sendMessageText, sendTyping }) {
  const [text, setText] = useState("");
  const fileRef = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    if (sendTyping) {
      sendTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => sendTyping(false), 2000);
    }
  };

  const handleSend = () => {
    if (text.trim() && sendMessageText) {
      sendMessageText(text);
      setText("");
      if (sendTyping) sendTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileOpen = () => {
    if (!uploading) fileRef.current.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ File size check (5MB)
    const MAX_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      toast.error("File is too large. Max size is 5MB.");
      fileRef.current.value = "";
      return;
    }

    // ✅ File type validation
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Unsupported file type.");
      fileRef.current.value = "";
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
        },
      });

      console.log("Upload success:", res.data);
      toast.success("File uploaded successfully ✅");
    } catch (err) {
      console.error("Upload error:", err);

      // ❌ Removed fake success — now real error only
      if (!err.response) {
        toast.error("Backend not reachable. Please start your server.");
      } else {
        const msg =
          err.response?.data?.message ||
          err.response?.statusText ||
          "Upload failed";
        toast.error(msg);
      }
    } finally {
      setUploading(false);
      fileRef.current.value = "";
    }
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="flex-shrink-0 bg-[#F0F2F5] dark:bg-[#202C33] flex items-center gap-2 px-2 md:px-4 py-3 relative">
      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-16 left-2 md:left-4 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} theme="auto" />
        </div>
      )}

      <div className="bg-[#FFFFFF] dark:bg-[#2A3942] flex flex-1 items-center rounded-full px-3 py-1 md:py-2">
        {/* Emoji Button */}
        <button className="flex-shrink-0 p-2 cursor-pointer btn-hover rounded-full">
          <Smile
            className="size-6 text-[#54656F] dark:text-[#8696A0]"
            onClick={() => setShowEmoji((prev) => !prev)}
          />
        </button>

        {/* Hidden File Input */}
        <input
          type="file"
          className="hidden"
          ref={fileRef}
          onChange={handleFile}
        />

        {/* Upload Button */}
        <button
          className="flex-shrink-0 p-2 cursor-pointer btn-hover rounded-full"
          disabled={uploading}
        >
          <Paperclip
            className={`size-6 ${
              uploading
                ? "text-gray-300 cursor-not-allowed"
                : "text-[#54656F] dark:text-[#8696A0]"
            }`}
            onClick={handleFileOpen}
          />
        </button>

        {/* Input */}
        <input
          value={text}
          onClick={() => setShowEmoji(false)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
          className="w-full text-[#111B21] placeholder:text-[#8696A0] dark:text-[#E9EDEF] dark:placeholder:text-[#8696A0] px-2 outline-none text-[15px] bg-transparent"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Send Button */}
        <button
          onMouseDown={(e) => { e.preventDefault(); handleSend(); }}
          onTouchStart={(e) => { e.preventDefault(); handleSend(); }}
          className="bg-[#007AFF] p-3 md:p-3.5 rounded-full btn-hover flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
          disabled={uploading || !text.trim()}
        >
          <Send className="size-5 text-white ml-0.5" />
        </button>

        {/* Mic Button */}
        <button
          className="bg-[#007AFF] p-3 md:p-3.5 rounded-full btn-hover flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
          disabled={uploading}
        >
          {uploading ? (
            <span className="text-white text-sm">...</span>
          ) : (
            <FaMicrophone className="size-5 fill-white" />
          )}
        </button>
      </div>
    </div>
  );
}
