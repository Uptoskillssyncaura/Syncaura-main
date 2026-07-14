import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import { Paperclip, Smile } from "lucide-react";
import { useRef, useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import api from "../../config/axios";

export default function ChatInput() {
  const [text, setText] = useState("");
  const fileRef = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);

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
    <div className="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2 relative bottom-2 left-0">
      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-16 left-2 md:left-4 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} theme="auto" />
        </div>
      )}

      <div className="bg-[#FFFFFF] dark:bg-[#000000] grid grid-cols-20 border border-[#989696] dark:border-[#535353] rounded-2xl px-3 py-2 w-full">
        {/* Emoji Button */}
        <div className="flex items-center justify-center col-span-1 cursor-pointer">
          <Smile
            className="size-6 text-gray-500 dark:text-gray-400"
            onClick={() => setShowEmoji((prev) => !prev)}
          />
        </div>

        {/* Input */}
        <div className="flex items-center justify-center col-span-18">
          <input
            value={text}
            onClick={() => setShowEmoji(false)}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message"
            className="w-full text-[#656464] placeholder:text-[#656464] dark:text-gray-200 dark:placeholder:text-gray-200 rounded-full px-2 md:px-4 py-2 outline-none text-sm bg-transparent"
          />
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          className="hidden"
          ref={fileRef}
          onChange={handleFile}
        />

        {/* Upload Button */}
        <div className="flex items-center justify-center col-span-1 cursor-pointer">
          <Paperclip
            className={`size-6 ${
              uploading
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={handleFileOpen}
          />
        </div>
      </div>

      {/* Mic Button */}
      <button
        className="bg-blue-600 dark:bg-[#73FBFD] p-3 md:p-4 rounded-full btn-hover"
        disabled={uploading}
      >
        {uploading ? (
          <span className="text-white text-sm">...</span>
        ) : (
          <FaMicrophone className="size-5 md:size-6 dark:fill-black fill-white" />
        )}
      </button>
    </div>
  );
}
