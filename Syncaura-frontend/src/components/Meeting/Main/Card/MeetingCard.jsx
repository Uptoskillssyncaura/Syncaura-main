import { ArrowRight } from "lucide-react";
import { TbBrandGoogleDrive } from "react-icons/tb";
import { useSelector } from "react-redux";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import MeetingDetailsModal from "../Model/MeetingDetailsModal";

function getMeetingStatus(startTime, endTime, t) {
  const now = new Date();
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : null;

  const isToday = start.toDateString() === now.toDateString();

  const isPast = end
    ? now > end
    : now > new Date(start.getTime() + 60 * 60 * 1000);

  const isLive = end
    ? isToday && now >= start && now <= end
    : isToday &&
      now >= start &&
      now <= new Date(start.getTime() + 60 * 60 * 1000);

  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);

  if (isPast) {
    return {
      key: "completed",
      label: t("meeting_status_completed", "COMPLETED"),
      textColor: "text-gray-500",
      bgColor: "bg-gray-100 dark:bg-[#2A2A2A]",
      dotColor: "bg-gray-400",
    };
  }

  if (isLive) {
    return {
      key: "live",
      label: t("meeting_status_live", "LIVE NOW"),
      textColor: "text-[#C71212] dark:text-[#FF6B6B]",
      bgColor: "bg-[#FBB7B7] dark:bg-[#5C1D1D]",
      dotColor: "bg-[#F35353]",
    };
  }

  if (isToday) {
    return {
      key: "today",
      label: t("meeting_status_today", "TODAY"),
      textColor: "text-[#2461E6] dark:text-[#73FBFD]",
      bgColor: "bg-[#D5F7F7] dark:bg-[#164E63]",
      dotColor: "bg-[#2461E6] dark:bg-[#73FBFD]",
    };
  }

  if (start.toDateString() === tomorrow.toDateString()) {
    return {
      key: "tomorrow",
      label: t("meeting_status_tomorrow", "TOMORROW"),
      textColor: "text-[#2461E6] dark:text-[#73FBFD]",
      bgColor: "bg-[#D5F7F7] dark:bg-[#164E63]",
      dotColor: "bg-[#2461E6] dark:bg-[#73FBFD]",
    };
  }

  return {
    key: "upcoming",
    label: start.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    }),
    textColor: "text-[#2461E6] dark:text-[#73FBFD]",
    bgColor: "bg-[#D5F7F7] dark:bg-[#164E63]",
    dotColor: "bg-[#2461E6] dark:bg-[#73FBFD]",
  };
}

function formatMeetingTime(startTime, endTime) {
  if (!startTime) return "";

  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : null;

  const formatDate = (date) =>
    date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (date) =>
    date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  if (!end) {
    return `${formatDate(start)} • ${formatTime(start)}`;
  }

  return `${formatDate(start)} • ${formatTime(start)} - ${formatTime(end)}`;
}

