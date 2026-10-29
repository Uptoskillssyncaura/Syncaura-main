import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FileUploadBox from "../FileHandle/FileUploadBox";
import { useTranslation } from "react-i18next";
import { TbBrandGoogleDrive } from "react-icons/tb";

export default function ScheduleMeetingModal({ onClose, onSave, creatorId }) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      title: "",
      date: "",
      start: "",
      end: "",
      platform: "Google Meet",
      autoLink: true,
      participants: "",
      autoMembers: true,
      document: null,
      isDoc: false,
    },
  });

  const platform = watch("platform");
  const autoLink = watch("autoLink");
  const autoMembers = watch("autoMembers");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const onSubmit = async (data) => {
    const now = new Date();

    if (!data.date || !data.start) {
      alert("Please select both Date and Start Time.");
      return;
    }

    const [year, month, day] = data.date.split("-").map(Number);
    const selectedDate = new Date(year, month - 1, day, 0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert(t('schedule_date_error', 'Date must be today or a future date'));
      return;
    }

    const [startHour, startMin] = (data.start || "00:00").split(":").map(Number);
    const startDateTime = new Date(year, month - 1, day, startHour, startMin, 0, 0);

    // If today, check start time with a small 5 min grace window
    if (selectedDate.getTime() === today.getTime()) {
      const fiveMinsAgo = new Date(now.getTime() - 5 * 60 * 1000);
      if (startDateTime < fiveMinsAgo) {
        alert(t('schedule_start_error', 'Start time must be later than current time'));
        return;
      }
    }

    // If end time is provided, validate it's after start time
    if (data.end) {
      const [endHour, endMin] = data.end.split(":").map(Number);
      const endDateTime = new Date(year, month - 1, day, endHour, endMin, 0, 0);
      if (endDateTime <= startDateTime) {
        alert(t('schedule_end_error', 'End time must be after start time'));
        return;
      }
    }

    const startTimeStr = `${data.date}T${data.start}:00`;
    const endTimeStr = data.end ? `${data.date}T${data.end}:00` : null;

    const participantsList = data.participants
      ? data.participants.split(",").map((p) => p.trim()).filter(Boolean)
      : [];

    try {
      setIsSubmitting(true);
      await onSave({
        platform: data.platform || "Google Meet",
        title: data.title,
        startTime: startTimeStr,
        start_time: startTimeStr,
        endTime: endTimeStr,
        end_time: endTimeStr,
        participants: participantsList,
        avatarCount: participantsList.length || 1,
        isDoc: data.isDoc || false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm z-40"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-0">
        <div
          className="
            bg-[#EDEDED] dark:bg-[#1E1E1E]
            rounded-3xl sm:rounded-[40px]
            p-4 sm:p-6 xl:p-10
            w-full sm:w-[90vw] md:w-[760px]
            max-h-[90vh] overflow-y-auto
            relative flex flex-col
            shadow-2xl border border-gray-200 dark:border-[#333]
          "
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-7 sm:right-7 btn-hover p-1 rounded-full text-black dark:text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <X className="size-6 sm:size-8" />
          </button>

          <h2 className="text-xl sm:text-[28px] font-semibold mb-4 text-black dark:text-white">
            {t('schedule_title', 'Schedule New Meeting')}
          </h2>

          <div className="w-full h-px bg-[#C7C5C5] dark:bg-[#3E3E3E]" />

          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-col gap-5 mt-4">

              {/* Title */}
              <div>
                <label className="block text-sm sm:text-lg font-medium mb-2 text-black dark:text-white">
                  {t('schedule_meeting_title_label', 'Meeting Title')}
                </label>
                <input
                  {...register("title", { required: true })}
                  placeholder={t('schedule_meeting_title_placeholder', 'eg: Team Weekly Sync')}
                  className="w-full h-11 rounded-full px-4
                  bg-white text-[#333] dark:bg-[#2E2F2F]
                  dark:text-gray-200 outline-none border border-transparent focus:border-[#2461E6] dark:focus:border-[#73FBFD]"
                />
              </div>

              {/* Date & Time */}
              <div className="flex flex-col sm:flex-row gap-4">
                {[
                  { type: "date", name: "date", label: t('schedule_date_label', 'Date'), required: true },
                  { type: "time", name: "start", label: t('schedule_start_time_label', 'Start Time'), required: true },
                  { type: "time", name: "end", label: t('schedule_end_time_label', 'End Time (Optional)'), required: false },
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col gap-1">
                    <label className="text-sm font-medium text-black dark:text-white">
                      {item.label}
                    </label>
                    <input
                      type={item.type}
                      {...register(item.name, { required: item.required })}
                      className="
                        w-full h-11 rounded-full
                        px-4
                        bg-white dark:bg-[#2E2F2F]
                        text-[#333] dark:text-gray-200
                        outline-none border border-transparent
                        focus:border-[#2461E6] dark:focus:border-[#73FBFD]
                      "
                    />
                  </div>
                ))}
              </div>

              {/* Platform */}
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-2">
                  <label className="text-sm font-medium text-black dark:text-white">
                    {t('schedule_platform_label', 'Platform')}
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={autoLink}
                      onChange={(e) => setValue("autoLink", e.target.checked)}
                      className="hidden"
                    />
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${autoLink
                          ? "bg-[#2461E6] border-[#2461E6] dark:bg-[#73FBFD] dark:border-[#73FBFD]"
                          : "bg-white border-gray-400"
                        }`}
                    >
                      {autoLink && (
                        <svg
                          className="w-3 h-3 text-white dark:text-black"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span className="text-black dark:text-white">
                      {t('schedule_auto_link_label', 'Auto-generate Google Meet link')}
                    </span>
                  </label>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-5 h-11 rounded-full text-sm font-medium border-2 border-[#2461E6] text-[#2461E6] bg-white dark:border-[#73FBFD] dark:text-[#73FBFD] dark:bg-[#2E2F2F]">
                    <TbBrandGoogleDrive className="size-4" />
                    <span>Google Meet</span>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div>
                <label className="text-sm font-medium text-black dark:text-white mb-2 block">
                  {t('schedule_participants_label', 'Participants')}
                </label>
                <input
                  {...register("participants")}
                  placeholder={t('schedule_participants_placeholder', 'Enter emails separated by commas')}
                  className="w-full h-11 rounded-full px-4
                  bg-white dark:bg-[#2E2F2F]
                  text-[#333] dark:text-gray-200 outline-none border border-transparent focus:border-[#2461E6] dark:focus:border-[#73FBFD]"
                />

                <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={autoMembers}
                    onChange={(e) => setValue("autoMembers", e.target.checked)}
                    className="hidden"
                  />
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                      ${autoMembers
                        ? "bg-[#2461E6] border-[#2461E6] dark:bg-[#73FBFD] dark:border-[#73FBFD]"
                        : "bg-white border-gray-400"
                      }`}
                  >
                    {autoMembers && (
                      <svg
                        className="w-3 h-3 text-white dark:text-black"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  <span className="text-black dark:text-white">
                    {t('schedule_auto_members_label', 'Auto add default members')}
                  </span>
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium text-black dark:text-white mb-2 block">
                  {t('schedule_initial_notes_label', 'Initial Notes')}
                </label>
                <FileUploadBox
                  register={register}
                  setValue={setValue}
                  watch={watch}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-black dark:text-white btn-hover py-2 px-4"
              >
                {t('schedule_cancel_button', 'Cancel')}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-44 h-11 rounded-full bg-[#2461E6] dark:bg-[#73FBFD] text-white dark:text-black text-sm font-semibold shadow-md btn-hover flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                    <span>{t('schedule_submitting', 'Scheduling...')}</span>
                  </>
                ) : (
                  t('schedule_submit_button', 'Schedule Meeting')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}