import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Funnel, Plus, Search } from "lucide-react";
import RecentActivity from "../components/notice/RecentActivity";
import NotificationRow from "../components/notice/NotificationRow";

import NewNoticeModal from "../components/notice/NewNoticeModel";
import { AnimatePresence, motion } from "framer-motion";
import NoticeFilter from "../components/notice/NoticeFilter";
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
  const [fewNotification, setFewNotification] = useState([]);

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

  useEffect(() => {
    setFewNotification(filteredNotice.slice(0, 7));
  }, [filteredNotice]);

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
            className={`btn-hover flex-1/4 flex items-center justify-center w-full px-5 py-1 gap-2 border rounded-4xl ${showFilter ? "border-[#2461E6] dark:border-[#73FBFD]" : "border-[#989696] dark:border-[#FFFFFF]"}`}
          >
            <Funnel className={`size-5 ${showFilter ? "text-[#2461E6] dark:text-[#73FBFD]" : "text-[#082A44] dark:text-[#B2B2B2]"}`} />
            <span className={`text-lg ${showFilter ? "text-[#2461E6] dark:text-[#73FBFD]" : "text-[#575757] dark:text-[#FFFFFF]"}`}>Filter</span>
          </button>
          <AnimatePresence mode="wait">
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full absolute left-0 top-30 md:top-20 z-100"
              >
                <NoticeFilter onClose={() => setShowFilter(false)} onApply={handleApplyFilters} />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex-3/4 flex col-span-5 items-center w-full gap-x-2 bg-[#EDEDED] dark:bg-[#2E2F2F] px-4 rounded-3xl py-2">
            <Search className="size-5 text-gray-500" />
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text" value={search} placeholder="Search by title, category, publisher…"
              className="flex-1 outline-none text-[#A19C9C] dark:text-[#acabab] text-sm placeholder:text-sm placeholder:text-[#A19C9C] dark:placeholder:text-[#acabab]"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center w-full px-2 sm:px-10">
        <RecentActivity notices={noticeData} />
      </div>

      <div className="flex flex-col items-start justify-center w-full">
        <div className="flex items-center justify-start w-full px-2 md:px-10">
          <h1 className="text-2xl text-black dark:text-white font-medium px-2 md:px-5">Latest Updates</h1>
        </div>
        <div className="flex items-center justify-center w-full px-2 md:px-10 mt-3">
          <motion.div
            className="flex flex-col gap-2 justify-center w-full"
            variants={containerVariants} initial="hidden" animate="show" key={fewNotification.length}
          >
            {isLoading && <p className="text-center text-gray-400 py-4">Loading notices...</p>}
            {!isLoading && fewNotification.length === 0 && (
              <p className="text-center text-gray-400 py-4">No notices found.</p>
            )}
            {fewNotification.map((item, idx) => (
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
            {fewNotification.length !== filteredNotice.length && (
              <div className="w-full flex items-center justify-center mt-4">
                <button
                  onClick={() => setFewNotification((prev) => [...prev, ...filteredNotice.slice(prev.length, prev.length + 7)])}
                  className="flex items-center justify-center text-[#C05328] text-xl hover:underline btn-hover"
                >
                  View All Notices
                </button>
              </div>
            )}
          </motion.div>
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
