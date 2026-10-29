import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Dot } from "lucide-react";
import { IoDocumentText } from "react-icons/io5";

export default function ProfilePanel({
  isOpen,
  onClose,
  profile,
  chatDetails,
  files = [],
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="
              fixed top-0 sm:top-[3.3rem] xl:top-[4.9rem] right-0 z-50
              h-full sm:h-[calc(100vh-3.3rem)] xl:h-[calc(100vh-4.9rem)]
              w-full sm:w-[380px]
              bg-[#FFFFFF] border border-[#E0DDDD]
              dark:border-[#6C6868] dark:bg-[#2E2F2F]
              shadow-xl flex flex-col
            "
          >
            {/* Mobile Header */}
            <div className="flex sm:hidden items-center gap-3 px-4 h-14 border-b shrink-0">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 btn-hover"
              >
                <ArrowLeft className="text-xl text-black dark:text-gray-300" />
              </button>
            </div>

            {/* Profile */}
            <div className="sm:mt-6 flex flex-col items-center py-3">
              <div
                className={`rounded-full size-25 flex items-center justify-center font-bold text-4xl p-5 bg-linear-to-b ${profile.gredient}`}
              >
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="mt-3 text-[#000000] dark:text-[#FFFFFF] font-semibold text-2xl">
                {profile.name}
              </h3>
              <p className="text-lg text-[#989696] dark:text-[#989696]">
                {profile.post}
              </p>
            </div>

            <div className="px-5">
              <div className="h-px w-full bg-[#E0DDDD] dark:bg-[#575757]" />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pb-5 scrollbar-hide">
              {/* Chat Details */}
              <div className="flex flex-col px-5 gap-1 mt-5">
                <h2 className="uppercase font-semibold text-xl text-[#989696] dark:text-[#989696]">
                  chat details
                </h2>

                <div className="flex flex-col gap-1 px-4">
                  <Row label="Status" value={"Open"} valueClass="text-[#29CC39]" />
                  <Row label="Assigned To" value={chatDetails.assignedTo} />
                  <Row label="Local Time" value={chatDetails.localTime} />
                  <Row label="Location" value={chatDetails.location} />
                </div>
              </div>

              {/* Shared Files */}
              <div className="flex flex-col gap-2 px-5 mt-5">
                <h2 className="uppercase font-semibold text-xl text-[#989696] dark:text-[#989696]">
                  shared files
                </h2>

                <div className="flex flex-col gap-3 px-4">
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 px-2 py-1 border rounded-xl border-[#989696] dark:border-[#989696]"
                    >
                      <IoDocumentText className="size-10 fill-gray-700 dark:fill-gray-300" />

                      <div className="flex flex-col gap-0.5">
                        <h1 className="text-sm text-[#222222] dark:text-[#FFFFFF]">
                          {file.name}
                        </h1>

                        <div className="flex items-center justify-center gap-2">
                          <p className="text-[#989696] text-xs">{file.size}</p>
                          <div className="flex items-center justify-center">
                            <Dot className="text-[#989696] text-xl" />
                            <span className="text-[#989696] text-xs">
                              {file.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* Reusable row */
function Row({ label, value, valueClass = "text-[#232323] dark:text-[#EFEEEE]" }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-lg text-[#989696] dark:text-[#989696]">
        {label}
      </h1>
      <h1 className={`text-lg ${valueClass}`}>
        {value}
      </h1>
    </div>
  );
}