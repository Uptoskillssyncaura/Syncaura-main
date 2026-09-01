import { Download, ListFilter, Plus, Search, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocuments, createDocument } from "../redux/features/documentThunks";
import TableRow from "../components/Document/TableRow";
import DocumentModal from "../components/Document/DocumentModel";
import ViewDocumentModal from "../components/Document/ViewDocumentModal";
import VersionHistoryDrawer from "../components/Document/DetailAboutDcument/VersionHistoryDrawer";
import { AnimatePresence, motion } from "framer-motion";
import DocumentFilter from "../components/Document/DocumentFilter";

export default function Documents() {
  const dispatch = useDispatch();
  const { documents = [], loading = false, error = null } = useSelector((state) => state.documents || {});
  const LOCAL_STORAGE_KEY = "syncaura_uploaded_documents";

  const [localDocs, setLocalDocs] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const tab = ["All Files", "Recent", "Shared with me", "Archived"];
  const [selectedTab, setSelectedTab] = useState("All Files");
  const [showModal, setShowModal] = useState(false);
  const [currId, setCurrId] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);

  const [showFilter, setShowFilter] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [selectedDocList, setSelectedDocList] = useState([]);

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  const safeDocuments = useMemo(() => {
    const backendDocs = Array.isArray(documents) ? documents : [];
    const combined = [...localDocs];
    backendDocs.forEach((bDoc) => {
      const bId = bDoc._id || bDoc.id;
      if (!combined.some((lDoc) => (lDoc._id || lDoc.id) === bId)) {
        combined.push(bDoc);
      }
    });
    return combined;
  }, [documents, localDocs]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(search.toLowerCase());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const filteredDocuments = useMemo(() => {
    let result = [...safeDocuments];

    // Filter by Top Tab
    if (selectedTab === "Recent") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      result = result.filter((item) => {
        const itemDate = item.updated_at || item.updatedAt || item.created_at;
        return itemDate ? new Date(itemDate) >= sevenDaysAgo : true;
      });
    } else if (selectedTab === "Shared with me") {
      result = result.filter((item) => item.shared || item.is_shared);
    } else if (selectedTab === "Archived" || selectedTab === "Achived") {
      result = result.filter((item) => item.status === "Archived" || item.is_archived);
    }

    // Filter by Search text
    if (debouncedValue) {
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(debouncedValue) ||
          item.name?.toLowerCase().includes(debouncedValue) ||
          item.content?.toLowerCase().includes(debouncedValue) ||
          item.type?.toLowerCase().includes(debouncedValue) ||
          item.category?.toLowerCase().includes(debouncedValue)
      );
    }

    // Filter by Applied Filters Modal
    if (appliedFilters) {
      const { status, type, version, versionNo, date } = appliedFilters;

      // Date Filter
      if (date) {
        const selectedDate = new Date(date);
        result = result.filter((item) => {
          const itemDate = item.updated_at || item.updatedAt || item.created_at;
          return itemDate ? new Date(itemDate) >= selectedDate : true;
        });
      }

      // Status Filter
      if (status && status !== "All") {
        result = result.filter((item) => {
          const itemStatus = item.status || "Active";
          return itemStatus.toLowerCase() === status.toLowerCase();
        });
      }

      // Type Filter
      if (type && type !== "All") {
        result = result.filter((item) => {
          const itemType = (item.type || item.content || "").toLowerCase();
          const docTitle = (item.title || "").toLowerCase();
          return itemType.includes(type.toLowerCase()) || docTitle.includes(type.toLowerCase());
        });
      }

      // Version & VersionNo Filter
      if (versionNo && versionNo !== "All") {
        const targetVersion = parseFloat(versionNo.replace("v", "")) || 1.0;
        result = result.filter((item) => {
          const docVerCount = item.versions?.length ? item.versions.length : 1.0;
          if (version === "Above") {
            return docVerCount >= targetVersion;
          } else if (version === "Below") {
            return docVerCount <= targetVersion;
          }
          return docVerCount === targetVersion;
        });
      }
    }

    return result;
  }, [safeDocuments, selectedTab, debouncedValue, appliedFilters]);

  useEffect(() => {
    setSelectedDocList(filteredDocuments);
  }, [filteredDocuments]);

  const handleApplyFilters = (newFilters) => {
    setAppliedFilters(newFilters);
  };

  const handleAddDocument = async (docData) => {
    const optimisticId = `doc-${Date.now()}`;
    const newDocItem = {
      _id: optimisticId,
      id: optimisticId,
      title: docData.title || "Uploaded Document",
      name: docData.title || "Uploaded Document",
      type: docData.type || "DOCUMENT",
      category: docData.category || "GENERAL",
      content: docData.description || "",
      description: docData.description || "",
      status: "Active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      attachments: docData.attachments || [],
      file_url: docData.file_url || null,
      file_name: docData.file_name || null,
      versions: docData.versions || [{ version: "v1.0", date: new Date().toISOString() }],
    };

    const updatedLocal = [newDocItem, ...localDocs];
    setLocalDocs(updatedLocal);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedLocal.slice(0, 30)));
    } catch (e) {
      console.warn("Storage limit notice:", e);
    }

    setShowModal(false);
    setSelectedTab("All Files");

    setToast({ show: true, message: "Document uploaded successfully!", type: "success" });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);

    try {
      await dispatch(createDocument({
        title: docData.title,
        content: docData.description,
        category: docData.category,
        type: docData.type,
      })).unwrap();
    } catch (err) {
      console.error("Backend sync notice: ", err);
    }
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
              className={`btn-hover flex items-center border justify-center py-2 w-32 ${selectedTab === item
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
            className={`btn-hover px-4 py-2 bg-white dark:bg-[#292828] flex items-center gap-2 border rounded-xl ${showFilter || appliedFilters ? "border-[#2461E6] dark:border-[#73FBFD]" : "border-[#EAECEF] dark:border-[#575757]"
              }`}
          >
            <ListFilter className={`size-5 ${showFilter || appliedFilters ? "text-[#2461E6] dark:text-[#73FBFD]" : "text-[#082A44] dark:text-[#B2B2B2]"}`} />
            <h1 className={`text-sm ${showFilter || appliedFilters ? "text-[#2461E6] dark:text-[#73FBFD]" : "text-[#082A44] dark:text-[#B2B2B2]"} font-semibold`}>
              {appliedFilters ? "Filter Active" : "Filter"}
            </h1>
          </button>

          {appliedFilters && (
            <button
              onClick={() => setAppliedFilters(null)}
              className="text-xs font-semibold text-red-500 dark:text-red-400 hover:underline btn-hover"
            >
              Clear Filters
            </button>
          )}

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

          {/* Table Header */}
          <div className="hidden md:flex items-center w-full border px-10 py-3 border-gray-200 dark:border-gray-700">

            {/* Name */}
            <div className="w-[30%] flex items-center justify-start">
              <h1 className="text-lg text-black dark:text-white font-semibold">
                Name
              </h1>
            </div>

            {/* Type */}
            <div className="w-[12%] flex items-center justify-start">
              <h1 className="text-lg text-black dark:text-white font-semibold">
                Type
              </h1>
            </div>

            {/* Version */}
            <div className="w-[10%] flex items-center justify-start">
              <h1 className="text-lg text-black dark:text-white font-semibold">
                Version
              </h1>
            </div>

            {/* Last Modified */}
            <div className="w-[15%] flex items-center justify-start">
              <h1 className="text-lg text-black dark:text-white font-semibold">
                Last Modified
              </h1>
            </div>

            {/* Status */}
            <div className="w-[11%] flex items-center justify-center">
              <h1 className="text-lg text-black dark:text-white font-semibold">
                Status
              </h1>
            </div>

            {/* Document */}
            <div className="w-[14%] flex items-center justify-center">
              <h1 className="text-lg text-black dark:text-white font-semibold">
                Document
              </h1>
            </div>

            {/* Edit */}
            <div className="w-[8%] flex items-center justify-center">
              <h1 className="text-lg text-black dark:text-white font-semibold">
                Edit
              </h1>
            </div>

          </div>

          {/* Loading */}
          {loading && (
            <p className="text-gray-400 text-center py-10">
              Loading documents...
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-400 text-center py-10">
              {typeof error === "string" ? error : "Failed to load documents."}
            </p>
          )}

          {/* Empty State */}
          {!loading && !error && (selectedDocList || []).length === 0 && (
            <p className="text-gray-400 text-center py-10">
              No documents found.
            </p>
          )}

          {/* Document Rows */}
          <div className="flex flex-col items-center justify-center w-full gap-3">

            {(selectedDocList || []).map((item, idx) => (
              <div
                onClick={() => setViewingDoc(item)}
                key={item._id || item.id || idx}
                className={`flex relative transition-all duration-300 items-center justify-between w-full bg-[#FFFFFF] dark:bg-[#000000] py-6 ${currId === (item._id || item.id)
                  ? "bg-blue-50 dark:bg-[#1C3939]"
                  : "hover:bg-[#d1d4db75] dark:hover:bg-gray-800 hover:scale-[1.01] cursor-pointer"
                  }`}
              >
                <span
                  className={`absolute left-0 top-0 h-full w-1 bg-blue-500 dark:bg-gray-400 transition-transform duration-300 ${currId === (item._id || item.id)
                    ? "scale-y-100"
                    : "scale-y-0 group-hover:scale-y-100"
                    }`}
                />

                <TableRow
                  name={item.title || item.name || "Untitled"}
                  type={item.type || (item.content ? "Document" : "—")}
                  date={item.updated_at || item.updatedAt || item.created_at}
                  status={item.status || "Active"}
                  version={item.versions?.length ? `v${item.versions.length}` : "v1.0"}
                  document={item.attachments?.[0]?.name || item.file_name || (item.content ? item.title : "View Document")}
                  onView={() => setViewingDoc(item)}
                  onEdit={() => setCurrId(item._id || item.id)}
                  docColor={
                    idx % 3 === 0
                      ? "text-[#DC2626]"
                      : idx % 3 === 1
                        ? "text-[#9333EA]"
                        : "text-[#2563EB]"
                  }
                />
              </div>
            ))}

            {/* View All */}
            {(selectedDocList || []).length < filteredDocuments.length && (
              <div className="w-full flex items-center justify-center mt-4">
                <button
                  onClick={() => {
                    setSelectedDocList((prev) => [
                      ...(prev || []),
                      ...filteredDocuments.slice(
                        (prev || []).length,
                        (prev || []).length + 8
                      ),
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
        className="fixed bottom-8 right-8 flex items-center gap-2 rounded-full bg-blue-600 dark:bg-[#73FBFD] dark:text-black transition duration-500 px-6 py-3 text-white shadow-lg hover:bg-blue-500 dark:hover:bg-[#2cc4c7] btn-hover font-semibold cursor-pointer z-20"
      >
        <Upload size={18} />
        <span>Upload Document</span>
      </button>

      {showModal && (
        <DocumentModal addReport={handleAddDocument} onClose={() => setShowModal(false)} />
      )}
      {currId && (
        <VersionHistoryDrawer open={currId !== null} onClose={() => setCurrId(null)} />
      )}
      {viewingDoc && (
        <ViewDocumentModal
          document={viewingDoc}
          onClose={() => setViewingDoc(null)}
        />
      )}

      {/* Error Toast Notification Banner */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-150 px-6 py-3 rounded-full shadow-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-700 dark:bg-zinc-900 dark:border-[#73FBFD] dark:text-[#73FBFD]"
              : "bg-red-50 border-red-200 text-red-700 dark:bg-zinc-900 dark:border-red-500 dark:text-red-400"
              }`}
          >
            {toast.type === "success" ? "✓" : "⚠️"} {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
