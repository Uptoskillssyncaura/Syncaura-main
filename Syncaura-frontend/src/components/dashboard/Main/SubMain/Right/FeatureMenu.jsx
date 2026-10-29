import {
  FiClipboard,
  FiAlignLeft,
  FiClock,
  FiUserPlus,
  FiMessageSquare,
  FiCloud,
} from "react-icons/fi";

export default function FeatureMenu() {
  const items = [
    { icon: <FiClipboard />, label: "Project" },
    { icon: <FiAlignLeft />, label: "Stages" },
    { icon: <FiClock />, label: "Task" },
    { icon: <FiUserPlus />, label: "Member" },
    { icon: <FiMessageSquare />, label: "Message" },
    { icon: <FiCloud />, label: "File" },
  ];

  return (
    <div
      className="
        w-full
        bg-[#FFFFFF]
        dark:bg-[#24262B]

        rounded-[22px]

        px-14 py-6

        flex items-center justify-between

        shadow-[8px_8px_20px_rgba(0,0,0,0.1),-8px_-8px_20px_rgba(255,255,255,0.7)]
        dark:shadow-none
      "
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <span
            className="
              text-[22px]
              text-[#8A92A6]
              group-hover:text-[#6D6FE3]
              transition-all
            "
          >
            {item.icon}
          </span>

          <span
            className="
              text-[14px]
              font-normal
              text-[#4A5874]
              group-hover:text-[#6D6FE3]
              transition-all
            "
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
