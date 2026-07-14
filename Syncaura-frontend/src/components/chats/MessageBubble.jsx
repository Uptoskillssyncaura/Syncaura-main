export default function MessageBubble({ text, isOwn }) {
  return (
    <div className={`flex mb-3 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] sm:max-w-sm md:max-w-md lg:max-w-lg px-3 md:px-4 py-2 rounded-2xl text-sm md:text-base break-words ${
          isOwn
            ? "bg-[#2457C5] dark:bg-[#73FBFD] text-white dark:text-black rounded-br-sm"
            : "bg-white dark:bg-[#424242] text-black dark:text-white rounded-bl-sm"
        }`}
      >
        {text}
      </div>
    </div>
  );
}