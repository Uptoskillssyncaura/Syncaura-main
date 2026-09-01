import { useRef, useState, useEffect } from "react";
import { motion,useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";

const TimelineItem = ({ item, index, lineProgress }) => {
  const { t } = useTranslation();
  const dotRef = useRef(null);
  const [dotY, setDotY] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (dotRef.current) {
      const offsetTop = dotRef.current.offsetTop + dotRef.current.offsetHeight / 2;
      setDotY(offsetTop);
    }
  }, []);

 
  useEffect(() => {
    const unsubscribe = lineProgress.onChange((value) => {
      if (value >= dotY) setActive(true);
    });
    return () => unsubscribe();
  }, [dotY, lineProgress]);

  const scale = useTransform(
    lineProgress,
    [dotY - 20, dotY],
    [0, 1]
  );

  return (
    <div className="relative flex gap-2">
      <div ref={dotRef} className="relative left-1.5 w-12 flex justify-center">
        {active && (
          <motion.div
            className="absolute w-6 h-6 -top-1 rounded-full bg-green-400/30 dark:bg-[#DFFFE9] z-0"
            animate={{
              scale: [1, 2, 1.2],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        <motion.div
          className={`w-4 h-4 rounded-full ${active ? "bg-green-500" : "bg-gray-400"} z-10`}
          style={{ scale }}
        />
      </div>

      <motion.div
        className="p-4 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex flex-col items-start justify-center w-full gap-3 -mt-5 ">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center justify-start w-full gap-2">
              <p className="text-[#000000] dark:text-[#FFFFFF] text-sm">{item.version}</p>
              {item.status && (
                <div className="bg-[#DFFFE9] px-5 py-1 rounded-2xl">
                  <p className="text-[#00990F] text-sm">{t(`status_${item.status.toLowerCase()}`, item.status)}</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end w-full">
              <p className="text-base text-[#000000] dark:text-[#FFFFFF]">{item.date}</p>
            </div>
          </div>
          <div className="flex items-center justify-start w-full">
            <p className="text-lg text-[#000000] dark:text-[#FFFFFF]">{t("edited_by", "Edited by")} {item.editor}</p>
          </div>
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center justify-center w-full bg-[#F8F8F8] dark:bg-[#575757] py-2 rounded-xl border border-[#E0DDDD] dark:border-[#575757]">
              <p className="text-[#000000] dark:text-[#FFFFFF] text-base">“{item.title}”</p>
            </div>
          </div>
          <div className="flex items-center justify-start w-full">
            <div className="flex items-center justify-center gap-3">
              <p className="text-[#2461E6] dark:text-[#73FBFD] cursor-pointer hover:underline text-base">{t("view", "View")}</p>
              <p className="text-[#000000] dark:text-[#FFFFFF] cursor-pointer hover:underline text-base">{t("restore", "Restore")}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TimelineItem;
