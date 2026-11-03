import { X, Upload, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import MotionSelect from "../projects/Model/MotionSelect";
import { useTranslation } from "react-i18next";

export default function NewNoticeModal({ onClose, addNotice, initialData }) {
  const { t } = useTranslation();
  const isEditMode = Boolean(initialData);
  const { register, handleSubmit, control, setValue, watch, formState: { errors }, } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
    },
  });
  const [category, setCategory] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const noticeCategories = [
    t("all_upper", "ALL"),
    t("general_upper", "GENERAL"),
    t("academic_upper", "ACADEMIC"),
    t("it_upper", "IT"),
    t("facility_upper", "FACILITY"),
    t("event_upper", "EVENT"),
    t("exam_upper", "EXAM"),
  ];


  const files = watch("attachments");
  const fileRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function formatDateTime(value) {
    if (!value) return null;
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const createdAtDisplay = formatDateTime(initialData?.created_at || initialData?.createdAt);
  const updatedAtDisplay = formatDateTime(initialData?.updated_at || initialData?.updatedAt);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.category) formData.append("category", data.category);

    if (data.attachments && data.attachments.length > 0) {
      Array.from(data.attachments).forEach((file) => {
        formData.append("attachments", file);
      });
    }

    try {
      setSubmitError("");
      setIsSubmitting(true);
      const result = await addNotice(formData);
      if (result?.error) {
        setSubmitError(result.payload || "Failed to submit notice. Please try again.");
        return;
      }
      onClose();
    } catch (err) {
      setSubmitError(err?.message || "Failed to submit notice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const onError = (formErrors) => {
    console.log("Form Errors:", formErrors);
  };

  const handleFileClick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (e) => {
    setValue("attachments", e.target.files, { shouldValidate: true });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length) {
      setValue("attachments", droppedFiles, { shouldValidate: true });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          onClick={onClose}
          className="absolute inset-0 bg-black/40 dark:bg-white/10 backdrop-blur-xs "
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="
            relative w-full max-w-md sm:max-w-lg
            rounded-2xl
            bg-[#f0f0f0] dark:bg-black
            p-6 shadow-2xl
          "
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white btn-hover"
          >
            <X size={18} />
          </button>

          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
            <h2 className="text-lg font-semibold text-black dark:text-white">
              {isEditMode ? t("edit_notice", "Edit Notice") : t("new_notice", "New Notice")}
            </h2>

            {/* Category */}
            <div>

              <div className="relative mt-1">
                <h1 className="text-base font-medium w-full text-[#000000] dark:text-[#F8F8F8]">
                  {t("category", "Category")}
                </h1>
                <div className="flex w-full rounded-xl px-1 md:px-3 py-1 dark:bg-[#2E2F2F] ">
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <MotionSelect {...field} startVal={t("all_camel", "All")} options={noticeCategories} />
                    )}
                  />
                </div>
                {errors.category && (
                  <p className="mt-1 text-xs text-red-500">{t("category_required", "Please select a category.")}</p>
                )}


              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-medium text-black dark:text-white">
                {t("title", "Title")}
              </label>

              <input
                {...register("title", { required: true })}
                placeholder={t("notice_title", "Notice title")}
                className="
      mt-1 w-full rounded-full px-4 py-2 text-sm outline-none
      bg-white dark:bg-[#1f1f1f]
      text-black dark:text-white
      border border-gray-300 dark:border-gray-600
      focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40
      transition-all
    "
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-500">{t("title_required", "Title is required.")}</p>
              )}
            </div>
            {/* Created / Last edited (auto, read-only) */}
            {isEditMode && (createdAtDisplay || updatedAtDisplay) && (
              <div className="flex flex-col gap-0.5 text-xs text-gray-500 dark:text-gray-400">
                {createdAtDisplay && <span>Created: {createdAtDisplay}</span>}
                {updatedAtDisplay && <span>Last edited: {updatedAtDisplay}</span>}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-black dark:text-white">
                {t("description", "Description")}
              </label>
              <textarea
                {...register("description", { required: true })}
                rows={3}
                placeholder={t("describe_issue_in_detail", "Describe the issue in detail...")}
                className="
                  mt-1 w-full rounded-xl px-4 py-2 text-sm resize-none outline-none
                  bg-white dark:bg-[#1f1f1f]
                  text-black dark:text-white
                  border border-gray-300 dark:border-gray-600
                  focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40
                  transition-all
                "
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">{t("description_required", "Description is required.")}</p>
              )}
            </div>

            {/* Attachment */}
            <div>
              <label className="text-sm font-medium text-black dark:text-white">
                {t("attachments", "Attachments")}
              </label>

              <motion.div
                onClick={handleFileClick}
                whileHover={{ scale: 1.02 }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`
      mt-1 h-24 rounded-xl border-2 border-dashed
      ${isDragging
                    ? "border-blue-500 bg-blue-50/20"
                    : "border-gray-300 dark:border-gray-600"
                  }
      flex flex-col items-center justify-center gap-1
      text-sm text-gray-600 dark:text-gray-400
      cursor-pointer
      transition-colors
    `}
              >
                <Upload size={18} />
                <span>{t("click_to_upload_or_drag_drop", "Click to upload or drag & drop")}</span>
              </motion.div>

              <input
                type="file"
                multiple
                hidden
                ref={fileRef}
                onChange={handleFileChange}
              />

              {files?.length > 0 && (
                <div
                  className="
      mt-2 max-h-20 overflow-y-auto
      text-xs text-gray-600 dark:text-gray-400
      scrollbar-hide
    "
                >
                  {Array.from(files).map((file, idx) => (
                    <div key={idx} className="truncate">
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {submitError && (
              <p className="text-center text-xs text-red-500">{submitError}</p>
            )}

            <motion.button
              whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className="
                mt-5 mx-auto
                dark:bg-[#73FBFD] px-5 py-2 dark:text-black
                rounded-full dark:hover:bg-[#08e0e4]
                bg-blue-600 hover:bg-blue-700
                text-[13px] font-medium text-white
                transition-colors
                flex items-center justify-center
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {isSubmitting
                ? t("submitting", "Submitting...")
                : isEditMode
                  ? t("update_notice", "Update Notice")
                  : t("submit_notice", "Submit Notice")}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
