import { FaFileCirclePlus } from "react-icons/fa6";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const FileUploadBox = ({ register, setValue, watch }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const file = watch("document");

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert(t('fileupload_alert', 'Only PDF, PPT, DOC files are allowed'));
      return;
    }

    setValue("document", file, { shouldValidate: true });
    setValue("isDoc", true, { shouldValidate: true });
  };

  const handleFileChange = (e) => {
    handleFileSelect(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  return (
    <>
      <input
        type="file"
        accept=".pdf,.ppt,.pptx,.doc,.docx"
        {...register("document")}
        ref={(e) => {
          register("document").ref(e);
          fileInputRef.current = e;
        }}
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          w-full p-5 rounded-[20px]
          bg-white dark:bg-[#2E2F2F]
          flex flex-col items-center justify-center gap-3
          cursor-pointer border-2 border-dashed transition
          ${
            isDragging
              ? "border-blue-500 bg-blue-50 dark:bg-[#3A3B3B]"
              : "border-gray-300 hover:border-blue-400"
          }
        `}
      >
        <FaFileCirclePlus
          className={`size-9 ${
            file ? "fill-blue-500" : "fill-gray-400"
          }`}
        />

        <span className="text-sm text-gray-500 dark:text-gray-300 text-center">
          {file ? file.name : t('fileupload_drag_drop', 'Drag & drop or click to upload')}
        </span>
      </div>
    </>
  );
};

export default FileUploadBox;