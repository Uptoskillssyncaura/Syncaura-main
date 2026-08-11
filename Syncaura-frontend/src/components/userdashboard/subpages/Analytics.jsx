import { Check, CircleAlert, ClipboardListIcon, EllipsisIcon } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import TopCard from '../TopCard'
import CircularProgress from '../CircularProgress'
import TaskStatusDistribution from '../TaskGraph/TaskStatusDistribution'
import { ANALYTICS_TASK_STATUS } from '../../../constant/constant'
import TasksTable from './Analytics/TasksTable'

const Analytics = () => {
  const { t } = useTranslation();
  const cardData = [
    { title: t("analytics_total_tasks"), count: 24, iconData: <ClipboardListIcon className='text-white dark:text-gray-900 fill-blue-600 size-10' /> },
    { title: t("analytics_completed"), count: 12, iconData: <div className="flex items-center justify-center size-9 rounded-full bg-[#E9B000]" /> },
    { title: t("analytics_in_progress"), count: 8, iconData: <div className="flex items-center justify-center p-1 rounded-full bg-[#137FEC]"><EllipsisIcon className='size-7 text-white dark:text-gray-900' /></div> },
    { title: t("analytics_blocked"), count: 3, iconData: <CircleAlert className='size-10 text-white dark:text-gray-900 fill-[#EF4444]' /> },
    { title: t("analytics_done"), count: 19, iconData: <div className="flex items-center justify-center p-2 rounded-full bg-[#1BC963]"><Check className='size-5 text-white dark:text-gray-900' /></div> },
  ]

  return (
    <div className="flex flex-col items-center justify-center w-full gap-y-8 p-4">
      
      {/* Top Cards Section */}
      <div className="grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 w-full">
        {cardData.map((item) => (
          <div
            key={item.title}
            className="w-full flex justify-center transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
          >
            <TopCard
              titleColor={"text-[#536782]"}
              countColor={"text-[#000000] dark:text-white"}
              title={item.title}
              count={item.count}
              IconData={item.iconData}
            />
          </div>
        ))}
      </div>

      {/* Completion Progress Section */}
      <div className="flex flex-col w-full gap-6 bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-none py-8 px-6 md:px-10 rounded-xl shadow-[0_4px_20px_0_#00000008]">
        <h1 className="text-[#000000] dark:text-white font-bold text-xl sm:text-2xl">
          {t("analytics_my_completion_progress")}
        </h1>

        <div className="flex flex-col xsm:flex-row items-center justify-center md:justify-start w-full gap-6 md:gap-20 px-2 py-2">
          
          <div className="text-black dark:text-white">
            <CircularProgress
              percentage={(19 / 25) * 100}
              size={180}
              progressColor="#127FEC" 
              trackColor="#E5E7EB"
              label={t("analytics_finished")}
              data="75%"
              textColor="currentColor"
              labelColor="#94A3B8"
              innerBg="bg-white dark:bg-[#1E1E1E]"
            />
          </div>
          
          <h1 className='text-[#636679] dark:text-gray-400 font-bold text-xl'>
            {t("analytics_completion_summary", { completed: 19, total: 25 })}
          </h1>
        </div>
      </div>

      {/* Task Breakdown Section */}
      <div className="w-full">
        <TaskStatusDistribution 
          task={ANALYTICS_TASK_STATUS} 
          percentage={true} 
          showTotal={false} 
          title={t("analytics_task_status_breakdown")} 
          titleColor="text-[#000000] dark:text-white"
        />
      </div>
      
      {/* Table Section */}
      <div className="w-full">
        <TasksTable />
      </div>
    </div>
  );
}

export default Analytics;