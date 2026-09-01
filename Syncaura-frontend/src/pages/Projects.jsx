import { ChevronDown, ListFilter, Plus, X, Edit3, Eye, Calendar, CheckCircle2, Flag, Tally2, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import Tab from "../components/projects/Tab";
import ProjectCard from "../components/projects/ProjectCard";
import { PROJECTS } from "../constant/constant";
import CreateNewProject from "../components/projects/Model/CreateNewProject";
import { AnimatePresence, motion } from "framer-motion";
import ProjectFilter from "../components/projects/ProjectFilter";
import { toast } from "react-toastify";

const Projects = () => {
  const userRole = useSelector((state) => state.auth?.user?.role);
  const isAdmin = userRole === "admin" || userRole === "co-admin";
  const [projectsList, setProjectsList] = useState(() => {
    const savedProjects = localStorage.getItem("projectsList");
    return savedProjects ? JSON.parse(savedProjects) : PROJECTS;
  });
  useEffect(() => {
    localStorage.setItem("projectsList", JSON.stringify(projectsList));
  }, [projectsList]);
  const [currTab, setCurrTab] = useState("All Projects");
  const [showModel, setShowModel] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [direction, setDirection] = useState(0);

  const handleAddProject = (newProject) => {
    setProjectsList((prev) => [newProject, ...prev]);
  };

  // Sorting state
  const [sortBy, setSortBy] = useState("Recent");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideSort = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };
    if (showSortDropdown) {
      document.addEventListener("mousedown", handleClickOutsideSort);
      document.addEventListener("touchstart", handleClickOutsideSort);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSort);
      document.removeEventListener("touchstart", handleClickOutsideSort);
    };
  }, [showSortDropdown]);

  // Modals state for action menu options
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'view' | 'edit' | null
  const [editFormData, setEditFormData] = useState({
    title: "",
    department: "",
    priority: "Ongoing",
    progress: 0,
    dueDate: "",
  });

  const tabData = [
    { title: "All Projects", count: projectsList.length },
    {
      title: "Ongoing",
      count: projectsList.filter((item) => item.priority === "Ongoing").length,
    },
    {
      title: "Completed",
      count: projectsList.filter((item) => item.priority === "Completed").length,
    },
    {
      title: "On Hold",
      count: projectsList.filter((item) => item.priority === "On Hold").length,
    },
  ];

  const filteredProjects =
    currTab === "All Projects"
      ? projectsList
      : projectsList.filter((item) => item.priority === currTab);

  // Apply sorting algorithm
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "Name (A-Z)") {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === "Name (Z-A)") {
      return b.title.localeCompare(a.title);
    }
    if (sortBy === "Progress (High to Low)") {
      return (b.progress || 0) - (a.progress || 0);
    }
    if (sortBy === "Progress (Low to High)") {
      return (a.progress || 0) - (b.progress || 0);
    }
    if (sortBy === "Due Date") {
      return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
    }
    return 0;
  });

  const handleApplyFilters = (newFilters) => {
    setAppliedFilters(newFilters);
  };

  const handleTabChange = (tab) => {
    const currentIndex = tabData.findIndex((t) => t.title === currTab);
    const nextIndex = tabData.findIndex((t) => t.title === tab);

    setDirection(nextIndex > currentIndex ? 1 : -1);
    setCurrTab(tab);
  };

  // Handle actions triggered from ProjectCard action menu
  const handleProjectAction = (actionType, projectData, targetStatus = null) => {
    if (actionType === "view") {
      setSelectedProject(projectData);
      setActiveModal("view");
    } else if (actionType === "edit") {
      setSelectedProject(projectData);
      setEditFormData({
        title: projectData.title,
        department: projectData.department || "",
        priority: projectData.priority || "Ongoing",
        progress: projectData.progress || 0,
        dueDate: projectData.dueDate || "",
      });
      setActiveModal("edit");
    } else if (actionType === "duplicate") {
      const duplicated = {
        ...projectData,
        title: `${projectData.title} (Copy)`,
        avatars: projectData.avatars || [],
      };
      setProjectsList((prev) => [duplicated, ...prev]);
      toast.success(`Project "${projectData.title}" duplicated!`);
    } else if (actionType === "status") {
      const newStatus = targetStatus || (projectData.priority === "Ongoing" ? "Completed" : "Ongoing");
      setProjectsList((prev) =>
        prev.map((p) =>
          p.title === projectData.title ? { ...p, priority: newStatus } : p
        )
      );
      toast.info(`Updated status for "${projectData.title}" to ${newStatus}`);
    } else if (actionType === "delete") {
      setProjectsList((prev) =>
        prev.filter((p) => p.id !== projectData.id)
      );

      toast.warn(`Deleted project "${projectData.title}"`);
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    setProjectsList((prev) =>
      prev.map((p) =>
        p.title === selectedProject.title
          ? {
            ...p,
            title: editFormData.title,
            department: editFormData.department,
            priority: editFormData.priority,
            progress: Number(editFormData.progress),
            dueDate: editFormData.dueDate,
          }
          : p
      )
    );
    toast.success(`Saved changes for "${editFormData.title}"`);
    setActiveModal(null);
    setSelectedProject(null);
  };

  return (
    <div className="w-full py-5 flex flex-col bg-[#FFFFFF] dark:bg-[#000000] mt-2 dark:mt-1 h-full transition-colors duration-300">
      <div className="px-2 xl:px-6">
        <div className="flex items-center justify-between px-5 py-2">
          <h1 className="font-bold text-3xl text-[#000000] dark:text-[#F8F8F8]">
            Projects
          </h1>
          {isAdmin && (
            <button
              onClick={() => setShowModel(true)}
              className="px-4 cursor-pointer py-2.5 bg-[#2457C5] dark:bg-[#73FBFD] rounded-3xl flex items-center justify-center gap-2"
            >
              <Plus className="text-xl text-[#FFFFFF] dark:text-[#000000]" />
              <h2 className="text-[#FFFFFF] dark:text-[#000000] text-base font-semibold">
                New Project
              </h2>
            </button>
          )}
        </div>

        <div
          className="flex flex-col gap-4 px-4 py-3 w-full 
                md:flex-row md:items-center md:justify-between"
        >
          {/* Tabs */}
          <div
            className="flex flex-wrap items-center gap-2 justify-center 
                  md:justify-start"
          >
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
          <div
            className="flex flex-wrap items-center gap-3 justify-center 
                  md:justify-end"
          >
            {/* Functional Sort Dropdown */}
            <div ref={sortRef} className="relative">
              <button
                type="button"
                onClick={() => setShowSortDropdown((prev) => !prev)}
                className="px-3 py-2 bg-white dark:bg-[#575757] flex items-center gap-2 border rounded-xl border-[#EAECEF] dark:border-[#575757] hover:border-blue-500 dark:hover:border-[#73FBFD] transition-colors cursor-pointer"
              >
                <h1 className="text-sm text-[#082A44] dark:text-[#B2B2B2] font-semibold">
                  Sort by: {sortBy}
                </h1>
                <ChevronDown className={`size-5 text-[#082A44] dark:text-[#B2B2B2] transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-11 z-50 w-52 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-1.5 overflow-hidden"
                  >
                    {[
                      "Recent",
                      "Name (A-Z)",
                      "Name (Z-A)",
                      "Progress (High to Low)",
                      "Progress (Low to High)",
                      "Due Date",
                    ].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSortBy(option);
                          setShowSortDropdown(false);
                          toast.info(`Sorted projects by: ${option}`);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left cursor-pointer transition-colors ${sortBy === option
                          ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-[#73FBFD] font-bold"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
                          }`}
                      >
                        <span>{option}</span>
                        {sortBy === option && <Check className="size-4 text-blue-600 dark:text-[#73FBFD]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className={`btn-hover px-4 py-2 flex items-center gap-2 border rounded-xl ${showFilter ? "border-[#2461E6] dark:border-[#73FBFD] bg-blue-100 dark:bg-gray-950" : "border-[#EAECEF] bg-white dark:border-[#575757] dark:bg-[#575757]"}`}
            >
              <ListFilter
                className={`size-5 ${showFilter ? "text-[#2461E6] dark:text-[#73FBFD]" : "text-[#082A44] dark:text-[#B2B2B2]"}`}
              />
              <h1
                className={`text-sm ${showFilter ? "text-[#2461E6] dark:text-[#73FBFD]" : "text-[#082A44] dark:text-[#B2B2B2]"} font-semibold`}
              >
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
            {sortedProjects.map(
              (
                { id, title, department, priority, progress, dueDate, avatars }) => (
                <ProjectCard
                  key={id}
                  id={id}
                  title={title}
                  department={department}
                  priority={priority}
                  progress={progress}
                  dueDate={dueDate}
                  avatars={avatars}
                  onAction={handleProjectAction}
                />
              )
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Create New Project Modal */}
      {showModel && (
        <CreateNewProject
          onClose={() => setShowModel(false)}
          onAddProject={handleAddProject}
        />
      )}

      {/* View Details Modal */}
      <AnimatePresence>
        {activeModal === "view" && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="bg-white dark:bg-[#1E1E1E] text-black dark:text-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative border border-gray-200 dark:border-gray-800"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="size-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Eye className="size-5 text-blue-500" />
                <h2 className="text-xl font-bold">Project Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Project Title</label>
                  <h3 className="text-lg font-semibold mt-0.5">{selectedProject.title}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Department</label>
                    <p className="text-sm font-medium mt-0.5">{selectedProject.department || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Status / Priority</label>
                    <p className="text-sm font-semibold mt-0.5 text-blue-600 dark:text-[#73FBFD]">{selectedProject.priority}</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Progress</label>
                    <span className="text-xs font-bold">{selectedProject.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${selectedProject.progress}%` }}
                      className="h-full bg-blue-600 dark:bg-[#73FBFD] rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Due Date</label>
                  <p className="text-sm font-medium mt-0.5">{selectedProject.dueDate || "Not specified"}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Project Modal */}
      <AnimatePresence>
        {activeModal === "edit" && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="bg-white dark:bg-[#1E1E1E] text-black dark:text-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative border border-gray-200 dark:border-gray-800"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="size-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Edit3 className="size-5 text-emerald-500" />
                <h2 className="text-xl font-bold">Edit Project</h2>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={editFormData.department}
                    onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Status / Priority</label>
                    <select
                      value={editFormData.priority}
                      onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500"
                    >
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Progress (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editFormData.progress}
                      onChange={(e) => setEditFormData({ ...editFormData, progress: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Due Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 2026-11-30"
                    value={editFormData.dueDate}
                    onChange={(e) => setEditFormData({ ...editFormData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 dark:bg-[#73FBFD] dark:text-black text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
