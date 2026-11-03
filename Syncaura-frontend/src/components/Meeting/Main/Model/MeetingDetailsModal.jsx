import React, { useState } from "react";
import { X, Calendar, Clock, Video, Users, Link2, Copy, Check, ExternalLink, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MeetingDetailsModal({ meeting, onClose }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  if (!meeting) return null;

  const {
    title,
    startTime,
    endTime,
    platform = "Google Meet",
    googleMeetLink,
    google_meet_link,
    meet_link,
    participants = [],
    isDoc,
    description,
  } = meeting;

  const meetUrl = googleMeetLink || google_meet_link || meet_link;

  const startDate = startTime ? new Date(startTime) : null;
  const endDate = endTime ? new Date(endTime) : null;

  const formatDate = (date) =>
    date
      ? date.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  const formatTime = (date) =>
    date
      ? date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "";

  const timeString = startDate
    ? endDate
      ? `${formatTime(startDate)} - ${formatTime(endDate)}`
      : `${formatTime(startDate)}`
    : "N/A";

  const handleCopyLink = () => {
    if (!meetUrl) return;
    navigator.clipboard.writeText(meetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = () => {
    if (meetUrl) {
      window.open(meetUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 transition-opacity"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="
            bg-white dark:bg-[#1E1E1E]
            text-gray-900 dark:text-gray-100
            rounded-3xl p-6 sm:p-8
            w-full max-w-lg
            shadow-2xl border border-gray-200 dark:border-[#333]
            relative flex flex-col gap-5
            animate-in fade-in zoom-in-95 duration-200
            max-h-[90vh] overflow-y-auto
          "
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition"
          >
            <X className="size-5" />
          </button>

          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-[#73FBFD]">
                <Video className="size-3.5" />
                {platform}
              </span>
              {isDoc && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  <FileText className="size-3" />
                  {t("meeting_has_doc", "Documents")}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {title}
            </h2>

            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          <div className="h-px bg-gray-100 dark:bg-[#2E2F2F]" />

          {/* Details Section */}
          <div className="space-y-3.5 text-sm">
            {/* Date */}
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-[#2A2A2A] text-gray-600 dark:text-gray-300">
                <Calendar className="size-4" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Date</p>
                <p className="font-semibold text-gray-900 dark:text-white">{formatDate(startDate)}</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-[#2A2A2A] text-gray-600 dark:text-gray-300">
                <Clock className="size-4" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Time</p>
                <p className="font-semibold text-gray-900 dark:text-white">{timeString}</p>
              </div>
            </div>

            {/* Participants */}
            {participants && participants.length > 0 && (
              <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <div className="p-2 rounded-xl bg-gray-100 dark:bg-[#2A2A2A] text-gray-600 dark:text-gray-300 mt-0.5">
                  <Users className="size-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 font-medium mb-1">Participants ({participants.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {participants.map((p, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-[#2A2A2A] text-gray-800 dark:text-gray-200"
                      >
                        {typeof p === "string" ? p : p.email || p.name || `User ${idx + 1}`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Meet Link Box */}
            {meetUrl ? (
              <div className="mt-4 p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                <p className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-1.5 flex items-center gap-1.5">
                  <Link2 className="size-3.5 text-blue-600 dark:text-[#73FBFD]" />
                  Meeting Link
                </p>
                <div className="flex items-center justify-between gap-2 bg-white dark:bg-[#151515] px-3 py-2 rounded-xl border border-blue-200/60 dark:border-blue-900/40">
                  <span className="text-xs text-blue-700 dark:text-[#73FBFD] font-mono truncate">
                    {meetUrl}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    title="Copy Link"
                    className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-[#73FBFD] hover:bg-blue-50 dark:hover:bg-[#222] transition shrink-0"
                  >
                    {copied ? (
                      <span className="flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400 font-sans font-medium">
                        <Check className="size-3.5" /> Copied
                      </span>
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 p-3 rounded-xl bg-gray-50 dark:bg-[#252525] text-xs text-gray-500 dark:text-gray-400 text-center">
                No video conferencing link generated for this meeting.
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:bg-[#2E2F2F] mt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2E2F2F] transition btn-hover"
            >
              Close
            </button>
            {meetUrl && (
              <button
                onClick={handleJoin}
                className="px-6 py-2.5 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] dark:bg-[#73FBFD] dark:hover:bg-[#5feff2] text-white dark:text-black text-xs font-semibold shadow-md flex items-center gap-1.5 transition btn-hover"
              >
                <span>Join Meeting</span>
                <ExternalLink className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
