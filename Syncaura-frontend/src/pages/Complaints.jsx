import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircleAlert, CircleCheck, Clock, Plus } from "lucide-react";
import NewComplaintModal from "../components/complaints/NewComplaintModal";

import ComplaintsList from "../components/complaints/ComplaintsList/ComplaintsList";
import Complaintheader from "../components/complaints/complaintHeader/Complaintheader";
import ComplaintSlider from "../components/complaints/ComplaintSlider";
import { getMyComplaints, createComplaint } from "../redux/features/complaintThunks";

export default function Complaints() {
  const dispatch = useDispatch();
  const { complaints, isLoading, error } = useSelector((state) => state.complaint);

  const [activeId, setActiveId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchComplaints, setSearchComplaints] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  
  const [appliedFilters, setAppliedFilters] = useState(null);

  useEffect(() => {
    dispatch(getMyComplaints());
  }, [dispatch]);

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

  const statusStyle = (status) => {
    if (status === "open") return "bg-[#FFC2C2] text-[#C71212]";
    if (status === "in-progress") return "bg-[#FEF2C2] text-[#C05328]";
    return "bg-[#D1FAE5] text-[#29CC39]";
  };

  const statusIcon = (status) => {
    if (status === "open") return <CircleAlert className="size-4 text-[#C71212] fill-[#FFC2C2]" />;
    if (status === "in-progress") return <Clock className="size-4 text-[#C05328]" />;
    return <CircleCheck className="size-4 text-[#29CC39] fill-[#D1FAE5]" />;
  };

  const filteredComplaints = useMemo(() => {
    let result = [...complaints];
    if (!appliedFilters && !debounceSearch) return result;

    if (debounceSearch) {
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(debounceSearch.toLowerCase()) ||
          item._id?.includes(debounceSearch)
      );
    }

    if (appliedFilters) {
      if (appliedFilters.status) {
        result = result.filter((item) => item.status === appliedFilters.status);
      }
      if (appliedFilters.date) {
        result = result.filter((item) => item.createdAt?.startsWith(appliedFilters.date));
      }
      result.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return appliedFilters.order === "Ascending" ? dateA - dateB : dateB - dateA;
      });
    }

    return result;
  }, [complaints, appliedFilters, debounceSearch]);

  const handleApplyFilters = (newFilters) => {
    setAppliedFilters(newFilters);
  };

  const handleAddComplaint = (formData) => {
    dispatch(createComplaint(formData));
  };

  return (
    <>
      {activeId ? (
        <ComplaintSlider
          dummyComplaints={filteredComplaints}
          onClose={() => setActiveId(null)}
          idx={activeId}
        />
      ) : (
        <div className="relative w-full transition-colors duration-500 border-t dark:border-[#000000] h-full bg-[#FFFFFF] dark:bg-[#000000] pt-6 pb-24 overflow-hidden">
          <Complaintheader
            search={searchComplaints}
            setSearch={setSearchComplaints}
            onApplyFilters={handleApplyFilters}
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
            />
          )}

          <button
            onClick={() => setShowModal(true)}
            className="fixed bottom-8 right-8 flex items-center gap-2 rounded-full bg-blue-600 dark:bg-[#73FBFD] dark:text-black transition duration-500 px-6 py-3 text-white shadow-lg hover:bg-blue-400 dark:hover:bg-[#2cc4c7] btn-hover"
          >
            <Plus size={18} />
            New Complaint
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
