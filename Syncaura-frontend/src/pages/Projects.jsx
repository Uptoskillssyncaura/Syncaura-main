import { ChevronDown, ListFilter, Plus } from "lucide-react";
import { useState } from "react";
import Tab from "../components/projects/Tab";
import ProjectCard from "../components/projects/ProjectCard";
import { PROJECTS } from "../constant/constant";
import CreateNewProject from "../components/projects/Model/CreateNewProject";
import { AnimatePresence, motion } from "framer-motion";
import ProjectFilter from "../components/projects/ProjectFilter";

const Projects = () => {
  const [currTab, setCurrTab] = useState("All Projects");
  const [showModel, setShowModel] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [direction, setDirection] = useState(0);

  const tabData = [
    { title: "All Projects", count: PROJECTS.length },
    { title: "Ongoing", count: PROJECTS.filter((item) => item.priority === "Ongoing").length },
    { title: "Completed", count: PROJECTS.filter((item) => item.priority === "Completed").length },
    { title: "On Hold", count: PROJECTS.filter((item) => item.priority === "On Hold").length },
  ];

  const filteredProjects =
    currTab === "All Projects"
      ? PROJECTS
      : PROJECTS.filter((item) => item.priority === currTab);


  const handleApplyFilters = (newFilters) => {
    setAppliedFilters(newFilters);
  };

  const handleTabChange = (tab) => {
    const currentIndex = tabData.findIndex(t => t.title === currTab);
    const nextIndex = tabData.findIndex(t => t.title === tab);

    setDirection(nextIndex > currentIndex ? 1 : -1);
    setCurrTab(tab);
  };


  return (
    <div className="w-full py-5 flex flex-col bg-[#FFFFFF] dark:bg-[#000000] mt-2 dark:mt-1 h-full transition-colors duration-300">
      <div className="px-2 xl:px-6">
        <div className="flex items-center  justify-between px-5 py-2 ">
          <h1 className="font-bold text-3xl text-[#000000] dark:text-[#F8F8F8]">
            Projects
          </h1>
          <button onClick={() => setShowModel(true)} className="px-4 cursor-pointer py-2.5 bg-[#2457C5] dark:bg-[#73FBFD] rounded-3xl flex items-center justify-center gap-2 ">
            <Plus className="text-xl text-[#FFFFFF] dark:text-[#000000] " />
            <h2 className="text-[#FFFFFF] dark:text-[#000000] text-base font-semibold">
              New Project
            </h2>
          </button>
        </div>
        <div className="flex  flex-col gap-4 px-4 py-3 w-full 
                md:flex-row md:items-center md:justify-between">

          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2 justify-center 
                  md:justify-start">
            {tabData.map(({ title, count }, idx) => (
              <Tab
                key={idx}
                name={title}
                count={count}
                curr={currTab}
                setCurr={handleTabChange}
              />
            ))}
          </div>

          {/* Sort & Filter */}
          <div className="flex flex-wrap items-center gap-3 justify-center 
                  md:justify-end">

            {/* Sort */}
            <div className="px-3 py-2 bg-white dark:bg-[#575757]
                    flex items-center gap-2
                    border rounded-xl
                    border-[#EAECEF] dark:border-[#575757]">
              <h1 className="text-sm text-[#082A44] dark:text-[#B2B2B2] font-semibold">
                Sort by: Recent
              </h1>
              <ChevronDown className="size-5 text-[#082A44] dark:text-[#B2B2B2]" />
            </div>

            <button onClick={()=>setShowFilter((prev)=> !prev)} className={`btn-hover px-4 py-2 flex items-center gap-2 border rounded-xl ${showFilter? "border-[#2461E6] dark:border-[#73FBFD] bg-blue-100 dark:bg-gray-950": "border-[#EAECEF] bg-white dark:border-[#575757] dark:bg-[#575757]"} `}>
              <ListFilter className={`size-5  ${showFilter?"text-[#2461E6] dark:text-[#73FBFD]" : "text-[#082A44] dark:text-[#B2B2B2]"} `} />
              <h1 className={`text-sm  ${showFilter?"text-[#2461E6] dark:text-[#73FBFD]" : "text-[#082A44] dark:text-[#B2B2B2]"}  font-semibold`}>
                Filter
              </h1>
            </button>

              
          </div>
        </div>
        <AnimatePresence mode="wait">
                        {showFilter && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="w-full mt-5"
                          >
                            <ProjectFilter
                              onClose={() => setShowFilter(false)}
                              onApply={handleApplyFilters}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

        
      </div>
      <div className="bg-[#FFFFFF] dark:bg-[#000000] mt-5 transition-colors duration-500">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
      key={currTab}
      custom={direction}
      initial={{ x: direction === 1 ? 300 : -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction === 1 ? -300 : 300, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="px-5 py-3 flex flex-wrap items-center justify-center gap-x-14 gap-y-8"
    >
      {filteredProjects.map(
        ({ title, department, priority, progress, dueDate, avatars }, idx) => (
          <ProjectCard
            key={idx}
            title={title}
            department={department}
            priority={priority}
            progress={progress}
            dueDate={dueDate}
            avatars={avatars}
          />
        )
      )}
    </motion.div>
        </AnimatePresence>
        
      </div>
      {showModel && <CreateNewProject onClose={() => setShowModel(false)} />}
    </div>
  );
};

export default Projects;
