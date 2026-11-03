import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircleAlert, CircleCheck, Clock, Plus, Layers, AlertTriangle, FileText } from "lucide-react";
import NewComplaintModal from "../components/complaints/NewComplaintModal";
import ComplaintsList from "../components/complaints/ComplaintsList/ComplaintsList";
import Complaintheader from "../components/complaints/complaintHeader/Complaintheader";
import ComplaintSlider from "../components/complaints/ComplaintSlider";
import Pagination from "../components/common/Pagination";
import {
  getMyComplaints,
  getAllComplaints,
  createComplaint,
  updateComplaintStatus,
} from "../redux/features/complaintThunks";
import { toast } from "react-toastify";

export default function Complaints() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    // ignore
  }
  const currentUser = user || storedUser;
  const currentRole = (currentUser?.role || "").toLowerCase();
  const isAdminOrCoAdmin =
    currentRole === "admin" || currentRole === "co-admin" || currentRole === "coadmin";

  const { complaints = [], isLoading, error } = useSelector((state) => state.complaint);

  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'task_issues' | 'general'
  const [activeId, setActiveId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchComplaints, setSearchComplaints] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  const fetchComplaintsData = useCallback(() => {
    let active = user;
    if (!active) {
      try {
        active = JSON.parse(localStorage.getItem("user") || "null");
      } catch {
        // ignore
      }
    }
    const role = (active?.role || "").toLowerCase();
    const isAdmin = role === "admin" || role === "co-admin" || role === "coadmin";

    if (isAdmin) {
      dispatch(getAllComplaints());
    } else {
      dispatch(getMyComplaints());
    }
  }, [dispatch, user]);

  useEffect(() => {
    fetchComplaintsData();
  }, [fetchComplaintsData]);

  useEffect(() => {
    if (!searchComplaints.trim()) {
      setDebounceSearch("");
      return;
    }

    const timer = setTimeout(() => {
      setDebounceSearch(searchComplaints.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchComplaints]);

  const statusStyle = (status = "") => {
    const s = String(status).toLowerCase().replace(" ", "-");
    if (s === "open") return "bg-[#FFC2C2] text-[#C71212] border border-[#FFC2C2]/40";
    if (s === "in-progress") return "bg-[#FEF2C2] text-[#C05328] border border-[#FEF2C2]/40";
    if (s === "resolved") return "bg-[#D1FAE5] text-[#29CC39] border border-[#D1FAE5]/40";
    if (s === "closed") return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700";
    return "bg-[#D1FAE5] text-[#29CC39]";
  };

  const statusIcon = (status = "") => {
    const s = String(status).toLowerCase().replace(" ", "-");
    if (s === "open") return <CircleAlert className="size-4 text-[#C71212] fill-[#FFC2C2]" />;
    if (s === "in-progress") return <Clock className="size-4 text-[#C05328]" />;
    if (s === "resolved") return <CircleCheck className="size-4 text-[#29CC39] fill-[#D1FAE5]" />;
    return <CircleCheck className="size-4 text-gray-500" />;
  };

  const isTaskIssue = (item) => {
    if (!item) return false;
    if (item.task_id != null && String(item.task_id).trim() !== "") return true;
    if (Boolean(item.task_title)) return true;
    const cat = String(item.category || "").trim().toUpperCase();
    if (cat === "TASK" || cat === "TASK ISSUE" || cat === "TASK_ISSUE") return true;
    const title = String(item.title || "").trim().toLowerCase();
    if (title.startsWith("issue:") || title.startsWith("issue -") || title.startsWith("[issue]")) return true;
    return false;
  };

  const allItems = Array.isArray(complaints) ? complaints : [];
  const taskIssuesCount = allItems.filter((c) => isTaskIssue(c)).length;
  const generalCount = allItems.filter((c) => !isTaskIssue(c)).length;

  const filteredComplaints = useMemo(() => {
    let result = [...allItems];

    // Tab filter
    if (activeTab === "task_issues") {
      result = result.filter((item) => isTaskIssue(item));
    } else if (activeTab === "general") {
      result = result.filter((item) => !isTaskIssue(item));
    }

    if (debounceSearch) {
      const q = debounceSearch.toLowerCase();
      result = result.filter(
        (item) =>
          (item.title || "").toLowerCase().includes(q) ||
          (item.category || "").toLowerCase().includes(q) ||
          (item.description || "").toLowerCase().includes(q) ||
          (item.task_title || "").toLowerCase().includes(q) ||
          (item.filer_name || "").toLowerCase().includes(q) ||
          (item.filer_email || "").toLowerCase().includes(q) ||
          String(item.id || "").toLowerCase().includes(q)
      );
    }

    if (appliedFilters) {
      if (appliedFilters.status && appliedFilters.status.toLowerCase() !== "all") {
        const targetStatus = appliedFilters.status.toLowerCase().replace(" ", "-");
        result = result.filter(
          (item) => (item.status || "open").toLowerCase().replace(" ", "-") === targetStatus
        );
      }
      if (appliedFilters.date) {
        result = result.filter((item) => (item.created_at || "").startsWith(appliedFilters.date));
      }
      result.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return appliedFilters.order === "Ascending" ? dateA - dateB : dateB - dateA;
      });
    }

    return result;
  }, [allItems, activeTab, appliedFilters, debounceSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, debounceSearch, appliedFilters]);

  const totalPages = Math.ceil(filteredComplaints.length / PAGE_SIZE) || 1;
  const paginatedComplaints = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredComplaints.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredComplaints, currentPage, PAGE_SIZE]);

  const handleApplyFilters = (newFilters) => {
    setAppliedFilters(newFilters);
  };

  const handleResetFilters = () => {
    setAppliedFilters(null);
  };

  const handleAddComplaint = async (complaint) => {
    try {
      const result = await dispatch(createComplaint(complaint)).unwrap();
      toast.success(result.message || "Complaint submitted successfully");
      setShowModal(false);
      fetchComplaintsData();
    } catch (submissionError) {
      toast.error(submissionError || "Unable to submit complaint. Please try again.");
      throw submissionError;
    }
  };

  const handleStatusChange = async (complaintItem, newStatus) => {
    try {
      const id = complaintItem.id || complaintItem._id;
      await dispatch(updateComplaintStatus({ id, status: newStatus })).unwrap();
      toast.success(`Status updated to ${newStatus}`);
      fetchComplaintsData();
    } catch (err) {
      toast.error(err || "Failed to update status");
    }
  };

  return (
    <>
      {activeId ? (
        <ComplaintSlider
          dummyComplaints={filteredComplaints}
          onClose={() => setActiveId(null)}
          idx={activeId}
          isAdminOrCoAdmin={isAdminOrCoAdmin}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="relative w-full transition-colors duration-500 border-t dark:border-[#000000] min-h-full bg-[#FFFFFF] dark:bg-[#000000] pt-6 pb-24 overflow-y-auto">
          <Complaintheader
            search={searchComplaints}
            setSearch={setSearchComplaints}
            onApplyFilters={handleApplyFilters}
            appliedFilters={appliedFilters}
            onResetFilters={handleResetFilters}
            title={isAdminOrCoAdmin ? "Issues & Complaints Management" : "My Issues & Complaints"}
          />

          {/* Quick Filter Tabs */}
          <div className="px-6 mb-5 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer btn-hover ${
                activeTab === "all"
                  ? "bg-blue-600 dark:bg-[#73FBFD] text-white dark:text-black shadow-sm"
                  : "bg-gray-100 dark:bg-[#202124] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2d2f33]"
              }`}
            >
              <Layers className="size-3.5" />
              <span>All</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                  activeTab === "all"
                    ? "bg-white/20 text-white dark:bg-black/20 dark:text-black"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                }`}
              >
                {allItems.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("task_issues")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer btn-hover ${
                activeTab === "task_issues"
                  ? "bg-amber-600 dark:bg-amber-500 text-white dark:text-black shadow-sm"
                  : "bg-gray-100 dark:bg-[#202124] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2d2f33]"
              }`}
            >
              <AlertTriangle className="size-3.5 text-amber-500 dark:text-amber-400" />
              <span>Task Issues</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                  activeTab === "task_issues"
                    ? "bg-white/20 text-white dark:bg-black/20 dark:text-black"
                    : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                }`}
              >
                {taskIssuesCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer btn-hover ${
                activeTab === "general"
                  ? "bg-purple-600 dark:bg-purple-500 text-white dark:text-black shadow-sm"
                  : "bg-gray-100 dark:bg-[#202124] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2d2f33]"
              }`}
            >
              <FileText className="size-3.5 text-purple-500 dark:text-purple-400" />
              <span>General Complaints</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                  activeTab === "general"
                    ? "bg-white/20 text-white dark:bg-black/20 dark:text-black"
                    : "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300"
                }`}
              >
                {generalCount}
              </span>
            </button>
          </div>

          {isLoading && <p className="text-center text-gray-400 py-10">Loading...</p>}
          {error && <p className="text-center text-red-400 py-10">Failed to load complaints and issues.</p>}
          {!isLoading && !error && (
            <div className="flex flex-col w-full">
              <ComplaintsList
                COMPLAINTS={paginatedComplaints}
                activeId={activeId}
                setActiveId={setActiveId}
                statusStyle={statusStyle}
                statusIcon={statusIcon}
                isAdminOrCoAdmin={isAdminOrCoAdmin}
                onStatusChange={handleStatusChange}
              />

              {/* Pagination */}
              <div className="px-6 mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredComplaints.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setCurrentPage}
                  itemLabel="complaints"
                />
              </div>
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="fixed bottom-8 right-8 flex items-center gap-2 rounded-full bg-blue-600 dark:bg-[#73FBFD] dark:text-black transition duration-300 px-6 py-3 text-white shadow-lg hover:bg-blue-500 dark:hover:bg-[#2cc4c7] btn-hover cursor-pointer z-20"
          >
            <Plus size={18} />
            <span className="font-semibold text-sm">Raise Issue / Complaint</span>
          </button>

          {showModal && (
            <NewComplaintModal
              addComplaint={handleAddComplaint}
              onClose={() => setShowModal(false)}
            />
          )}
        </div>
      )}
    </>
  );
}
