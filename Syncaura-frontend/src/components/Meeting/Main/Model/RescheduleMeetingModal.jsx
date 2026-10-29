import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function RescheduleMeetingModal({ meeting, onClose, onSave }) {
  const start = new Date(meeting.startTime);
  const end = new Date(meeting.endTime);

  const {
    register,
    handleSubmit,
  } = useForm({
    defaultValues: {
      date: start.toISOString().slice(0, 10),
      start: start.toTimeString().slice(0, 5),
      end: end.toTimeString().slice(0, 5),
    },
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const onSubmit = (data) => {
    const newStart = new Date(`${data.date}T${data.start}`);
    const newEnd = new Date(`${data.date}T${data.end}`);
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);

    if (newStart < oneHourFromNow) {
      alert("Meeting can only be rescheduled to a time at least 1 hour from now.");
      return;
    }

    if (newEnd <= newStart) {
      alert("End time must be after start time.");
      return;
    }

    onSave({
      ...meeting,
      startTime: newStart.toISOString(),
      endTime: newEnd.toISOString(),
    });
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 dark:bg-white/10 backdrop-blur-sm z-40"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
        <div className="bg-[#EDEDED] dark:bg-black rounded-3xl p-6 w-full max-w-[600px] relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 btn-hover"
          >
            <X className="size-6 text-black dark:text-gray-400" />
          </button>

          <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
            Reschedule Meeting
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            {meeting.title}
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                  Date
                </label>
                <input
                  type="date"
                  {...register("date", { required: true })}
                  className="w-full h-11 rounded-full px-4 bg-white dark:bg-[#2E2F2F] text-black dark:text-gray-200 outline-none"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                  Start Time
                </label>
                <input
                  type="time"
                  {...register("start", { required: true })}
                  className="w-full h-11 rounded-full px-4 bg-white dark:bg-[#2E2F2F] text-black dark:text-gray-200 outline-none"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                  End Time
                </label>
                <input
                  type="time"
                  {...register("end", { required: true })}
                  className="w-full h-11 rounded-full px-4 bg-white dark:bg-[#2E2F2F] text-black dark:text-gray-200 outline-none"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Rescheduling is allowed only if the meeting is more than 1 hour away.
            </p>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-black dark:text-white btn-hover"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full sm:w-40 h-10 rounded-full bg-[#2461E6] dark:bg-[#73FBFD] text-white dark:text-black text-sm font-semibold btn-hover"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
