import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import StatusSegment from "./StatusSegment";


export default function StatusBar({ data, total }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-1 items-start justify-center ">
{total && <h1 className="text-sm font-bold text-[#000000] " >{t("task_status_breakdown")}</h1>}

      <div className="w-full h-12 bg-gray-100 rounded-xl overflow-hidden flex">
      {data.map((item, index) => (
        <StatusSegment
          key={item.id}
          item={item}
          total={total}
          delay={index * 0.15}
        />
      ))}
    </div>
    </div>
  );
}
