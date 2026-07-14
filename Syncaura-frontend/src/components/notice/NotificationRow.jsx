import { motion } from "framer-motion";
import { Eye, Download, FileText,  Calendar } from "lucide-react";

export default function NotificationRow({title, about, date, bgColor, docColor}) {
    function formatDateYYYYMMDD(isoDate) {
  const d = new Date(isoDate);
  return d.toISOString().split("T")[0];
}

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full  rounded-xl shadow-sm px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center  sm:gap-4"
    >
      <div className="hidden xl:flex items-center  flex-1 ">
        <div className="flex-1/15  flex items-center justify-center">
          <div className={`p-2 rounded-lg ${bgColor} flex items-center justify-center`}>
            <FileText className={`${docColor} size-6`} />
          </div>
        </div>
        <div className="flex-9/15 gap-x-2 flex flex-col md:flex-row  items-center justify-start">
          <div className="flex-1/6 w-full flex items-center justify-start ">
            <h1 className="text-black dark:text-[#FFFFFF] text-sm font-medium uppercase">
              {title}
            </h1>
          </div>
          <div className="flex-5/6 w-full flex items-center justify-start">
            <p className="text-xl font-medium text-black dark:text-[#FFFFFF]">
             {about}
            </p>
          </div>
        </div>
        <div className=" flex-4/15 w-full flex items-center justify-center gap-1">
          <Calendar className="size-5 text-black" />
          <p className="text-sm text-black dark:text-[#FFFFFF]">{formatDateYYYYMMDD(date)}</p>
        </div>
        <div className=" flex-2/15 w-full flex items-center justify-center gap-2">
          <div className="flex-2/5 w-full flex items-center justify-end gap-1 ">
            <div className="flex items-center justify-center bg-[#E2EBFF] dark:bg-[#1C3939] border border-[#2461E6] dark:border-[#1C3939] gap-1 px-7 py-1 ">
              <Eye className="text-[#2461E6] dark:text-[#73FBFD]  size-5" />
              <p className="text-xs font-medium text-[#2461E6] dark:text-[#73FBFD]">View</p>
            </div>
          </div>
          <div className="flex-3/5 w-full flex items-center justify-end">
            <div className="flex items-center justify-center border border-[#989696] gap-1 px-5 py-1 ">
              <Download className="size-5 text-[#989696] " />
              <p className=" text-xs text-[#989696] font-medium">Download</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex xl:hidden items-center flex-1" >
        
     
      <div className="flex  items-center gap-3 flex-1">
        <div className={`p-2 rounded-lg ${bgColor} flex items-center justify-center`}>
          <FileText className={`${docColor} size-6`}  />
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-white  uppercase">
            {title}
          </span>
          <span className="text-base sm:text-base font-medium text-gray-800 dark:text-white">
            {about}
          </span>
        </div>
      </div>

     
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-white">
        <span className="whitespace-nowrap">{formatDateYYYYMMDD(date)}</span>

        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-[#1C3939] text-blue-600 dark:text-[#73FBFD] transition btn-hover">
          <Eye size={16} />
          <span className="hidden sm:inline ">View</span>
        </button>

        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition btn-hover">
          <Download size={16} />
          <span className="hidden sm:inline">Download</span>
        </button>
      </div>
       </div>
    </motion.div>
  );
}
