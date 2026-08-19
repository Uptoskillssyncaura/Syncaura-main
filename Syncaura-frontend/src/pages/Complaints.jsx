import { useEffect, useState, useMemo } from "react";
import {
  Circle,
  CircleAlert,
  CircleCheck,
  Clock,
  Eye,
  Funnel,
  Plus,
  Search,
} from "lucide-react";
import NewComplaintModal from "../components/complaints/NewComplaintModal";
import { COMPLAINTS } from "../constant/constant";
import ComplaintsList from "../components/complaints/ComplaintsList/ComplaintsList";
import Complaintheader from "../components/complaints/complaintHeader/Complaintheader";
import ComplaintSlider from "../components/complaints/ComplaintSlider";

export default function Complaints() {
  const [activeId, setActiveId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchComplaints, setSearchComplaints] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [filterComplaint, setFilterComplaint] = useState(COMPLAINTS);
  const [filters, setFilters] = useState({
    order: "Ascending",
    status: "Resolved",
    date: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(null);
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
    if (status === "in progress") return "bg-[#FEF2C2] text-[#C05328]";
    return "bg-[#D1FAE5] text-[#29CC39]";
  };

  const statusIcon = (status) => {
    if (status === "open")
      return <CircleAlert className="size-4 text-[#C71212] fill-[#FFC2C2]" />;
    if (status === "in progress")
      return <Clock className="size-4 text-[#C05328]   " />;
    return <CircleCheck className="size-4 text-[#29CC39] fill-[#D1FAE5]  " />;
  };
  const filteredComplaints = useMemo(() => {
  let result = [...filterComplaint];

  if (!appliedFilters && !debounceSearch) {
    return result;
  }

  if (debounceSearch) {
    result = result.filter(
      (item) =>
        item.subject.toLowerCase().includes(debounceSearch.toLowerCase()) ||
        item.id.includes(debounceSearch)
    );
  }

  if (appliedFilters) {
    if (appliedFilters.status) {
      result = result.filter(
        (item) => item.status === appliedFilters.status
      );
    }

    if (appliedFilters.date) {
      result = result.filter(
        (item) => item.date === appliedFilters.date
      );
    }

    const getIdNumber = (id) => Number(id.replace("#", ""));
    result.sort((a, b) =>
      appliedFilters.order === "Ascending"
        ? getIdNumber(a.id) - getIdNumber(b.id)
        : getIdNumber(b.id) - getIdNumber(a.id)
    );
  }

  return result;
}, [filterComplaint, appliedFilters, debounceSearch]);


  const handleApplyFilters = (newFilters) => {
    setAppliedFilters(newFilters);
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
        <div className="relative w-full transition-colors duration-500  border-t dark:border-[#000000] h-full bg-[#FFFFFF] dark:bg-[#000000]  pt-6 pb-24 overflow-hidden">
         <Complaintheader
  search={searchComplaints}
  setSearch={setSearchComplaints}
  onApplyFilters={handleApplyFilters}
/>


         <ComplaintsList
  COMPLAINTS={filteredComplaints}
  activeId={activeId}
  setActiveId={setActiveId}
  statusStyle={statusStyle}
  statusIcon={statusIcon}
/>


          <button
            onClick={() => setShowModal(true)}
            className="fixed bottom-8 right-8 flex items-center gap-2
                   rounded-full bg-blue-600 dark:bg-[#73FBFD] dark:text-black transition duration-500 px-6 py-3
                   text-white shadow-lg hover:bg-blue-400 dark:hover:bg-[#2cc4c7]"
          >
            <Plus size={18} />
            New Complaint
          </button>

          {showModal && (
            <NewComplaintModal
              addComplaint={setFilterComplaint}
              onClose={() => setShowModal(false)}
            />
          )}
        </div>
      )}
    </>
  );
}
