import { Video, Camera, Monitor, ArrowRight } from "lucide-react";
import { TbBrandGoogleDrive, TbBrandTeams } from "react-icons/tb";
import { useSelector } from "react-redux";
import { memo } from "react";

function getMeetingStatus(startTime, endTime) {
  const now = new Date();
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : null;

  const isToday = start.toDateString() === now.toDateString();
  const isPast = end ? now > end : now > start;

  const isLive =
    isToday && end && now >= start && now <= end;

  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);

  if (isPast) {
    return {
      label: "COMPLETED",
      textColor: "text-gray-500",
      bgColor: "bg-gray-100",
      dotColor: "bg-gray-400",
    };
  }

  if (isLive) {
    return {
      label: "LIVE NOW",
      textColor: "text-[#C71212]",
      bgColor: "bg-[#FBB7B7]",
      dotColor: "bg-[#F35353]",
    };
  }

  if (isToday) {
    return {
      label: "TODAY",
      textColor: "text-[#2461E6]",
      bgColor: "bg-[#D5F7F7]",
      dotColor: "bg-[#2461E6]",
    };
  }

  if (start.toDateString() === tomorrow.toDateString()) {
    return {
      label: "TOMORROW",
      textColor: "text-[#2461E6]",
      bgColor: "bg-[#D5F7F7]",
      dotColor: "bg-[#2461E6]",
    };
  }

  return {
    label: start.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    }),
    textColor: "text-[#2461E6]",
    bgColor: "bg-[#D5F7F7]",
    dotColor: "bg-[#2461E6]",
  };
}

