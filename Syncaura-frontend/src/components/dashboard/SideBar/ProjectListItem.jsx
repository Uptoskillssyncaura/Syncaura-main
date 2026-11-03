

const ProjectListItem = ({color, icon, label}) => {
  return (
    <div
              
              className="
                flex items-center gap-3
                w-full py-3
                bg-white dark:bg-[#1A1B1E]  rounded-xl shadow-[0_3px_2px_0_rgba(0,0,0,0.15)] 
                px-4
                hover:shadow-md transition pl-10 xl:pl-15
              "
            >
              <span className={`text-lg xl:text-xl ${color}`}>{icon}</span>
              <span className="text-xs xl:text-sm font-medium text-gray-800 dark:text-gray-500">
                {label}
              </span>
            </div>
  )
}

export default ProjectListItem