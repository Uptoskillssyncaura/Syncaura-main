import { X, Upload, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import MotionSelect from "../projects/Model/MotionSelect";

export default function NewNoticeModal({ onClose, addNotice }) {
  const { register, handleSubmit,control, setValue, watch, formState: { errors }, } = useForm();
  const [category, setCategory] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const noticeCategories = [
  "ALL",
  "GENERAL",
  "ACADEMIC",
  "IT",
  "FACILITY",
  "EVENT",
  "EXAM",
];


  const files = watch("attachments");
  const fileRef = useRef(null);

  const onSubmit = (data) => {
    const id= `#${Date.now().toString().slice(0, 4)}`;
    const category=data.category;
    const title=data.description
    const date=new Date(data.date).toISOString();
    addNotice((prev)=>[{id, category, date, title }, ...prev])
    onClose()
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
              New Notice
            </h2>

            {/* Category */}
            <div>

              <div className="relative mt-1">
               <h1 className="text-base font-medium w-full text-[#000000] dark:text-[#F8F8F8]">
                                Category
                            </h1>
                            <div className="flex w-full rounded-xl px-1 md:px-3 py-1 dark:bg-[#2E2F2F] ">
                                <Controller
                                    name="category"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <MotionSelect {...field} startVal="All" options={noticeCategories} />
                                    )}
                                />
                            </div>

               
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-sm font-medium text-black dark:text-white">
                Date
              </label>
              <input
                {...register("date", { required: true })}
                placeholder="Notice issued on"
                className="
                  mt-1 w-full rounded-full px-4 py-2 text-sm outline-none
                  bg-white dark:bg-[#1f1f1f]
                  text-black dark:text-white 
                  border border-gray-300 dark:border-gray-600
                  focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40
                  transition-all
                "
              />
            </div>

            <div>
              <label className="text-sm font-medium text-black dark:text-white">
                Description
              </label>
              <textarea
                {...register("description", { required: true })}
                rows={3}
                placeholder="Describe the issue in detail..."
                className="
                  mt-1 w-full rounded-xl px-4 py-2 text-sm resize-none outline-none
                  bg-white dark:bg-[#1f1f1f]
                  text-black dark:text-white
                  border border-gray-300 dark:border-gray-600
                  focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40
                  transition-all
                "
              />
            </div>

            {/* Attachment */}
            <div>
              <label className="text-sm font-medium text-black dark:text-white">
                Attachments
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
      ${
        isDragging
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
                <span>Click to upload or drag & drop</span>
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

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="
                mt-5 mx-auto
                dark:bg-[#73FBFD] px-5 py-2 dark:text-black
                rounded-full dark:hover:bg-[#08e0e4]
                bg-blue-600 hover:bg-blue-700
                text-[13px] font-medium text-white
                transition-colors
                flex items-center justify-center
              "
            >
              Submit Notice
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
