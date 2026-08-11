import { Check, CircleDot, TrendingDown, TrendingUp, TriangleAlert } from 'lucide-react'
import TopCard from '../TopCard'
import { MdFolderShared } from "react-icons/md";
import { TiClipboard } from "react-icons/ti";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import ProjectContributionCard from './Project/ProjectContributionCard'
import OverallContextChart from './Project/OverallContextChart'
import ActiveEngagementTable from './Project/ActiveEngagementTable'

const Projects = () => {
  const { t } = useTranslation();
  const cardData = [
    {
      title: t("project_total_projects"),
      count: 18,
      iconData: <MdFolderShared className='size-8 text-[#99A7BB]' />,
      data: (
        <div className="bg-[#E7F5E9] dark:bg-[#234B1C] py-0.5 px-3 rounded-xl border border-[#C6E7C1] dark:border-none">
          <p className="text-[#2E7D32] dark:text-[#3AFF13] text-[10px] font-bold">
            {t("project_plus_from_last_month")}
          </p>
        </div>
      )
    },
    {
      title: t("project_active_count"),
      count: 4,
      iconData: <TiClipboard className='size-8 text-[#0078F5]' />,
      data: (
        <div className="bg-[#E3F2FD] dark:bg-[#1E1E1E] py-0.5 px-3 rounded-xl border border-[#BBDEFB] dark:border-none">
          <p className="text-[#1565C0] dark:text-[#006FEB] text-[10px] font-bold flex gap-2 items-center justify-center">
            <CircleDot className='size-4 text-[#1565C0] dark:text-white fill-[#1565C0] dark:fill-[#006FEB]' /> 
            {t("project_steady_pace")}
          </p>
        </div>
      )
    },
    {
      title: t("project_completed_count"),
      count: 12,
      iconData: (
        <div className="flex items-center justify-center p-2 rounded-full bg-[#1BC963]">
          <Check className='size-5 text-white dark:text-gray-900' />
        </div>
      ),
      data: (
        <div className="bg-[#E7F5E9] dark:bg-[#234B1C] py-0.5 px-3 rounded-xl border border-[#C6E7C1] dark:border-none">
          <p className="text-[#2E7D32] dark:text-[#3AFF13] text-[10px] font-bold flex gap-2 items-center justify-center">
            <TrendingUp className='size-4 text-[#2E7D32] dark:text-[#00B777]' /> 
            {t("project_efficiency")}
          </p>
        </div>
      )
    },
    {
      title: t("project_overdue_count"),
      count: 2,
      iconData: (
        <TriangleAlert className='size-10 text-white dark:text-gray-900 fill-[#EF4444]' />
      ),
      data: (
        <div className="bg-[#FFEBEE] dark:bg-[#4B1C1C] py-0.5 px-3 rounded-xl border border-[#FFCDD2] dark:border-none">
          <p className="text-[#C62828] dark:text-[#F63030] text-[10px] font-bold flex gap-2 items-center justify-center">
            <TrendingDown className='size-4 text-[#C62828] dark:text-red-600' /> 
            {t("project_requires_attention")}
          </p>
        </div>
      )
    }
  ]

  return (
    <div className="flex flex-col w-full gap-y-8 px-2 md:px-3 lg:px-4 py-4">

      {/* Top Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
        {cardData.map((item) => (
          <motion.div
            key={item.title}
            whileHover={{ 
              scale: 1.05, 
              y: -6 
            }}
            transition={{ type: "spring", stiffness: 250 }}
            className="w-full flex justify-center cursor-pointer"
          >
            <div className="w-full transition-all duration-300 hover:shadow-2xl rounded-2xl">
              <TopCard
                title={item.title}
                count={item.count}
                IconData={item.iconData}
                data={item.data}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Project Content */}
      <ProjectContributionCard />
      <OverallContextChart />
      <ActiveEngagementTable />
    </div>
  )
}

export default Projects
