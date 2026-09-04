import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircleAlert, CircleCheck, Clock, Plus } from "lucide-react";
import NewComplaintModal from "../components/complaints/NewComplaintModal";
import ComplaintsList from "../components/complaints/ComplaintsList/ComplaintsList";
import Complaintheader from "../components/complaints/complaintHeader/Complaintheader";
import ComplaintSlider from "../components/complaints/ComplaintSlider";
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

  const [activeId, setActiveId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchComplaints, setSearchComplaints] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [appliedFilters, setAppliedFilters] = useState(null);

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

  const filteredComplaints = useMemo(() => {
    let result = Array.isArray(complaints) ? [...complaints] : [];
    if (!appliedFilters && !debounceSearch) return result;

    if (debounceSearch) {
      const q = debounceSearch.toLowerCase();
      result = result.filter(
        (item) =>
          (item.title || "").toLowerCase().includes(q) ||
          (item.category || "").toLowerCase().includes(q) ||
          (item.description || "").toLowerCase().includes(q) ||
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
  }, [complaints, appliedFilters, debounceSearch]);

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
      toast.success(`Complaint status updated to ${newStatus}`);
      fetchComplaintsData();
    } catch (err) {
      toast.error(err || "Failed to update complaint status");
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
        <div className="relative w-full transition-colors duration-500 border-t dark:border-[#000000] h-full bg-[#FFFFFF] dark:bg-[#000000] pt-6 pb-24 overflow-hidden">
          <Complaintheader
            search={searchComplaints}
            setSearch={setSearchComplaints}
            onApplyFilters={handleApplyFilters}
            appliedFilters={appliedFilters}
            onResetFilters={handleResetFilters}
          />

          {isLoading && <p className="text-center text-gray-400 py-10">Loading complaints...</p>}
          {error && <p className="text-center text-red-400 py-10">Failed to load complaints.</p>}
          {!isLoading && !error && (
            <ComplaintsList
              COMPLAINTS={filteredComplaints}
              activeId={activeId}
              setActiveId={setActiveId}
              statusStyle={statusStyle}
              statusIcon={statusIcon}
              isAdminOrCoAdmin={isAdminOrCoAdmin}
              onStatusChange={handleStatusChange}
            />
          )}

          <button
            onClick={() => setShowModal(true)}
            className="fixed bottom-8 right-8 flex items-center gap-2 rounded-full bg-blue-600 dark:bg-[#73FBFD] dark:text-black transition duration-300 px-6 py-3 text-white shadow-lg hover:bg-blue-500 dark:hover:bg-[#2cc4c7] btn-hover cursor-pointer z-20"
          >
            <Plus size={18} />
            <span className="font-semibold text-sm">New Complaint</span>
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
