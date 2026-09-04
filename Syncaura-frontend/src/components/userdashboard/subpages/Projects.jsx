import { Check, CircleDot, TrendingDown, TrendingUp, TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../../../config/axios'
import TopCard from '../TopCard'
import { MdFolderShared } from "react-icons/md";
import { TiClipboard } from "react-icons/ti";
import { motion } from "framer-motion";

import ProjectContributionCard from './Project/ProjectContributionCard'
import OverallContextChart from './Project/OverallContextChart'
import ActiveEngagementTable from './Project/ActiveEngagementTable'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([api.get('/projects'), api.get('/tasks')])
      .then(([projectsResponse, tasksResponse]) => {
        // TEMP DEBUG: remove once the empty-projects issue is confirmed fixed.
        const rawTasks = Array.isArray(tasksResponse.data) ? tasksResponse.data : []
        let currentUser = null
        try {
          currentUser = JSON.parse(localStorage.getItem('user'))
        } catch (e) {}
        console.log('[DEBUG] current logged-in user:', currentUser)
        console.log('[DEBUG] /projects response (raw):', projectsResponse.data)
        console.log('[DEBUG] /tasks -> project_id & assigned_to per task:', rawTasks.map(t => ({
          id: t.id,
          title: t.title,
          project_id: t.project_id,
          assigned_to: t.assigned_to,
        })))
        setProjects(Array.isArray(projectsResponse.data) ? projectsResponse.data : [])
        setTasks(rawTasks)
      })
      .catch((requestError) => {
        console.log('[DEBUG] /projects or /tasks failed:', requestError.response?.status, requestError.response?.data)
        setError(requestError.response?.data?.message || 'Unable to load projects')
      })
      .finally(() => setLoading(false))
  }, [])

  const projectStats = projects.map((project) => {
    const projectTasks = tasks.filter((task) => task.project_id === project.id || task.projectId === project.id)
    const completed = projectTasks.filter((task) => task.status === 'DONE').length
    const overdue = projectTasks.some((task) => task.status !== 'DONE' && task.deadline && new Date(task.deadline) < new Date())
    return { ...project, total: projectTasks.length, completed, progress: projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0, overdue }
  })
  const completedProjects = projectStats.filter((project) => project.status === 'COMPLETED' || project.progress === 100).length
  const overdueProjects = projectStats.filter((project) => project.overdue).length
  const cardData = [
    {
      title: "Total Projects",
      count: loading ? '...' : projects.length,
      iconData: <MdFolderShared className='size-8 text-[#99A7BB]' />,
      data: (
        <div className="bg-[#E7F5E9] dark:bg-[#234B1C] py-0.5 px-3 rounded-xl border border-[#C6E7C1] dark:border-none">
          <p className="text-[#2E7D32] dark:text-[#3AFF13] text-[10px] font-bold">
            {loading ? 'Loading...' : 'Current total'}
          </p>
        </div>
      )
    },
    {
      title: "Active",
      count: loading ? '...' : projectStats.filter((project) => project.status !== 'COMPLETED' && project.progress < 100).length,
      iconData: <TiClipboard className='size-8 text-[#0078F5]' />,
      data: (
        <div className="bg-[#E3F2FD] dark:bg-[#1E1E1E] py-0.5 px-3 rounded-xl border border-[#BBDEFB] dark:border-none">
          <p className="text-[#1565C0] dark:text-[#006FEB] text-[10px] font-bold flex gap-2 items-center justify-center">
            <CircleDot className='size-4 text-[#1565C0] dark:text-white fill-[#1565C0] dark:fill-[#006FEB]' /> 
            Current projects
          </p>
        </div>
      )
    },
    {
      title: "Completed",
      count: loading ? '...' : completedProjects,
      iconData: (
        <div className="flex items-center justify-center p-2 rounded-full bg-[#1BC963]">
          <Check className='size-5 text-white dark:text-gray-900' />
        </div>
      ),
      data: (
        <div className="bg-[#E7F5E9] dark:bg-[#234B1C] py-0.5 px-3 rounded-xl border border-[#C6E7C1] dark:border-none">
          <p className="text-[#2E7D32] dark:text-[#3AFF13] text-[10px] font-bold flex gap-2 items-center justify-center">
            <TrendingUp className='size-4 text-[#2E7D32] dark:text-[#00B777]' /> 
            Completed projects
          </p>
        </div>
      )
    },
    {
      title: "Overdue",
      count: loading ? '...' : overdueProjects,
      iconData: (
        <TriangleAlert className='size-10 text-white dark:text-gray-900 fill-[#EF4444]' />
      ),
      data: (
        <div className="bg-[#FFEBEE] dark:bg-[#4B1C1C] py-0.5 px-3 rounded-xl border border-[#FFCDD2] dark:border-none">
          <p className="text-[#C62828] dark:text-[#F63030] text-[10px] font-bold flex gap-2 items-center justify-center">
            <TrendingDown className='size-4 text-[#C62828] dark:text-red-600' /> 
            Overdue projects
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
      {error && <p className="text-sm text-red-500">{error}</p>}
      <ProjectContributionCard projects={projectStats} loading={loading} />
      <OverallContextChart projects={projectStats} loading={loading} />
      <ActiveEngagementTable projects={projectStats} loading={loading} />
    </div>
  )
}

export default Projects