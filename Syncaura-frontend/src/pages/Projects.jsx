import { ChevronDown, ListFilter, Plus, X, Edit3, Eye, Calendar, CheckCircle2, Flag, Tally2, Check, Users, User, Shield } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Tab from "../components/projects/Tab";
import CreateNewProject from "../components/projects/Model/CreateNewProject";
import ProjectCard from "../components/projects/ProjectCard";
import { AnimatePresence, motion } from "framer-motion";
import ProjectFilter from "../components/projects/ProjectFilter";
import Pagination from "../components/common/Pagination";
import { toast } from "react-toastify";
import api from "../config/axios";

const Projects = () => {
  const user = useSelector((state) => state.auth?.user);
  const userRole = (user?.role || localStorage.getItem("role") || "").toLowerCase();
  const isAdmin = userRole === "admin" || userRole === "co-admin" || userRole === "coadmin";
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizeStatus = (status) => {
    if (!status) return "In Progress";
    const s = String(status).trim().toUpperCase().replace(/[\s_-]+/g, "");
    if (s === "COMPLETED" || s === "DONE") return "Completed";
    if (s === "ONHOLD" || s === "HOLD") return "On Hold";
    if (s === "NOTSTARTED") return "Not Started";
    if (s === "PLANNING") return "Planning";
    if (s === "BACKLOG") return "Backlog";
    if (s === "INPROGRESS" || s === "ONGOING" || s === "ACTIVE") return "In Progress";
    if (s === "CRITICAL") return "Critical";
    return status;
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/projects");
      if (Array.isArray(res.data)) {
        const mapped = res.data.map((p) => {
          const normStatus = normalizeStatus(p.status || p.priority);
          return {
            id: p.id,
            title: p.name || p.title,
            department: p.description || p.department || "General",
            priority: normStatus,
            progress: normStatus === "Completed" ? 100 : (p.progress || 0),
            dueDate: p.created_at || new Date().toISOString(),
            owner: p.owner || null,
            members: Array.isArray(p.members) ? p.members : [],
            avatars: Array.isArray(p.members) && p.members.length > 0
              ? p.members.map(m => m.profile_pic).filter(Boolean)
              : [],
          };
        });
        setProjectsList(mapped);
      }
    } catch (err) {
      console.warn("Could not fetch backend projects:", err);
      toast.error(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user?.id, userRole]);

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
    priority: "In Progress",
    progress: 0,
    dueDate: "",
  });

  const tabData = [
    { title: "All Projects", count: projectsList.length },
    {
      title: "In Progress",
      count: projectsList.filter((item) => normalizeStatus(item.priority) === "In Progress").length,
    },
    {
      title: "Not Started",
      count: projectsList.filter((item) => normalizeStatus(item.priority) === "Not Started").length,
    },
    {
      title: "Planning",
      count: projectsList.filter((item) => normalizeStatus(item.priority) === "Planning").length,
    },
    {
      title: "On Hold",
      count: projectsList.filter((item) => normalizeStatus(item.priority) === "On Hold").length,
    },
    {
      title: "Completed",
      count: projectsList.filter((item) => normalizeStatus(item.priority) === "Completed").length,
    },
  ];

  const filteredProjects = projectsList.filter((item) => {
    const itemStatus = normalizeStatus(item.priority);
    if (currTab !== "All Projects") {
      if (currTab === "In Progress" || currTab === "Ongoing") {
        if (itemStatus !== "In Progress") return false;
      } else if (itemStatus !== currTab) {
        return false;
      }
    }
    if (appliedFilters) {
      if (appliedFilters.priority && appliedFilters.priority !== "All") {
        if (item.priority !== appliedFilters.priority && itemStatus !== appliedFilters.priority) return false;
      }
      if (appliedFilters.date) {
        if (!item.dueDate || !item.dueDate.startsWith(appliedFilters.date)) return false;
      }
      if (appliedFilters.team && appliedFilters.team !== "All Members" && appliedFilters.team !== "") {
        if (item.department !== appliedFilters.team) return false;
      }
    }
    return true;
  });

  // Apply sorting algorithm
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "Name (A-Z)") {
      return (a.title || "").localeCompare(b.title || "");
    }
    if (sortBy === "Name (Z-A)") {
      return (b.title || "").localeCompare(a.title || "");
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

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  // Reset pagination on filter, tab, sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [currTab, appliedFilters, sortBy]);

  const totalPages = Math.ceil(sortedProjects.length / PAGE_SIZE) || 1;
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return sortedProjects.slice(startIndex, startIndex + PAGE_SIZE);
  }, [sortedProjects, currentPage, PAGE_SIZE]);

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
  const handleProjectAction = async (actionType, projectData, targetStatus = null) => {
    if (actionType === "view") {
      setSelectedProject(projectData);
      setActiveModal("view");
      if (projectData.id && String(projectData.id).includes("-")) {
        api
          .get(`/projects/${projectData.id}`)
          .then((res) => {
            setSelectedProject((prev) => ({
              ...prev,
              title: res.data.name || prev?.title,
              department: res.data.description || prev?.department,
              priority:
                res.data.status === "COMPLETED"
                  ? "Completed"
                  : res.data.status === "ON_HOLD"
                  ? "On Hold"
                  : res.data.status || prev?.priority,
              owner: res.data.owner || prev?.owner,
              members: res.data.members || prev?.members || [],
            }));
          })
          .catch((err) => {
            console.warn("Failed to fetch fresh project details:", err);
          });
      }
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
      try {
        const res = await api.post("/projects", {
          name: `${projectData.title} (Copy)`,
          description: projectData.department || "",
          status: projectData.priority === "Completed" ? "COMPLETED" : "ACTIVE",
        });
        const duplicated = {
          ...projectData,
          id: res.data.id,
          title: res.data.name || `${projectData.title} (Copy)`,
          priority: res.data.status === "COMPLETED" ? "Completed" : "Ongoing",
          dueDate: res.data.created_at || new Date().toISOString(),
        };
        setProjectsList((prev) => [duplicated, ...prev]);
        toast.success(`Project "${projectData.title}" duplicated!`);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to duplicate project");
      }
    } else if (actionType === "status") {
      const newStatus = targetStatus || (projectData.priority === "Completed" ? "In Progress" : "Completed");
      try {
        if (projectData.id && String(projectData.id).includes("-")) {
          await api.put(`/projects/${projectData.id}`, {
            status: newStatus,
          });
        }
        setProjectsList((prev) =>
          prev.map((p) =>
            p.id === projectData.id
              ? {
                  ...p,
                  priority: newStatus,
                  progress: newStatus === "Completed" ? 100 : p.progress,
                }
              : p
          )
        );
        toast.info(`Updated status for "${projectData.title}" to ${newStatus}`);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to update status");
      }
    } else if (actionType === "delete") {
      try {
        if (projectData.id && String(projectData.id).includes("-")) {
          await api.delete(`/projects/${projectData.id}`);
        }
        setProjectsList((prev) =>
          prev.filter((p) => p.id !== projectData.id)
        );
        toast.warn(`Deleted project "${projectData.title}"`);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete project");
      }
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    try {
      if (selectedProject.id && String(selectedProject.id).includes("-")) {
        await api.put(`/projects/${selectedProject.id}`, {
          name: editFormData.title,
          description: editFormData.department,
          status: editFormData.priority,
        });
      }
      setProjectsList((prev) =>
        prev.map((p) =>
          p.id === selectedProject.id
            ? {
                ...p,
                title: editFormData.title,
                department: editFormData.department,
                priority: editFormData.priority,
                progress: editFormData.priority === "Completed" ? 100 : Number(editFormData.progress),
                dueDate: editFormData.dueDate,
              }
            : p
        )
      );
      toast.success(`Project "${editFormData.title}" updated successfully!`);
      setActiveModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update project");
    }
  };

  return (
    <div className="w-full py-5 flex flex-col bg-[#FFFFFF] dark:bg-[#000000] mt-2 dark:mt-1 min-h-screen transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          <h1 className="font-bold text-2xl sm:text-3xl text-[#000000] dark:text-[#F8F8F8]">
            Projects
          </h1>
          {isAdmin && (
            <button
              onClick={() => setShowModel(true)}
              className="px-4 cursor-pointer py-2.5 bg-[#2457C5] dark:bg-[#73FBFD] rounded-xl flex items-center justify-center gap-2"
            >
              <Plus className="size-5 text-[#FFFFFF] dark:text-[#000000]" />
              <h2 className="text-[#FFFFFF] dark:text-[#000000] text-sm font-semibold">
                New Project
              </h2>
            </button>
          )}
        </div>

        <div
          className="flex flex-col gap-4 py-3 w-full 
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
                className="px-3.5 py-2 bg-white dark:bg-[#121212] flex items-center gap-2 border rounded-xl border-gray-200 dark:border-[#2A2A2A] hover:border-[#2461E6] dark:hover:border-[#73FBFD] transition-colors cursor-pointer text-gray-800 dark:text-gray-200"
              >
                <span className="text-sm font-semibold">
                  Sort: {sortBy}
                </span>
                <ChevronDown className={`size-4 text-gray-500 dark:text-gray-400 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-11 z-50 w-52 bg-white dark:bg-[#181818] border border-gray-200 dark:border-[#2A2A2A] rounded-xl shadow-xl py-1.5 overflow-hidden"
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
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left cursor-pointer transition-colors ${
                          sortBy === option
                            ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-[#73FBFD] font-bold"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#222222]"
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

            {/* Filter Button */}
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className={`px-4 py-2 flex items-center gap-2 border rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                showFilter || appliedFilters
                  ? "border-[#2461E6] bg-blue-50 dark:bg-blue-950/40 text-[#2461E6] dark:border-[#73FBFD] dark:text-[#73FBFD]"
                  : "border-gray-200 bg-white dark:border-[#2A2A2A] dark:bg-[#121212] text-gray-800 dark:text-gray-200 hover:border-blue-500 dark:hover:border-[#73FBFD]"
              }`}
            >
              <ListFilter className="size-4" />
              <span>{appliedFilters ? "Filtered" : "Filter"}</span>
              {appliedFilters && (
                <span className="size-2 rounded-full bg-[#2461E6] dark:bg-[#73FBFD]" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {showFilter && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full mt-4"
            >
              <ProjectFilter
                currentFilters={appliedFilters}
                onClose={() => setShowFilter(false)}
                onApply={handleApplyFilters}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Projects Cards Grid */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-4 pb-12">
        {sortedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-[#111214] rounded-2xl border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
            <p className="text-lg font-semibold">No projects found</p>
            <p className="text-sm mt-1">Try creating a new project or adjusting your filters</p>
          </div>
        ) : (
          <div className="flex flex-col w-full gap-6">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {paginatedProjects.map((project) => (
                  <ProjectCard
                    key={project.id || project.title}
                    id={project.id}
                    title={project.title}
                    department={project.department}
                    priority={project.priority}
                    progress={project.progress}
                    members={project.members}
                    owner={project.owner}
                    avatars={project.avatars}
                    dueDate={project.dueDate}
                    onAction={handleProjectAction}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls */}
            <div className="pt-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={sortedProjects.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
                itemLabel="projects"
              />
            </div>
          </div>
        )}
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
              className="bg-white dark:bg-[#1E1E1E] text-black dark:text-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
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

                {/* Project Owner Section */}
                <div className="bg-gray-50 dark:bg-[#282929] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1.5 mb-2">
                    <User className="size-4 text-blue-600 dark:text-[#73FBFD]" />
                    <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Project Owner</label>
                  </div>
                  {selectedProject.owner ? (
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-blue-600 dark:bg-[#73FBFD] text-white dark:text-black font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                        {(selectedProject.owner.name || selectedProject.owner.email || "U").slice(0, 2)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold truncate text-gray-900 dark:text-white">
                          {selectedProject.owner.name || "Unnamed User"}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="truncate">{selectedProject.owner.email}</span>
                          {selectedProject.owner.role && (
                            <span className="px-1.5 py-0.2 rounded bg-gray-200 dark:bg-[#383a3d] text-[10px] uppercase font-bold text-gray-700 dark:text-gray-300">
                              {selectedProject.owner.role}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">Not specified</p>
                  )}
                </div>

                {/* Assigned Members Section */}
                <div className="bg-gray-50 dark:bg-[#282929] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Users className="size-4 text-blue-600 dark:text-[#73FBFD]" />
                      <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                        Assigned Members
                      </label>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-[#73FBFD]">
                      {selectedProject.members?.length || 0}
                    </span>
                  </div>

                  {selectedProject.members && selectedProject.members.length > 0 ? (
                    <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1 divide-y divide-gray-200/40 dark:divide-gray-700/40">
                      {selectedProject.members.map((member, idx) => {
                        const memberName = typeof member === "object" ? (member.name || member.email) : String(member);
                        const memberEmail = typeof member === "object" ? member.email : "";
                        const memberRole = typeof member === "object" ? member.role : "";
                        const initials = (memberName || "M").slice(0, 2).toUpperCase();

                        return (
                          <div key={member.id || idx} className="flex items-center gap-2.5 pt-2 first:pt-0">
                            <div className="size-7 rounded-full bg-emerald-600/80 dark:bg-[#73FBFD]/30 text-white dark:text-[#73FBFD] font-bold text-[11px] flex items-center justify-center shrink-0">
                              {initials}
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold truncate text-gray-900 dark:text-gray-100">
                                  {memberName}
                                </span>
                                {memberRole && (
                                  <span className="px-1.5 py-0.2 rounded bg-gray-200 dark:bg-[#383a3d] text-[9px] uppercase font-bold text-gray-600 dark:text-gray-300">
                                    {memberRole}
                                  </span>
                                )}
                              </div>
                              {memberEmail && (
                                <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                                  {memberEmail}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic py-1">
                      No members assigned
                    </p>
                  )}
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
                  className="px-5 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
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
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Planning">Planning</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
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
