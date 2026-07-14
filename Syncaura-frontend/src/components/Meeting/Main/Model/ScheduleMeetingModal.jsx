import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import FileUploadBox from "../FileHandle/FileUploadBox";

export default function ScheduleMeetingModal({ onClose, onSave }) {
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
    return () => (document.body.style.overflow = "auto");
  }, []);

  const onSubmit = (data) => {
    const now = new Date();

    const selectedDate = new Date(data.date);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("Date must be today or a future date");
      return;
    }

    const startDateTime = new Date(`${data.date}T${data.start}`);
    const endDateTime = new Date(`${data.date}T${data.end}`);

    if (selectedDate.getTime() === today.getTime()) {
      if (startDateTime <= now) {
        alert("Start time must be later than current time");
        return;
      }
    }

    if (endDateTime <= startDateTime) {
      alert("End time must be after start time");
      return;
    }

    onSave({
      id: Date.now(),
      platform: data.platform,
      title: data.title,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      avatarCount: data.participants
        ? data.participants.split(",").length
        : 1,
      isDoc: data.isDoc,
    });

    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 dark:bg-white/10 backdrop-blur-sm z-40"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-0">
        <div
          className="
            bg-[#EDEDED] dark:bg-black
            rounded-3xl sm:rounded-[40px]
            p-4 sm:p-6 xl:p-10
            w-full sm:w-[90vw] md:w-[760px]
            max-h-[90vh] overflow-y-auto
            relative flex flex-col
          "
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-7 sm:right-7 btn-hover"
          >
            <X className="size-6 sm:size-8 text-black dark:text-gray-400" />
          </button>

          <h2 className="text-xl sm:text-[28px] font-semibold mb-4 text-black dark:text-white">
            Schedule New Meeting
          </h2>

          <div className="w-full h-px bg-[#C7C5C5] dark:bg-[#616161]" />

          <form onSubmit={handleSubmit(onSubmit, onError)} className="w-full">
            <div className="flex flex-col gap-5 mt-4">

              {/* Title */}
              <div>
                <label className="block text-sm sm:text-lg font-medium mb-2 text-black dark:text-white">
                  Meeting Title
                </label>
                <input
                  {...register("title", { required: true })}
                  placeholder="eg: my first meeting"
                  className="w-full h-11 rounded-full px-4
                  bg-white text-[#898888] dark:bg-[#2E2F2F]
                  dark:text-gray-200 outline-none"
                />
              </div>

              {/* Date & Time */}
              <div className="flex flex-col sm:flex-row gap-4">
                {[
                  { type: "date", name: "date", label: "Date" },
                  { type: "time", name: "start", label: "Start Time" },
                  { type: "time", name: "end", label: "End Time" },
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col gap-1">
                    <label className="text-sm font-medium text-black dark:text-white">
                      {item.label}
                    </label>
                    <input
                      type={item.type}
                      {...register(item.name, { required: true })}
                      className="
                        w-full h-11 rounded-full
                        px-4
                        bg-white dark:bg-[#2E2F2F]
                        text-[#898888] dark:text-gray-200
                        outline-none
                      "
                    />
                  </div>
                ))}
              </div>

              {/* Platform */}
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-2">
                  <label className="text-sm font-medium text-black dark:text-white">
                    Platform
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
                          ? "bg-[#2461E6] border-[#2461E6]"
                          : "bg-white border-gray-400"
                        }`}
                    >
                      {autoLink && (
                        <svg
                          className="w-3 h-3 text-white"
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
                      Auto-generate meeting link
                    </span>
                  </label>
                </div>

                <div className="flex flex-wrap gap-3">
                  {["Google Meet", "Zoom", "Teams"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setValue("platform", p)}
                      className={`btn-hover flex-1 min-w-[120px] h-11 rounded-full text-sm font-medium ${platform === p
                          ? "border-2 border-[#2461E6] text-[#2461E6] bg-white dark:border-[#73FBFD] dark:text-[#73FBFD]"
                          : "bg-white text-[#898888] dark:bg-[#2E2F2F] dark:text-[#898888]"
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Participants */}
              <div>
                <label className="text-sm font-medium text-black dark:text-white mb-2 block">
                  Participants
                </label>
                <input
                  {...register("participants")}
                  placeholder="Enter emails separated by commas"
                  className="w-full h-11 rounded-full px-4
                  bg-white dark:bg-[#2E2F2F]
                  text-[#898888] dark:text-gray-200 outline-none"
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
                        ? "bg-[#2461E6] border-[#2461E6]"
                        : "bg-white border-gray-400"
                      }`}
                  >
                    {autoMembers && (
                      <svg
                        className="w-3 h-3 text-white"
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
                    Auto add default members
                  </span>
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium text-black dark:text-white mb-2 block">
                  Initial Notes
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
                onClick={onClose}
                className="text-sm text-black dark:text-white btn-hover"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full sm:w-40 h-10 rounded-full bg-[#2461E6] dark:bg-[#73FBFD] text-white dark:text-black text-sm font-semibold btn-hover"
              >
                Schedule Meeting
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}