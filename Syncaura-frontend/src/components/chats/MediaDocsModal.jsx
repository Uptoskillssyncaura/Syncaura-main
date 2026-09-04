import { X } from "lucide-react";
import { IoDocumentText } from "react-icons/io5";

export default function MediaDocsModal({ isOpen, onClose, files = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-[#2E2F2F] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col h-[80vh]">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-black dark:text-white">Media, Docs and Links</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black dark:hover:text-white btn-hover">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          {files && files.length > 0 ? (
            <div className="flex flex-col gap-3">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-3 py-2 border rounded-xl border-[#989696] dark:border-[#575757]"
                >
                  <IoDocumentText className="size-10 fill-gray-700 dark:fill-gray-300" />
                  <div className="flex flex-col gap-0.5">
                    <h1 className="text-sm font-medium text-[#222222] dark:text-[#FFFFFF]">
                      {file.name}
                    </h1>
                    <div className="flex items-center gap-2">
                      <p className="text-[#989696] text-xs">{file.size}</p>
                      <span className="text-[#989696] text-xs px-1">•</span>
                      <span className="text-[#989696] text-xs">{file.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">No media, docs, or links found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
