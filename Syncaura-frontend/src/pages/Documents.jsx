import { Download, ListFilter, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocuments, createDocument } from "../redux/features/documentThunks";
import TableRow from "../components/Document/TableRow";
import DocumentModal from "../components/Document/DocumentModel";
import VersionHistoryDrawer from "../components/Document/DetailAboutDcument/VersionHistoryDrawer";
import { AnimatePresence, motion } from "framer-motion";
import DocumentFilter from "../components/Document/DocumentFilter";

export default function Documents() {
  const dispatch = useDispatch();
  const { documents, loading, error } = useSelector((state) => state.documents);

  const tab = ["All Files", "Recent", "Shared with me", "Achived"];
  const [selectedTab, setSelectedTab] = useState("All Files");
  const [showModal, setShowModal] = useState(false);
  const [currId, setCurrId] = useState(null);
  
  const [showFilter, setShowFilter] = useState(false);
  
  const [search, setSearch] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [selectedDocList, setSelectedDocList] = useState([]);

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  useEffect(() => {
    setSelectedDocList(documents.slice(0, 8));
  }, [documents]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(search.toLowerCase());
    }, 400);
    
    return () => clearTimeout(timer);
  }, [search]);

  const parseVersion = (version) => {
    if (!version) return 0;
    return Number(version.replace("v", ""));
  };

  const filteredDocuments = useMemo(() => {
    let result = [...documents];

    if (debouncedValue) {
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(debouncedValue) ||
          item.content?.toLowerCase().includes(debouncedValue)
      );
    }

    if (appliedFilters) {
      const { date } = appliedFilters;
      if (date) {
        const selectedDate = new Date(date);
        result = result.filter(
          (item) => new Date(item.updatedAt) >= selectedDate
        );
      }
    }

    return result;
  }, [documents, debouncedValue, appliedFilters]);

  useEffect(() => {
    setSelectedDocList(filteredDocuments.slice(0, 8));
  }, [filteredDocuments]);

  const handleApplyFilters = (newFilters) => {
    setAppliedFilters(newFilters);
  };

  const handleAddDocument = (docData) => {
    dispatch(createDocument(docData));
  };

  return (
    <div className="relative w-full transition-colors duration-500 border-t dark:border-[#000000] h-full bg-[#FFFFFF] dark:bg-black pt-6 pb-24 overflow-y-auto">
      <div className="flex items-center justify-between w-full px-2 sm:px-7">
        <div className="flex items-center justify-start">
          <h1 className="text-[#000000] text-xl lg:text-2xl font-semibold dark:text-[#FFFFFF]">Documents and Report</h1>
        </div>
        <div className="flex items-center justify-end">
          <div className="flex items-center justify-center rounded-4xl border gap-2 border-[#2461E6] dark:border-[#73FBFD] px-3 sm:px-5 py-1 sm:py-2">
            <Download className="text-[#2457C5] dark:text-[#73FBFD] size-4 sm:size-5" />
            <p className="text-xs sm:text-base font-bold text-[#2457C5] dark:text-[#73FBFD]">Export All</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center xl:justify-between flex-wrap w-full mt-4 gap-y-3">
        <div className="flex items-center justify-center md:justify-start flex-wrap md:flex-nowrap gap-5 px-2 sm:px-7">
          {tab.map((item) => (
            <button
              onClick={() => setSelectedTab(item)}
              key={item}
              className={`btn-hover flex items-center border justify-center py-2 w-32 ${
                selectedTab === item
                  ? "bg-[#EFF6FF] dark:bg-[#344343] border-[#DBEAFE] dark:border-[#73FBFD] text-[#1D6BE3] dark:text-[#73FBFD]"
                  : "border-[#EAECEF] text-[#989696] cursor-pointer"
              } rounded-xl`}
            >
              <h1 className="text-sm font-semibold">{item}</h1>
            </button>
          ))}
        </div>

        <div className="flex items-center relative md:static justify-center md:justify-end flex-nowrap gap-5 px-2 sm:px-7 w-full sm:w-auto">
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className={`btn-hover px-4 py-2 bg-white dark:bg-[#292828] flex items-center gap-2 border rounded-xl ${
              showFilter ? "border-[#2461E6] dark:border-[#73FBFD]" : "border-[#EAECEF] dark:border-[#575757]"
            }`}
          >
            <ListFilter className={`size-5 ${showFilter ? "text-[#2461E6] dark:text-[#73FBFD]" : "text-[#082A44] dark:text-[#B2B2B2]"}`} />
            <h1 className={`text-sm ${showFilter ? "text-[#2461E6] dark:text-[#73FBFD]" : "text-[#082A44] dark:text-[#B2B2B2]"} font-semibold`}>Filter</h1>
          </button>

          <AnimatePresence mode="wait">
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full absolute left-0 top-16 md:top-45 xl:top-35 z-100"
              >
                <DocumentFilter onClose={() => setShowFilter(false)} onApply={handleApplyFilters} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex col-span-5 items-center w-full gap-x-2 bg-[#EDEDED] dark:bg-[#2E2F2F] px-4 rounded-3xl py-2">
            <Search className="size-5 text-gray-500" />
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              value={search}
              placeholder="Search"
              className="flex-1 outline-none text-[#A19C9C] dark:text-[#acabab] text-sm placeholder:text-sm placeholder:text-[#A19C9C] dark:placeholder:text-[#acabab]"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-[99.5%] gap-4 mt-5">
          <div className="hidden md:flex items-center justify-center w-full border px-10 py-3 border-gray-200 dark:border-gray-700">
            <div className="flex-4/13 w-full flex items-center justify-start"><h1 className="text-lg text-[#000000] dark:text-[#FFFFFF] font-semibold">Name</h1></div>
            <div className="flex-2/13 w-full flex items-center justify-start"><h1 className="text-lg text-[#000000] dark:text-[#FFFFFF] font-semibold">Type</h1></div>
            <div className="flex-2/13 w-full flex items-center justify-start"><h1 className="text-lg text-[#000000] dark:text-[#FFFFFF] font-semibold">Version</h1></div>
            <div className="flex-2/13 w-full flex items-center justify-start"><h1 className="text-lg text-[#000000] dark:text-[#FFFFFF] font-semibold">Last Modified</h1></div>
            <div className="flex-2/13 w-full flex items-center justify-center"><h1 className="text-lg text-[#000000] dark:text-[#FFFFFF] font-semibold">Status</h1></div>
            <div className="flex-1/13 w-full flex items-center justify-start" />
          </div>

          {loading && <p className="text-gray-400 text-center py-10">Loading documents...</p>}
          {error && <p className="text-red-400 text-center py-10">Failed to load documents.</p>}
          {!loading && !error && selectedDocList.length === 0 && (
            <p className="text-gray-400 text-center py-10">No documents found.</p>
          )}

          <div className="flex flex-col items-center justify-center w-full gap-3">
            {selectedDocList.map((item, idx) => (
              <div
                onClick={() => setCurrId(item._id || item.id)}
                key={item._id || item.id}
                className={`flex relative transition-all duration-300 items-center justify-between w-full bg-[#FFFFFF] dark:bg-[#000000] py-6 ${
                  currId === (item._id || item.id)
                    ? "bg-blue-50 dark:bg-[#1C3939]"
                    : "hover:bg-[#d1d4db75] dark:hover:bg-gray-800 hover:scale-[1.01] cursor-pointer"
                }`}
              >
                <span className={`absolute left-0 top-0 h-full w-1 bg-blue-500 dark:bg-gray-400 transition-transform duration-300 ${currId === (item._id || item.id) ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"}`} />
                <TableRow
                  name={item.title}
                  type={item.content ? "Document" : "—"}
                  date={item.updatedAt}
                  status="Active"
                  version={item.versions?.length ? `v${item.versions.length}` : "v1"}
                  docColor={idx % 3 === 0 ? "text-[#DC2626]" : idx % 3 === 1 ? "text-[#9333EA]" : "text-[#2563EB]"}
                />
              </div>
            ))}

            {selectedDocList.length < filteredDocuments.length && (
              <div className="w-full flex items-center justify-center mt-4">
                <button
                  onClick={() => {
                    setSelectedDocList((prev) => [
                      ...prev,
                      ...filteredDocuments.slice(prev.length, prev.length + 8),
                    ]);
                  }}
                  className="flex items-center justify-center text-[#C05328] text-xl hover:underline btn-hover"
                >
                  View All Reports and Documents
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 flex items-center gap-2 rounded-full bg-blue-600 dark:bg-[#73FBFD] dark:text-black transition duration-500 px-6 py-3 text-white shadow-lg hover:bg-blue-400 dark:hover:bg-[#2cc4c7] btn-hover"
      >
        <Plus size={18} />
        New Report
      </button>

      {showModal && (
        <DocumentModal addReport={handleAddDocument} onClose={() => setShowModal(false)} />
      )}
      {currId && (
        <VersionHistoryDrawer open={currId !== null} onClose={() => setCurrId(null)} />
      )}
    </div>
  );
}