function formatMeetingTime(startTime, endTime) {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : null;

  const format = (date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (!end) return format(start);

  return `${format(start)} - ${format(end)}`;
}

const MeetingCard = memo(function MeetingCard({
  platform,
  title,
  startTime,
  endTime,
  avatarCount,
  isDoc
}) {
  const isDark = useSelector((state) => state.theme.isDark);
  const status = getMeetingStatus(startTime, endTime);

  const MAX_VISIBLE = 3;
  const visibleAvatars = Math.min(avatarCount, MAX_VISIBLE);
  const extraCount = avatarCount > MAX_VISIBLE ? avatarCount - MAX_VISIBLE : 0;

  const isCompleted = status.label === "COMPLETED";
  const now = new Date();
  const startDateTime = new Date(startTime);
  const isUpcoming = startDateTime > now;

  return (
    <>
      {/* Mobile-only card (hidden on sm and above) - UPDATED with button below icons */}
      <div className="
        block sm:hidden
        w-[350px] h-[153px]
        rounded-[20px]
        bg-white dark:bg-[#2E2F2F]
        shadow-[0px_0px_10px_3px_#D2D2D233]
        px-4 py-3
        flex flex-col
        justify-between
      ">
        {/* Top Row: Platform + Status - POSITIONS SWAPPED (ONLY IN MOBILE) */}
        <div className="flex items-center justify-between">
          {/* Platform moved to LEFT (MOBILE ONLY) */}
          <div className="flex items-center gap-1 text-xs text-black dark:text-[#F5F5F5]">
            {platform === "Zoom" ? (
              <Video className="size-3.5" />
            ) : platform === "Google Meet" ? (
              <TbBrandGoogleDrive className="size-3.5" />
            ) : (
              <TbBrandTeams className="size-3.5" />
            )}
            {platform === "Google Meet" ? "Meet" : platform}
          </div>

          {/* Status moved to RIGHT (MOBILE ONLY) */}
          <span
            className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full
              ${status.textColor} ${status.bgColor}`}
          >
            <span className={`size-1.5 rounded-full ${status.dotColor}`} />
            {status.label}
          </span>
        </div>

        {/* Middle Row: Title + Time */}
        <div className="flex flex-col gap-1">
          <h3 className="
            font-semibold
            text-sm
            leading-tight
            text-gray-900 dark:text-[#F5F5F5]
            line-clamp-1
          ">
            {title}
          </h3>

          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-[#F5F5F5]">
            <span className="size-3 flex items-center justify-center">
              <img
                src={
                  isDark
                    ? "/images/Meeting/dark/clock.png"
                    : "/images/Meeting/clock.png"
                }
                alt="clock"
                className="w-full h-full object-contain"
              />
            </span>
            <p className="whitespace-nowrap">{formatMeetingTime(startTime, endTime)}</p>
          </div>
        </div>

        {/* Bottom Row: Modified to place button below icons */}
        <div className="flex items-start justify-between">
          {/* Avatars - stays on left */}
          <div className="flex items-center -space-x-4 pt-1">
            <div className="flex -space-x-2">
              {Array.from({ length: visibleAvatars }).map((_, i) => (
                <img
                  key={i}
                  src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"
                  className="size-6 rounded-full border border-white"
                  alt={`Avatar ${i + 1}`}
                />
              ))}
            </div>

            {extraCount > 0 && (
              <span className="
                size-6
                text-[10px]
                font-semibold
                flex items-center justify-center
                text-black bg-[#E0DDDD]
                rounded-full border border-white
                z-10
              ">
                +{extraCount}
              </span>
            )}
          </div>

          {/* Right side: Icons with button below */}
          <div className="flex flex-col items-end gap-1">
            {/* Icons row */}
            <div className="flex items-center gap-2">
              <img
                src={
                  isDark
                    ? "/images/Meeting/dark/user.png"
                    : "/images/Meeting/user.png"
                }
                className={isDark ? "h-4 w-5" : "size-4"}
                alt="user"
              />
              {isDoc && <img
                src={
                  isDark
                    ? "/images/Meeting/dark/document.png"
                    : "/images/Meeting/document.png"
                }
                className="size-4"
                alt="document"
              />}
            </div>

            {/* Button below icons */}
            <button
              disabled={isCompleted}
              className={`btn-hover px-3 py-1.5 rounded-full flex items-center justify-center text-xs font-semibold shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] transition min-w-[100px] ${isCompleted
                  ? "bg-red-500 dark:bg-[#1E293B] dark:text-[#94A3B8] text-yellow-300 cursor-not-allowed"
                  : isUpcoming
                    ? "bg-[#D9D9D9] dark:bg-[#5e5c5c] dark:text-[#73FBFD] text-gray-700 cursor-pointer"
                    : "bg-blue-600 hover:bg-blue-700 dark:bg-[#73FBFD] dark:text-[#2E2F2F] text-white"
                } `}
            >
              {isCompleted
                ? "Completed"
                : isUpcoming
                  ? <div className="flex items-center justify-center gap-1">
                    <ArrowRight className="size-3 dark:text-[#73FBFD]" />
                    <span className="whitespace-nowrap">Details</span>
                  </div>
                  : "Join Now"}
            </button>
          </div>
        </div>
      </div>

     {/* Desktop Card */}
{/* Desktop Card */}
<div
  className="
    hidden sm:flex
    flex-col
    justify-between
    w-[300px]
    h-[290px]
    bg-white
    dark:bg-[#2F2F2F]
    rounded-[28px]
    border border-[#ECECEC]
    dark:border-[#3B3B3B]
    shadow-[0_4px_12px_rgba(0,0,0,0.08)]
dark:shadow-[0_0_25px_rgba(115,251,253,0.18)]
    p-4
    transition-all duration-200
  "
>
  {/* Top */}
  <div className="flex items-center justify-between">
    <span
      className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${status.textColor} ${status.bgColor}`}
    >
      <span className={`size-2 rounded-full ${status.dotColor}`} />
      {status.label}
    </span>

    <div className="flex items-center gap-1 text-xs text-[#4b5563] dark:text-white">
      {platform === "Zoom" ? (
        <Video className="size-4" />
      ) : platform === "Google Meet" ? (
        <TbBrandGoogleDrive className="size-4" />
      ) : (
        <TbBrandTeams className="size-4" />
      )}
      <span>{platform === "Google Meet" ? "Meet" : platform}</span>
    </div>
  </div>

  {/* Title */}
  <div className="mt-4 min-h-[80px]">
    <h3 className="text-[15px] font-semibold text-[#111827] dark:text-white line-clamp-2">
      {title}
    </h3>

    <div className="flex items-center gap-2 mt-3">
      <img
        src={
          isDark
            ? "/images/Meeting/dark/clock.png"
            : "/images/Meeting/clock.png"
        }
        alt="clock"
        className="size-4"
      />

      <p className="text-sm text-[#6b7280] dark:text-[#d1d5db]">
        {formatMeetingTime(startTime, endTime)}
      </p>
    </div>
  </div>

  {/* Avatars */}
  <div className="flex items-center mt-4">
    <div className="flex -space-x-2">
      {Array.from({ length: visibleAvatars }).map((_, i) => (
        <img
          key={i}
          src={`https://i.pravatar.cc/40?img=${i + 1}`}
          className="w-7 h-7 rounded-full border-2 border-white object-cover"
          alt="avatar"
        />
      ))}
    </div>

    {extraCount > 0 && (
      <div className="w-7 h-7 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[10px] font-semibold ml-1">
        +{extraCount}
      </div>
    )}
  </div>

  {/* Divider */}
  <div className="border-t border-[#ececec] dark:border-[#3a3a3a] my-3" />

  {/* Bottom */}
  <div className="flex items-center justify-between">
    <button
      disabled={isCompleted}
      className={`btn-hover min-w-[105px] h-[34px] rounded-full flex items-center justify-center gap-2 text-xs font-medium transition ${
          isCompleted
            ? "bg-[#d1d5db] text-[#6b7280]"
            : isUpcoming
            ? "bg-[#E5E7EB] dark:bg-[#3A3A3A] text-[#4B5563] dark:text-[#73FBFD]"
            : isDark
            ? "bg-[#73FBFD] text-[#1E1E1E] hover:bg-[#5feff2]"
            : "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
        } `}
    >
      {isCompleted ? (
        "Completed"
      ) : isUpcoming ? (
        <>
          <ArrowRight className="size-4 text-[#4B5563] dark:text-[#73FBFD]" />
          <span className="text-[#4B5563] dark:text-[#73FBFD]">
            Details
          </span>
        </>
      ) : (
        "Join Now"
      )}
    </button>

    <div className="flex items-center gap-3">
      <img
        src={
          isDark
            ? "/images/Meeting/dark/user.png"
            : "/images/Meeting/user.png"
        }
        className="size-5"
        alt="user"
      />

      {isDoc && (
        <img
          src={
            isDark
              ? "/images/Meeting/dark/document.png"
              : "/images/Meeting/document.png"
          }
          className="size-5"
          alt="document"
        />
      )}
    </div>
  </div>
</div>
    </>
  );
});

export default MeetingCard;
