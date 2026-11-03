
export default function MessageBubble({ message, isOwn }) {
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return timeString; // Return as is if already formatted
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const time = formatTime(message?.created_at || message?.timestamp);

  return (
    <div className={`flex mb-1 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative inline-block max-w-[85%] md:max-w-[75%] px-3 pt-1.5 pb-2 rounded-2xl text-[15px] leading-snug shadow-sm ${
          isOwn
            ? "bg-[#BFDBFE] dark:bg-[#1E3A8A] text-[#111b21] dark:text-[#e9edef] rounded-tr-sm"
            : "bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-tl-sm"
        }`}
      >
        <span style={{ wordBreak: 'break-word' }} className="font-medium text-[15px] md:text-base">{message?.text}</span>
        
        <span className="float-right text-[10px] text-gray-500 dark:text-gray-300/80 mt-2 ml-3">
          {time}
        </span>
      </div>
    </div>
  );
}