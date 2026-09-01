import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import TimelineItem from "./TimelineItem";
import { useTranslation } from "react-i18next";

const Timeline = () => {
  const { t } = useTranslation();
  
  const versions = [
    {
      version: "v3.2",
      status: "current",
      date: t("dec_12_2025", "Dec 12, 2025"),
      editor: "Alice Smith",
      title: t("timeline_v32_title", "Final approval adjustments"),
      current: true,
    },
    {
      version: "v3.1",
      date: t("dec_11_2025", "Dec 11, 2025"),
      editor: "Bob Jones",
      title: t("timeline_v31_title", "Updated revenue projections"),
    },
    {
      version: "v3.0",
      date: t("dec_10_2025", "Dec 10, 2025"),
      editor: "Alice Smith",
      title: t("timeline_v30_title", "Initial draft for Q4"),
    },
  ];

  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  const lineProgress = useMotionValue(0);

  useEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.scrollHeight);
    }

    const controls = animate(lineProgress, height, {
      duration: 2.5,
      ease: "easeInOut",
    });

    return () => controls.stop();
  }, [height]);

  return (
    <div ref={containerRef} className="relative max-w-xl mx-auto py-10">
      {/* Vertical Line */}
      <div className="absolute left-6 top-0 h-full w-[2px] bg-gray-200">
        <motion.div
          className="absolute top-0 left-0 w-full bg-green-500"
          style={{ height: lineProgress }}
        />
      </div>

      <div className="space-y-14">
        {versions.map((item, index) => (
          <TimelineItem
            key={index}
            item={item}
            index={index}
            lineProgress={lineProgress}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;
