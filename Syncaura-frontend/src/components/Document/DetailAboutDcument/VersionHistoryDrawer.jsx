import { AnimatePresence, motion } from "framer-motion";
import { Download, Share2, X } from "lucide-react";
import Timeline from "./Timeline";

const HEADER_HEIGHT = "4.4rem";

const VersionHistoryDrawer = ({ open, onClose }) => {
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
              <X onClick={onClose}  className="text-black dark:text-gray-500 size-6" />
            </button>
    
            <div className="flex border-b mt-1 border-[#E0DDDD] pb-4 px-6 items-center justify-center gap-3 flex-shrink-0">
              <div className="flex items-center justify-center border rounded-md text-[#989696] border-[#989696] gap-3 py-2 px-7">
                <Share2 className="size-5 fill-[#989696]" />
                <p className="text-sm font-medium">Share</p>
              </div>
              <div className="flex items-center justify-center border rounded-md text-[#989696] border-[#989696] gap-3 py-2 px-7">
                <Download className="size-5" />
                <p className="text-sm font-medium">Download</p>
              </div>
            </div>

  
            <div className="flex items-center justify-start w-full px-6 mt-4 shrink-0">
              <p className="text-lg text-[#989696] uppercase">VERSION HISTORY</p>
            </div>

        
            <div className="flex-1 px-6 mt-4 overflow-y-auto">
              <Timeline />
            </div>
            <div className="flex items-center justify-center w-full px-5 ">
              <div className="flex items-center w-full justify-center border dark:border-[#73FBFD] border-[#2461E6] py-2 rounded-md px-8  ">
                <p className="dark:text-[#73FBFD] text-[#2461E6] text-lg" >Open Editor</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VersionHistoryDrawer;
