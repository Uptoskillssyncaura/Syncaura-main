import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Funnel, Plus, Search } from "lucide-react";
import NotificationRow from "../components/notice/NotificationRow";

import NewNoticeModal from "../components/notice/NewNoticeModel";
import { AnimatePresence, motion } from "framer-motion";
import NoticeFilter from "../components/notice/NoticeFilter";
import Pagination from "../components/common/Pagination";
import { fetchNotices, createNotice, updateNotice, deleteNotice } from "../redux/features/noticeThunks";
import { toast } from "react-toastify";

const Notice = () => {
  const dispatch = useDispatch();
  const { notices, isLoading } = useSelector((state) => state.notice);
  const isdark = useSelector((state) => state.theme.isDark);
  const user = useSelector((state) => state.auth.user);
  const storedUser = (() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();
  const currentUser = user || storedUser;
  const userRole = String(currentUser?.role || "").trim().toLowerCase();
  const canCreateNotice = userRole === "admin" || userRole === "co-admin" || userRole === "coadmin";

  const [showModel, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [noticeData, setNoticeData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  useEffect(() => {
    setNoticeData(notices);
  }, [notices]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(search.toLowerCase()), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedValue, appliedFilters]);

  const filteredNotice = useMemo(() => {
    let result = [...noticeData];
    if (debouncedValue) {
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(debouncedValue) ||
          item.description?.toLowerCase().includes(debouncedValue) ||
          item.category?.toLowerCase().includes(debouncedValue) ||
          item.created_by?.toLowerCase().includes(debouncedValue) ||
          item.creator_user_name?.toLowerCase().includes(debouncedValue)
      );
    }
    if (appliedFilters?.date) {
      const selectedDate = new Date(appliedFilters.date);
      selectedDate.setHours(0, 0, 0, 0);
      result = result.filter((item) => {
        const d = new Date(item.created_at || item.createdAt);
        d.setHours(0, 0, 0, 0);
        return d >= selectedDate;
      });
    }
    if (appliedFilters?.type && appliedFilters.type.toLowerCase() !== "all") {
      const cat = appliedFilters.type.toLowerCase();
      result = result.filter((item) => (item.category || "general").toLowerCase() === cat);
    }
    return result;
  }, [noticeData, debouncedValue, appliedFilters]);

  const totalPages = Math.ceil(filteredNotice.length / PAGE_SIZE) || 1;
  const paginatedNotices = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredNotice.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredNotice, currentPage, PAGE_SIZE]);

  const handleApplyFilters = (newFilters) => setAppliedFilters(newFilters);

  const handleAddNotice = async (formData) => {
    try {
      const res = await dispatch(createNotice(formData)).unwrap();
      toast.success("Notice published successfully");
      return res;
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to publish notice");
      throw err;
    }
  };

  const handleUpdateNotice = async (formData) => {
    try {
      const targetId = editingNotice.id ?? editingNotice._id;
      const res = await dispatch(updateNotice({ id: targetId, formData })).unwrap();
      toast.success("Notice updated successfully");
      return res;
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to update notice");
      throw err;
    }
  };

  const handleDeleteNotice = async (id) => {
    try {
      await dispatch(deleteNotice(id)).unwrap();
      setNoticeData((prev) => prev.filter((n) => (n.id ?? n._id) !== id));
      toast.success("Notice deleted successfully");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to delete notice");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNotice(null);
  };

  const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const itemVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } } };

  return (
    <div className="relative w-full transition-colors duration-500 border-t dark:border-[#000000] h-full bg-[#FFFFFF] dark:bg-black pt-6 pb-24 overflow-y-auto">
      <div className="flex flex-col sm:flex-row items-center justify-center mb-8 border-b border-[#E0DDDD] dark:border-[#575757] pt-3 px-5 pb-2 w-full gap-y-2">
        <h1 className="flex-2/3 flex items-center justify-center sm:justify-start text-2xl font-semibold dark:text-gray-100 text-[#000000] w-full">
          Notice Board Management
        </h1>
        <div className="flex-1/3 flex items-center justify-center sm:justify-end gap-2">
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className={`px-4 py-2 flex items-center justify-center gap-2 border rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              showFilter || appliedFilters
                ? "border-[#2461E6] bg-blue-50 dark:bg-blue-950/40 text-[#2461E6] dark:border-[#73FBFD] dark:text-[#73FBFD]"
                : "border-gray-200 bg-white dark:border-[#2A2A2A] dark:bg-[#121212] text-gray-800 dark:text-gray-200 hover:border-blue-500 dark:hover:border-[#73FBFD]"
            }`}
          >
            <Funnel className="size-4" />
            <span>{appliedFilters ? "Filtered" : "Filter"}</span>
            {appliedFilters && (
              <span className="size-2 rounded-full bg-[#2461E6] dark:bg-[#73FBFD]" />
            )}
          </button>
          <AnimatePresence mode="wait">
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full absolute left-0 top-30 md:top-20 z-100"
              >
                <NoticeFilter
                  currentFilters={appliedFilters}
                  onClose={() => setShowFilter(false)}
                  onApply={handleApplyFilters}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex-3/4 flex col-span-5 items-center w-full gap-x-2 bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2A2A2A] px-3.5 rounded-xl py-2 shadow-xs">
            <Search className="size-4 text-gray-400 dark:text-gray-500 shrink-0" />
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              value={search}
              placeholder="Search notices…"
              className="flex-1 outline-none text-gray-800 dark:text-gray-200 text-sm font-medium placeholder:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-transparent"
            />
          </div>
        </div>
      </div>


      <div className="flex flex-col items-start justify-center w-full">
        <div className="flex items-center justify-start w-full px-2 md:px-10">
          <h1 className="text-2xl text-black dark:text-white font-medium px-2 md:px-5">Latest Updates</h1>
        </div>
        <div className="flex flex-col items-center justify-center w-full px-2 md:px-10 mt-3">
          <motion.div
            className="flex flex-col gap-2 justify-center w-full"
            variants={containerVariants} initial="hidden" animate="show" key={currentPage}
          >
            {isLoading && <p className="text-center text-gray-400 py-4">Loading notices...</p>}
            {!isLoading && filteredNotice.length === 0 && (
              <p className="text-center text-gray-400 py-4">No notices found.</p>
            )}
            {paginatedNotices.map((item, idx) => (
              <motion.div key={item.id ?? item._id} variants={itemVariants}>
                <NotificationRow
                  key={item.id ?? item._id}
                  id={item.id ?? item._id}
                  attachments={item.attachments}
                  about={item.title}
                  title={item.description}
                  category={item.category}
                  creator={item.creator_user_name || item.created_by || "Admin"}
                  creatorId={item.creator_id || item.created_by_id}
                  date={item.created_at || item.createdAt}
                  onEdit={() => { setEditingNotice(item); setShowModal(true); }}
                  onDelete={handleDeleteNotice}
                  bgColor={idx % 3 === 0 ? "bg-red-50" : idx % 3 === 1 ? "bg-purple-50" : "bg-blue-50"}
                  docColor={idx % 3 === 0 ? "text-red-500" : idx % 3 === 1 ? "text-purple-500" : "text-blue-500"}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          <div className="w-full mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredNotice.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
              itemLabel="notices"
            />
          </div>
        </div>
      </div>

      {canCreateNotice && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-8 right-8 flex items-center gap-2 rounded-full bg-blue-600 dark:bg-[#73FBFD] dark:text-black transition duration-500 px-6 py-3 text-white shadow-lg hover:bg-blue-400 dark:hover:bg-[#2cc4c7] btn-hover cursor-pointer"
        >
          <Plus size={18} />
          New Notice
        </button>
      )}
      {showModel && (
        <NewNoticeModal
          onClose={handleCloseModal}
          addNotice={editingNotice ? handleUpdateNotice : handleAddNotice}
          initialData={editingNotice}
        />
      )}
    </div>
  );
};

export default Notice;
