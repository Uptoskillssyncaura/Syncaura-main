import { X, Upload, FileText, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import MotionSelect from "../projects/Model/MotionSelect";

export default function DocumentModal({ onClose, addReport, initialData }) {
  const isEditing = Boolean(initialData);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || initialData?.name || "",
      category: initialData?.category || "GENERAL",
      type: initialData?.type || "PDF",
      description: initialData?.content || initialData?.description || "",
    },
  });

  const [isDragging, setIsDragging] = useState(false);
  const noticeCategories = [
    "ALL",
    "GENERAL",
    "ACADEMIC",
    "IT",
    "FACILITY",
    "EVENT",
    "EXAM",
    "FINANCE",
    "HR",
    "PROJECT",
  ];

  const documentTypes = [
    "PDF",
    "DOCX",
    "REPORT",
    "SPREADSHEET",
    "PRESENTATION",
    "IMAGE",
    "OTHER",
  ];

  const files = watch("attachments");
  const fileRef = useRef(null);

  const fileToDataURL = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(URL.createObjectURL(file));
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data) => {
    const rawFiles = data.attachments ? Array.from(data.attachments) : [];
    
    // Read all files as Data URLs so they can be viewed, opened in new tab, and downloaded
    let attachments = initialData?.attachments || [];
    if (rawFiles.length > 0) {
      const newAttachments = await Promise.all(
        rawFiles.map(async (file) => {
          let dataUrl = "";
          try {
            dataUrl = await fileToDataURL(file);
          } catch {
            dataUrl = URL.createObjectURL(file);
          }
          return {
            name: file.name,
            file_name: file.name,
            size: file.size,
            type: file.type,
            file_url: dataUrl,
            url: dataUrl,
          };
        })
      );
      attachments = [...newAttachments, ...attachments];
    }

    const finalTitle =
      data.title?.trim() ||
      initialData?.title ||
      rawFiles[0]?.name ||
      `${data.type || "Document"} Report`;

    const reportPayload = {
      ...(initialData || {}),
      title: finalTitle,
      name: finalTitle,
      category: data.category || initialData?.category || "GENERAL",
      type: data.type || (rawFiles[0]?.name?.split(".").pop()?.toUpperCase()) || initialData?.type || "DOCUMENT",
      content: data.description?.trim() || initialData?.content || "Uploaded document",
      description: data.description?.trim() || initialData?.description || "Uploaded document",
      attachments,
      file_url: attachments[0]?.url || initialData?.file_url || null,
      file_name: attachments[0]?.name || initialData?.file_name || null,
      status: initialData?.status || "Active",
      updated_at: new Date().toISOString(),
      created_at: initialData?.created_at || new Date().toISOString(),
      versions: initialData?.versions || [{ version: "v1.0", date: new Date().toISOString() }],
    };

    addReport(reportPayload);
  };

  const onError = (formErrors) => {
    console.log("Form Errors:", formErrors);
  };

  const handleFileClick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue("attachments", e.target.files, { shouldValidate: true });
      // If title is not set yet, auto-suggest the first file's name
      const currentTitle = watch("title");
      if (!currentTitle) {
        setValue("title", e.target.files[0].name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length) {
      setValue("attachments", droppedFiles, { shouldValidate: true });
      const currentTitle = watch("title");
      if (!currentTitle) {
        setValue("title", droppedFiles[0].name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    if (!files) return;
    const dt = new DataTransfer();
    Array.from(files).forEach((file, idx) => {
      if (idx !== indexToRemove) dt.items.add(file);
    });
    setValue("attachments", dt.files.length > 0 ? dt.files : null);
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
          className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.92, y: 25, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 25, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="
            relative w-full max-w-md sm:max-w-lg
            rounded-2xl
            bg-white dark:bg-[#18191B]
            border border-gray-200 dark:border-gray-800
            p-6 shadow-2xl max-h-[90vh] overflow-y-auto
          "
        >
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-1 text-gray-400 hover:text-black dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
          >
            <X size={18} />
          </button>

          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-black dark:text-white">
                {isEditing ? "Edit Document" : "Upload Document"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {isEditing ? "Update document metadata, category or add revised files" : "Upload supported files (.pdf, .docx, .txt, .png, etc.)"}
              </p>
            </div>

            {/* Document Title */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Document Title
              </label>
              <input
                {...register("title", { required: "Document title is required" })}
                placeholder="e.g. Q3 Financial Report"
                className={`
                  mt-1 w-full rounded-xl px-4 py-2 text-sm outline-none
                  bg-gray-50 dark:bg-[#232427]
                  text-black dark:text-white 
                  border ${errors.title ? "border-red-500" : "border-gray-200 dark:border-gray-700"}
                  focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40
                  transition-all
                `}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.title.message}</p>
              )}
            </div>

            {/* Category & Type Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <div className={`mt-1 flex w-full rounded-xl px-2 py-1 bg-gray-50 dark:bg-[#232427] border ${errors.category ? "border-red-500" : "border-gray-200 dark:border-gray-700"}`}>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <MotionSelect {...field} startVal="Select Category" options={noticeCategories} />
                    )}
                  />
                </div>
                {errors.category && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Type / Format
                </label>
                <div className="mt-1 flex w-full rounded-xl px-2 py-1 bg-gray-50 dark:bg-[#232427] border border-gray-200 dark:border-gray-700">
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <MotionSelect {...field} startVal="PDF" options={documentTypes} />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={2}
                placeholder="Brief summary or description of the document..."
                className="
                  mt-1 w-full rounded-xl px-4 py-2 text-sm outline-none
                  bg-gray-50 dark:bg-[#232427]
                  text-black dark:text-white 
                  border border-gray-200 dark:border-gray-700
                  focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40
                  transition-all
                "
              />
            </div>

            {/* File Upload Box */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Select File
              </label>

              <motion.div
                onClick={handleFileClick}
                whileHover={{ scale: 1.01 }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`
                  mt-1 h-28 rounded-2xl border-2 border-dashed
                  ${isDragging
                    ? "border-blue-500 bg-blue-50/20"
                    : "border-gray-300 dark:border-gray-700 hover:border-blue-400 bg-gray-50 dark:bg-[#232427]"
                  }
                  flex flex-col items-center justify-center gap-1.5
                  text-xs text-gray-600 dark:text-gray-400
                  cursor-pointer transition-colors p-3
                `}
              >
                <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-[#73FBFD]">
                  <Upload size={18} />
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Click to select file or drag & drop
                </span>
                <span className="text-[10px] text-gray-400">
                  PDF, DOC, DOCX, TXT, PNG, JPG, XLSX (Max 25MB)
                </span>
              </motion.div>

              <input
                type="file"
                multiple
                hidden
                ref={fileRef}
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.xlsx,.csv,.xls,.pptx,.ppt"
                onChange={handleFileChange}
              />

              {/* Selected Files List */}
              {files && files.length > 0 && (
                <div className="mt-2 space-y-1 max-h-24 overflow-y-auto pr-1">
                  {Array.from(files).map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#232427] border border-gray-200 dark:border-gray-700 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <FileText className="size-3.5 text-blue-600 dark:text-[#73FBFD] flex-shrink-0" />
                        <span className="truncate text-gray-800 dark:text-gray-200 font-medium">{file.name}</span>
                        <span className="text-[10px] text-gray-400 flex-shrink-0">
                          ({(file.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(idx);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 transition cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="
                w-full mt-4
                bg-blue-600 hover:bg-blue-700
                dark:bg-[#73FBFD] dark:hover:bg-[#5be1e3]
                text-white dark:text-black
                py-2.5 rounded-xl
                text-sm font-bold
                transition-all shadow-md
                flex items-center justify-center gap-2 cursor-pointer
              "
            >
              <Upload size={16} />
              <span>{isEditing ? "Update Document" : "Upload Document"}</span>
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

