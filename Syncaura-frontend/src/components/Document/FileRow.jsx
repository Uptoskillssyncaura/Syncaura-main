import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function FileRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-white dark:bg-neutral-900 
      rounded-xl shadow-sm dark:shadow-neutral-800
      px-4 py-3 flex flex-col md:flex-row 
      md:items-center md:justify-between gap-4"
    >
      {/* Left Section */}
      <div className="flex items-center gap-4 flex-1">
        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
          <FileText className="text-red-500" size={22} />
        </div>

        <div>
          <p className="font-semibold text-neutral-900 dark:text-white">
            Q4_Financial_Report
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 md:hidden">
            PDF • v3.2
          </p>
        </div>
      </div>

      {/* Desktop Columns */}
      <div className="hidden md:flex items-center gap-10 flex-1 text-sm text-neutral-600 dark:text-neutral-400">
        <span>PDF</span>
        <span>v3.2</span>
        <span>2023-25-07</span>
      </div>

      {/* Status + Action */}
      <div className="flex items-center justify-between md:justify-end gap-4">
        <span className="px-3 py-1 text-xs font-medium rounded-full 
          bg-green-100 text-green-700 
          dark:bg-green-900/30 dark:text-green-400">
          Final
        </span>

        <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium btn-hover">
          Edit
        </button>
      </div>
    </motion.div>
  );
}
