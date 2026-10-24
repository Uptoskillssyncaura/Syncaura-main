
export default function MessageBubble({ message, isOwn }) {
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return timeString; // Return as is if already formatted
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const time = formatTime(message?.created_at || message?.timestamp);
  const isImage = message?.file_url && /\.(jpg|jpeg|png|gif|webp)$/i.test(message.file_url);

  return (
    <div className={`flex mb-1.5 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative inline-block max-w-[85%] md:max-w-[75%] px-3 pt-2 pb-2 rounded-2xl text-[15px] leading-snug shadow-sm ${
          isOwn
            ? "bg-[#BFDBFE] dark:bg-[#1E3A8A] text-[#111b21] dark:text-[#e9edef] rounded-tr-sm"
            : "bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-tl-sm"
        }`}
      >
        {!isOwn && message?.sender_name && (
          <div className="text-xs font-semibold text-blue-600 dark:text-[#73FBFD] mb-1">
            {message.sender_name}
          </div>
        )}

        {message?.file_url && (
          <div className="mb-1.5">
            {isImage ? (
              <img
                src={message.file_url}
                alt="Attachment"
                className="max-h-60 rounded-lg object-contain bg-black/5 dark:bg-white/5 cursor-pointer hover:opacity-95"
                onClick={() => window.open(message.file_url, "_blank")}
              />
            ) : (
              <a
                href={message.file_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-[#73FBFD] underline py-1"
              >
                📎 Attachment
              </a>
            )}
          </div>
        )}

        {message?.text && (
          <span style={{ wordBreak: 'break-word' }} className="font-medium text-[15px] md:text-base">
            {message.text}
          </span>
        )}
        
        <span className="float-right text-[10px] text-gray-500 dark:text-gray-300/80 mt-2 ml-3">
          {time}
        </span>
      </div>
    </div>
  );
}