import { AnimatePresence, motion } from "framer-motion";
import { Download, Share2, X } from "lucide-react";
import Timeline from "./Timeline";
import { useTranslation } from "react-i18next";

const HEADER_HEIGHT = "4.4rem";

const VersionHistoryDrawer = ({ open, onClose, docId, document, onViewVersion, onRestoreVersion, onOpenEditor }) => {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-10 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            onClick={onClose}
            className="absolute inset-0 bg-black/20 dark:bg-white/10"
            style={{ top: HEADER_HEIGHT }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="
              mt-[4.4rem]
              relative
              h-[calc(100vh-4.4rem)] 
              w-full
              md:w-[420px] md:max-w-[420px]
              bg-[#FFFFFF] dark:bg-black
              shadow-[-10px_0px_20px_0px_#EDEDED40]
              dark:shadow-[-10px_0px_20px_0px_#30303040]
              py-6 flex flex-col
            "
          >
            <button className="flex items-center justify-start px-5 md:hidden btn-hover" >
              <X onClick={onClose} className="text-black dark:text-gray-500 size-6" />
            </button>
    
            <div className="flex border-b mt-1 border-[#E0DDDD] dark:border-gray-800 pb-4 px-6 items-center justify-between gap-3 flex-shrink-0">
              <h2 className="text-base font-bold text-gray-900 dark:text-white truncate max-w-[200px]">
                {document?.title || "Document"}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-start w-full px-6 mt-4 shrink-0">
              <p className="text-sm font-bold text-[#989696] uppercase">{t("versionHistory", "VERSION HISTORY")}</p>
            </div>

            <div className="flex-1 px-6 mt-2 overflow-y-auto">
              <Timeline
                docId={docId}
                document={document}
                onViewVersion={onViewVersion}
                onRestoreVersion={onRestoreVersion}
              />
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEditor?.(document);
                }}
                className="w-full flex items-center justify-center border-2 dark:border-[#73FBFD] border-[#2461E6] py-2.5 rounded-xl font-bold dark:text-[#73FBFD] text-[#2461E6] hover:bg-blue-50 dark:hover:bg-cyan-950/30 transition cursor-pointer btn-hover"
              >
                {t("openEditor", "Edit Document Details")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VersionHistoryDrawer;