const MeetingCard = memo(function MeetingCard(props) {
  const {
    platform,
    title,
    startTime,
    endTime,
    avatarCount,
    isDoc,
    googleMeetLink,
    createdBy,
    currentUserId,
    onReschedule,
    onCancel,
  } = props;

  const { t } = useTranslation();

  const isDark = useSelector((state) => state.theme?.isDark);

  const authUser = useSelector(
    (state) =>
      state.auth?.user ||
      state.auth?.currentUser ||
      state.auth?.userInfo ||
      null
  );

  const [detailsOpen, setDetailsOpen] = useState(false);

  const status = getMeetingStatus(startTime, endTime, t);

  const MAX_VISIBLE = 3;

  const count =
    typeof avatarCount === "number" && avatarCount > 0 ? avatarCount : 1;

  const visibleAvatars = Math.min(count, MAX_VISIBLE);

  const extraCount =
    count > MAX_VISIBLE ? count - MAX_VISIBLE : 0;

  // --------------------------------------------------
  // Meeting status
  // --------------------------------------------------

  const now = new Date();
  const startDateTime = new Date(startTime);

  const isCompleted = status.key === "completed";
  const isLive = status.key === "live";
  const isUpcoming = startDateTime > now;

  // --------------------------------------------------
  // Creator checking
  // --------------------------------------------------

  const loggedInUserId =
    currentUserId ||
    authUser?._id ||
    authUser?.id ||
    authUser?.userId ||
    authUser?.user?._id ||
    authUser?.user?.id ||
    null;

  const creatorId =
    typeof createdBy === "object" && createdBy !== null
      ? createdBy._id || createdBy.id || createdBy.userId
      : createdBy;

  const isCreator =
    Boolean(loggedInUserId) &&
    Boolean(creatorId) &&
    String(loggedInUserId) === String(creatorId);

  // --------------------------------------------------
  // Reschedule / Cancel permissions
  // --------------------------------------------------

  const oneHourInMs = 60 * 60 * 1000;

  const timeUntilMeeting =
    startDateTime.getTime() - now.getTime();

  // Reschedule is allowed only if:
  // 1. Current user created the meeting
  // 2. Meeting is upcoming
  // 3. More than 1 hour remains before start
  const canReschedule =
    isCreator &&
    isUpcoming &&
    timeUntilMeeting > oneHourInMs;

  // Cancel is shown only for creator's upcoming meeting.
  const canCancel =
    isCreator &&
    isUpcoming;

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------

  const handleOpenDetails = (event) => {
    event?.stopPropagation();
    setDetailsOpen(true);
  };

  const handleJoinMeeting = (event) => {
    event?.stopPropagation();

    if (googleMeetLink) {
      window.open(
        googleMeetLink,
        "_blank",
        "noopener,noreferrer"
      );
    } else {
      setDetailsOpen(true);
    }
  };

  const handleReschedule = (event) => {
    event?.stopPropagation();

    if (!canReschedule) {
      return;
    }

    if (typeof onReschedule === "function") {
      onReschedule(props);
    }
  };

  const handleCancel = (event) => {
    event?.stopPropagation();

    if (!canCancel) {
      return;
    }

    if (typeof onCancel === "function") {
      onCancel(props);
    }
  };

  return (
    <>
      {/* ================= MOBILE CARD ================= */}

      <div
        onClick={handleOpenDetails}
        className="
          block sm:hidden
          w-full min-h-[153px]
          rounded-[20px]
          bg-white dark:bg-[#2E2F2F]
          shadow-[0px_0px_10px_3px_#D2D2D233]
          px-4 py-3
          flex flex-col
          justify-between
          cursor-pointer
        "
      >
        {/* Top Row */}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-black dark:text-[#F5F5F5] font-medium">
            <TbBrandGoogleDrive className="size-3.5 text-blue-600 dark:text-[#73FBFD]" />

            <span>{platform || "Google Meet"}</span>
          </div>

          <span
            className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${status.textColor} ${status.bgColor}`}
          >
            <span
              className={`size-1.5 rounded-full ${status.dotColor}`}
            />

            {status.label}
          </span>
        </div>

        {/* Title + Time */}

        <div className="flex flex-col gap-1 my-2">
          <h3 className="font-semibold text-sm leading-tight text-gray-900 dark:text-[#F5F5F5] line-clamp-1">
            {title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-[#BDBDBD]">
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

            <p className="whitespace-nowrap">
              {formatMeetingTime(startTime, endTime)}
            </p>
          </div>
        </div>

        {/* Avatars */}

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center -space-x-2">
            {Array.from({
              length: visibleAvatars,
            }).map((_, i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/40?img=${
                  (i % 10) + 1
                }`}
                className="size-6 rounded-full border border-white dark:border-[#2E2F2F] object-cover"
                alt={`Avatar ${i + 1}`}
              />
            ))}

            {extraCount > 0 && (
              <span className="size-6 text-[10px] font-semibold flex items-center justify-center text-black bg-[#E0DDDD] rounded-full border border-white z-10">
                +{extraCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isDoc && (
              <img
                src={
                  isDark
                    ? "/images/Meeting/dark/document.png"
                    : "/images/Meeting/document.png"
                }
                className="size-4"
                alt="document"
              />
            )}

            {isLive ? (
              <button
                type="button"
                onClick={handleJoinMeeting}
                className="btn-hover px-3 py-1.5 rounded-full flex items-center justify-center text-xs font-semibold shadow-md bg-blue-600 hover:bg-blue-700 dark:bg-[#73FBFD] dark:text-[#2E2F2F] text-white min-w-[90px]"
              >
                {t("meeting_join_now", "Join Now")}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenDetails}
                className="btn-hover px-3 py-1.5 rounded-full flex items-center justify-center gap-1 text-xs font-semibold shadow-sm bg-gray-100 hover:bg-gray-200 dark:bg-[#3E3E3E] dark:hover:bg-[#4E4E4E] text-gray-700 dark:text-[#73FBFD] min-w-[90px]"
              >
                <span>
                  {t("meeting_details", "Details")}
                </span>

                <ArrowRight className="size-3" />
              </button>
            )}
          </div>
        </div>

        {/* Creator Actions - Mobile */}

        {(canReschedule || canCancel) && (
          <div
            className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-[#444]"
            onClick={(event) => event.stopPropagation()}
          >
            {canReschedule && (
              <button
                type="button"
                onClick={handleReschedule}
                className="
                  btn-hover
                  flex-1
                  px-3 py-1.5
                  rounded-full
                  text-xs font-semibold
                  bg-blue-50
                  text-blue-600
                  hover:bg-blue-100
                  dark:bg-[#164E63]
                  dark:text-[#73FBFD]
                  dark:hover:bg-[#1c6077]
                  transition
                "
              >
                Reschedule
              </button>
            )}

            {canCancel && (
              <button
                type="button"
                onClick={handleCancel}
                className="
                  btn-hover
                  flex-1
                  px-3 py-1.5
                  rounded-full
                  text-xs font-semibold
                  bg-red-50
                  text-red-600
                  hover:bg-red-100
                  dark:bg-[#5C1D1D]
                  dark:text-[#FF8A8A]
                  dark:hover:bg-[#702323]
                  transition
                "
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>

      {/* ================= DESKTOP CARD ================= */}

      <div
        onClick={handleOpenDetails}
        className="
          hidden sm:flex
          flex-col
          justify-between
          w-full
          min-h-[280px]
          bg-white
          dark:bg-[#2F2F2F]
          rounded-[24px]
          border border-[#ECECEC]
          dark:border-[#3B3B3B]
          shadow-[0_4px_12px_rgba(0,0,0,0.08)]
          dark:shadow-[0_0_25px_rgba(115,251,253,0.18)]
          p-5
          transition-all duration-200
          cursor-pointer
          hover:scale-[1.01]
        "
      >
        {/* Top */}

        <div className="flex items-center justify-between">
          <span
            className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full ${status.textColor} ${status.bgColor}`}
          >
            <span
              className={`size-2 rounded-full ${status.dotColor}`}
            />

            {status.label}
          </span>

          <div className="flex items-center gap-1.5 text-xs text-[#4b5563] dark:text-gray-300 font-medium">
            <TbBrandGoogleDrive className="size-4 text-blue-600 dark:text-[#73FBFD]" />

            <span>{platform || "Google Meet"}</span>
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

            <p className="text-xs text-[#6b7280] dark:text-[#d1d5db]">
              {formatMeetingTime(startTime, endTime)}
            </p>
          </div>
        </div>

        {/* Avatars */}

        <div className="flex items-center mt-2">
          <div className="flex -space-x-2">
            {Array.from({
              length: visibleAvatars,
            }).map((_, i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/40?img=${
                  (i % 10) + 1
                }`}
                className="w-7 h-7 rounded-full border-2 border-white dark:border-[#2F2F2F] object-cover"
                alt={`Avatar ${i + 1}`}
              />
            ))}
          </div>

          {extraCount > 0 && (
            <div className="w-7 h-7 rounded-full bg-[#E5E7EB] dark:bg-[#444] text-gray-700 dark:text-gray-200 flex items-center justify-center text-[10px] font-semibold ml-1">
              +{extraCount}
            </div>
          )}
        </div>

        {/* Divider */}

        <div className="border-t border-[#ececec] dark:border-[#3a3a3a] my-3" />

        {/* Main Bottom Row */}

        <div className="flex items-center justify-between">
          {isCompleted ? (
            <button
              type="button"
              disabled
              className="min-w-[105px] h-[34px] rounded-full flex items-center justify-center gap-2 text-xs font-medium bg-[#d1d5db] text-[#6b7280] cursor-not-allowed"
            >
              {t("meeting_completed", "Completed")}
            </button>
          ) : isLive ? (
            <button
              type="button"
              onClick={handleJoinMeeting}
              className="
                btn-hover
                min-w-[105px]
                h-[34px]
                rounded-full
                flex items-center
                justify-center
                text-xs
                font-medium
                bg-[#2563EB]
                text-white
                hover:bg-[#1D4ED8]
                dark:bg-[#73FBFD]
                dark:text-[#1E1E1E]
                dark:hover:bg-[#5feff2]
                transition
              "
            >
              {t("meeting_join_now", "Join Now")}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenDetails}
              className="
                btn-hover
                min-w-[105px]
                h-[34px]
                rounded-full
                flex items-center
                justify-center
                gap-2
                text-xs
                font-medium
                bg-[#E5E7EB]
                dark:bg-[#3A3A3A]
                text-[#4B5563]
                dark:text-[#73FBFD]
                hover:bg-[#D1D5DB]
                dark:hover:bg-[#4A4A4A]
                transition
              "
            >
              <ArrowRight className="size-4" />

              <span>
                {t("meeting_details", "Details")}
              </span>
            </button>
          )}

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

        {/* Creator Actions - Desktop */}

        {(canReschedule || canCancel) && (
          <div
            className="flex items-center gap-2 mt-3"
            onClick={(event) => event.stopPropagation()}
          >
            {canReschedule && (
              <button
                type="button"
                onClick={handleReschedule}
                className="
                  btn-hover
                  flex-1
                  h-[34px]
                  rounded-full
                  flex items-center
                  justify-center
                  text-xs
                  font-semibold
                  bg-blue-50
                  text-blue-600
                  hover:bg-blue-100
                  dark:bg-[#164E63]
                  dark:text-[#73FBFD]
                  dark:hover:bg-[#1c6077]
                  transition
                "
              >
                Reschedule
              </button>
            )}

            {canCancel && (
              <button
                type="button"
                onClick={handleCancel}
                className="
                  btn-hover
                  flex-1
                  h-[34px]
                  rounded-full
                  flex items-center
                  justify-center
                  text-xs
                  font-semibold
                  bg-red-50
                  text-red-600
                  hover:bg-red-100
                  dark:bg-[#5C1D1D]
                  dark:text-[#FF8A8A]
                  dark:hover:bg-[#702323]
                  transition
                "
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>

      {/* ================= DETAILS MODAL ================= */}

      {detailsOpen && (
        <MeetingDetailsModal
          meeting={props}
          onClose={() => setDetailsOpen(false)}
        />
      )}
    </>
  );
});

export default MeetingCard;