import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleAlert, CircleCheck, Clock, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ComplaintSlider({ dummyComplaints, idx, onClose }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(
    dummyComplaints
      .map((item, i) => {
        if (item.id === idx) return i;
        else return 0;
      })
      .reduce((acc, curr) => acc + curr, 0),
  );
  const [direction, setDirection] = useState(0);
  const statusStyle = (status) => {
    if (status === "open") return "bg-[#FFC2C2] text-[#C71212]";
    if (status === "in-progress") return "bg-[#FEF2C2] text-[#C05328]";
    return "bg-[#D1FAE5] text-[#29CC39]";
  };

  const statusIcon = (status) => {
    if (status === "open")
      return <CircleAlert className="size-3.5 text-[#C71212] fill-[#FFC2C2]" />;
    if (status === "in-progress")
      return <Clock className="size-3.5 text-[#C05328]   " />;
    return <CircleCheck className="size-3.5 text-[#29CC39] fill-[#D1FAE5]  " />;
  };

  const next = () => {
    if (index < dummyComplaints.length - 1) {
      setDirection(1);
      setIndex((p) => p + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setDirection(-1);
      setIndex((p) => p - 1);
    }
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  const data = dummyComplaints[index];

  return (
    <div className="relative z-100 h-screen bg-white dark:bg-black">
      <div className="sticky top-0 z-40 flex justify-end px-6 py-4 bg-white dark:bg-black border-b border-gray-800">
        <X onClick={onClose} className="size-6 cursor-pointer text-gray-500 dark:text-white" />
      </div>

     
      <div className="h-[calc(100vh-140px)] overflow-y-auto px-6 py-4 pb-28">
  <AnimatePresence custom={direction} mode="wait">
    <motion.div
      key={data.id}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
            <div className="flex w-full flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div className="flex items-center justify-center  ">
                <p className=" text-xl sm:text-2xl text-black dark:text-white font-medium">
                  {t("complaintSlider_complaintId", "COMPLAINT ID : ")} {data.id}
                </p>
              </div>
              <div className="flex flex-col items-start justify-center gap-1  ">
                <div className="flex items-center justify-center gap-5 ">
                  <p className="text-sm sm:text-base text-black dark:text-gray-400 font-medium uppercase ">
                    {t("complaintSlider_status", "status :")}
                  </p>
                  <div
                    className={`flex items-center gap-2 justify-center py-1 rounded-2xl px-4 ${statusStyle(
                  data.status.toLowerCase(),
                    )}`}
                  >
                    {statusIcon(data.status.toLowerCase())}
                    <span className="text-sm">{data.status}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-5 ">
                  <p className="text-sm sm:text-base text-black dark:text-gray-400 font-medium uppercase ">
                    {t("complaintSlider_date", "Date :")}
                  </p>
                  <p className="text-base text-[#000000] font-medium dark:text-white ">
                    {new Date(data.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-center mb-5 ">
              <h1 className="text-xl sm:text-3xl text-black dark:text-white font-semibold">
                {data.title}
              </h1>
              <div className="flex px-5 md:px-20 py-3 ">
                <p className="text-black dark:text-gray-500 text-sm sm:text-lg font-normal">
                  {data.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start justify-center gap-3 w-full">
              <h3 className="text-xl sm:text-2xl text-black dark:text-white font-semibold">
                {t("complaintSlider_attachments", "Attachments")}
              </h3>
              <div className="flex flex-wrap items-center justify-center w-full gap-3">
                {data.attachments?.map((attachment, i) => {
                  const url = typeof attachment === "string" ? attachment : attachment.file_url || attachment.url;
                  const name = typeof attachment === "string" ? attachment.split("/").pop() : attachment.name || attachment.file_name || attachment.file_url?.split("/").pop();

                  return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    onClick={() => window.open(url, "_blank")}
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm text-gray-800 dark:text-white dark:hover:bg-gray-950 hover:bg-gray-200"
                  >
                    {name}
                  </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 z-50 w-full bg-white dark:bg-black border-t dark:border-gray-800">
          <div className="max-w-4xl mx-auto px-6 py-4 flex gap-4">
            <motion.button
              onClick={prev}
              disabled={index === 0}
              className={`flex-1 px-6 py-3 rounded-xl ${index===0? "cursor-not-allowed" :"cursor-pointer"} bg-gray-200 text-gray-900 font-medium disabled:opacity-50`}
            >
              {t("complaintSlider_previous", "Previous")}
            </motion.button>

            <motion.button
              onClick={next}
              disabled={index === dummyComplaints.length - 1}
              className={`flex-1 px-6 py-3 rounded-xl ${index===dummyComplaints.length - 1? "cursor-not-allowed" :"cursor-pointer"} bg-blue-600 dark:bg-[#73FBFD] dark:text-black text-white font-medium disabled:opacity-50`}
            >
              {t("complaintSlider_next", "Next")}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
