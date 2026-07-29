import { Clock, Eye } from "lucide-react";
import { FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function ComplaintsList({
  COMPLAINTS,
  activeId,
  setActiveId,
  statusStyle,
  statusIcon,
}) {
  const { t } = useTranslation();
 const formatDate = (dateString) => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
 const mobileStatusStyle = (status) => {
    if (status === "open") return " bg-[#FFC2C2] dark:bg-[#3D2D2D] text-[#C71212]";
    if (status === "in-progress") return "bg-[#FEF2C2] dark:bg-[#3E3A29] text-[#C05328]";
    return "bg-[#D1FAE5] dark:bg-[#1F402F] text-[#29CC39]";
  };

  const mobileStatusIcon = (status) => {
    if (status === "open")
      return <CircleAlert className="size-4 fill-[#FFC2C2] text-[#C71212] dark:fill-[#3D2D2D]" />;
    if (status === "in-progress")
      return <Clock className="size-4 text-[#C05328]   " />;
    return <CircleCheck className="size-4 fill-[#D1FAE5] text-[#29CC39] dark:fill-[#1F402F]  " />;
  };

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        duration: 0.35,
        ease: "easeOut",
      },
    },
  };


  return (
    <>
      <div className="hidden md:flex flex-col gap-2 h-[calc(100vh-180px)]">
        <div className="grid grid-cols-11 place-items-center px-5 xl:px-15 2xl:px-20 py-4
          border border-[#8a858560] dark:border-[#575757] gap-x-2 sticky top-0
          bg-white dark:bg-[#2E2F2F] transition-colors duration-500 z-10">
          <div className="text-sm xl:text-lg font-semibold uppercase col-span-2 text-[#000000] dark:text-[#FFFFFF]">
            {t("complaintsList_complaintId", "complaint id")}
          </div>
          <div className="text-sm flex items-center justify-start w-full xl:text-lg font-semibold uppercase col-span-4 text-[#000000] dark:text-[#FFFFFF]">
            {t("complaintsList_subjectCategory", "subject/category")}
          </div>
          <div className="text-sm xl:text-lg font-semibold uppercase col-span-2 text-[#000000] dark:text-[#FFFFFF]">
            {t("complaintsList_date", "date")}
          </div>
          <div className="text-sm xl:text-lg font-semibold uppercase col-span-2 text-[#000000] dark:text-[#FFFFFF]">
            {t("complaintsList_status", "status")}
          </div>
          <div className="text-sm xl:text-lg font-semibold uppercase col-span-1 text-[#000000] dark:text-[#FFFFFF]">
            {t("complaintsList_actions", "actions")}
          </div>
        </div>

        <motion.div
          className="flex flex-col overflow-y-auto no-scrollbar"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          key={COMPLAINTS.length}
        >

          {COMPLAINTS.map(({ id, title, status, category, created_at }, idx) => (
            <motion.div
              variants={itemVariants}
              onClick={() => setActiveId(id)}
              key={id}

              className={`relative grid py-5 grid-cols-11 px-5 xl:px-15 2xl:px-20 gap-x-2 place-items-center
                transition-all duration-300
                ${
                  activeId === id
                    ? "bg-[#E2EBFF] dark:bg-[#1C3939]"
                    : "hover:bg-[#e2ebff75] dark:hover:bg-[#1d3333] hover:scale-[1.005]"
                }`}
            >
              <span
                className={`absolute  left-0 top-0 h-full w-1 bg-blue-500 dark:bg-gray-400 transition-transform duration-300
                  ${ 
                    activeId === id
                      ? "scale-y-100"
                      : "scale-y-0 group-hover:scale-y-100"
                  }`}
              />

              <div className="text-sm flex items-center justify-center w-full font-semibold uppercase col-span-2 text-[#000000] dark:text-[#FFFFFF]">
                {id}
              </div>

              <div className="text-sm w-full flex items-center col-span-4 text-[#000000] dark:text-[#FFFFFF]">
                <div className="flex flex-col items-start justify-start">
                  <span className="uppercase font-semibold">{title}</span>
                  <span className="text-xs">{category}</span>
                </div>
              </div>

              <div className="text-sm flex items-center justify-center w-full font-semibold uppercase col-span-2 text-[#000000] dark:text-[#FFFFFF]">
                {formatDate(created_at)}
              </div>

              <div className="text-xs flex items-center justify-center w-full font-semibold col-span-2 text-[#000000] dark:text-[#FFFFFF]">
                <div
                  className={`flex items-center gap-2 justify-center py-2 rounded-2xl px-4 ${statusStyle(
                    status.toLowerCase()
                  )}`}
                >
                  {statusIcon(status.toLowerCase())}
                  <span>{status}</span>
                </div>
              </div>

              <div className="text-sm flex items-center justify-center w-full font-semibold col-span-1 text-[#000000] dark:text-[#FFFFFF]">
                <Eye className="text-xl text-black dark:text-gray-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="h-px block md:hidden w-full bg-[#E0DDDD] dark:bg-[#2E2F2F]  " />

      <div
        className="
     md:hidden
    grid
    grid-cols-1
    xssm:grid-cols-2
    
    gap-5
    px-5
    h-[calc(100dvh-120px)]
    overflow-y-auto
    min-h-0
    pb-32
    no-scrollbar
    mt-5
  "
      >
        {COMPLAINTS.map(({ id, title, category, status, created_at }, idx) => (
          <div
            key={COMPLAINTS.length + idx}
              onClick={() => setActiveId(id)}
            className="flex flex-col gap-2 bg-[#FFFFFF] dark:bg-[#2E2F2F]  px-5 py-2 shadow-[0_0_10px_3px_#D2D2D233]
              dark:shadow-[0_0_10px_3px_#D2D2D233]
              transition-shadow duration-200 rounded-2xl relative h-33"
          >
            <div className="flex w-full items-center justify-between ">
              <div className="flex items-center justify-start ">
                <h1 className="text-xs text-[#000000] dark:text-[#FFFFFF]" >{id}</h1>
              </div>
              <div className="flex items-center justify-end ">
                <div
                  className={`flex items-center gap-2 justify-center py-1 w-25 rounded-2xl  ${mobileStatusStyle(
                    status.toLowerCase()
                  )}`}
                >
                  {mobileStatusIcon(status.toLowerCase())}
                  <span className="text-xs font-semibold" >{status}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-start w-full ">
              <h1 className="text-base font-bold text-[#000000] dark:text-[#FFFFFF]" >{title}</h1>
              <h2 className="text-sm font-light text-[#000000] dark:text-white" >{category}</h2>
            </div>
            <div className="flex items-center justify-start gap-2 ">
              <FaClock className="size-5 text-white dark:text-[#2E2F2F] fill-black dark:fill-gray-400"  />
              <h1 className="text-[#000000] dark:text-[#FFFFFF] font-light text-xs" >{formatDate(created_at)}</h1>
            </div>
            <div className="absolute bottom-5 right-5 ">
              <Eye className="size-6 text-gray-700 dark:text-gray-300" />
            </div>
           
          </div>
        ))}
      </div>
    </>
  );
}
