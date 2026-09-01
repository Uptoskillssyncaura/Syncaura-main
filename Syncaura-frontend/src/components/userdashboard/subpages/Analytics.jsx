import { Check, CircleAlert, ClipboardListIcon, EllipsisIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import api from '../../../config/axios'
import TopCard from '../TopCard'
import CircularProgress from '../CircularProgress'
import TaskStatusDistribution from '../TaskGraph/TaskStatusDistribution'
import TasksTable from './Analytics/TasksTable'

const Analytics = () => {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/reports/tasks')
      .then(({ data }) => setReport(data))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  const tasks = report?.tasks || []
  const totalTasks = report?.totalTasks || 0
  const completedTasks = report?.completedTasks || 0
  const inProgressTasks = report?.inProgressTasks || 0
  const blockedTasks = tasks.filter((task) => task.status === 'BLOCKED').length
  const completionPercentage = report?.progressPercent ? Math.round(report.progressPercent) : 0
  const cardData = [
    { title: "Total Tasks", count: loading ? '...' : totalTasks, iconData: <ClipboardListIcon className='text-white dark:text-gray-900 fill-blue-600 size-10' /> },
    { title: "Completed", count: loading ? '...' : completedTasks, iconData: <div className="flex items-center justify-center size-9 rounded-full bg-[#E9B000]" /> },
    { title: "in Progress", count: loading ? '...' : inProgressTasks, iconData: <div className="flex items-center justify-center p-1 rounded-full bg-[#137FEC]"><EllipsisIcon className='size-7 text-white dark:text-gray-900' /></div> },
    { title: "Blocked", count: loading ? '...' : blockedTasks, iconData: <CircleAlert className='size-10 text-white dark:text-gray-900 fill-[#EF4444]' /> },
    { title: "Done", count: loading ? '...' : completedTasks, iconData: <div className="flex items-center justify-center p-2 rounded-full bg-[#1BC963]"><Check className='size-5 text-white dark:text-gray-900' /></div> },
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
          My Completion Progress
        </h1>

        <div className="flex flex-col xsm:flex-row items-center justify-center md:justify-start w-full gap-6 md:gap-20 px-2 py-2">
          
          <div className="text-black dark:text-white">
            <CircularProgress
              percentage={completionPercentage}
              size={180}
              progressColor="#127FEC" 
              trackColor="#E5E7EB"
              label="FINISHED"
              data={loading ? '...' : `${completionPercentage}%`}
              textColor="currentColor"
              labelColor="#94A3B8"
              innerBg="bg-white dark:bg-[#1E1E1E]"
            />
          </div>
          
          <h1 className='text-[#636679] dark:text-gray-400 font-bold text-xl'>
            {loading ? 'Loading completion data...' : error || `You have completed ${completedTasks} of ${totalTasks} assigned tasks`}
          </h1>
        </div>
      </div>

      {/* Task Breakdown Section */}
      <div className="w-full">
        <TaskStatusDistribution 
          task={[
            { id: 'done', label: 'Done', count: totalTasks ? `${Math.round((completedTasks / totalTasks) * 100)}%` : '0%', color: '#1BC963' },
            { id: 'in-progress', label: 'In Progress', count: totalTasks ? `${Math.round((inProgressTasks / totalTasks) * 100)}%` : '0%', color: '#137FEC' },
            { id: 'todo', label: 'To Do', count: totalTasks ? `${Math.round(((report?.todoTasks || 0) / totalTasks) * 100)}%` : '0%', color: '#FBB309' },
            { id: 'blocked', label: 'Blocked', count: totalTasks ? `${Math.round((blockedTasks / totalTasks) * 100)}%` : '0%', color: '#EF4444' },
          ]}
          percentage={true} 
          showTotal={false} 
          title="Task Status Breakdown" 
          titleColor="text-[#000000] dark:text-white"
        />
      </div>
      
      {/* Table Section */}
      <div className="w-full">
        <TasksTable tasks={tasks} loading={loading} error={error} />
      </div>
    </div>
  );
}

export default Analytics;