import { Download, ListFilter, Plus, Search, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocuments, createDocument, updateDocument } from "../redux/features/documentThunks";
import TableRow from "../components/Document/TableRow";
import DocumentModal from "../components/Document/DocumentModel";
import ViewDocumentModal from "../components/Document/ViewDocumentModal";
import VersionHistoryDrawer from "../components/Document/DetailAboutDcument/VersionHistoryDrawer";
import { AnimatePresence, motion } from "framer-motion";
import DocumentFilter from "../components/Document/DocumentFilter";
import Pagination from "../components/common/Pagination";
import api from "../config/axios";
import { toast } from "react-toastify";

export default function Documents() {
  const dispatch = useDispatch();
  const { documents = [], loading = false, error = null } = useSelector((state) => state.documents || {});
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
  const isAdminOrCoAdmin = userRole === "admin" || userRole === "co-admin" || userRole === "coadmin";
  const LOCAL_STORAGE_KEY = "syncaura_uploaded_documents";

  const [localDocs, setLocalDocs] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const tab = ["All Files", "Recent", "Shared with me"];
  const [selectedTab, setSelectedTab] = useState("All Files");
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [currId, setCurrId] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

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

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab, debouncedValue, appliedFilters]);

  const totalPages = Math.ceil(filteredDocuments.length / PAGE_SIZE) || 1;
  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredDocuments.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredDocuments, currentPage, PAGE_SIZE]);

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

    try {
      await dispatch(createDocument({
        title: docData.title,
        content: docData.description,
        category: docData.category,
        type: docData.type,
        file_url: docData.file_url,
        file_name: docData.file_name,
      })).unwrap();
      dispatch(fetchDocuments());
      toast.success("Document uploaded and saved successfully!");
    } catch (err) {
      console.error("Backend sync notice: ", err);
      toast.success("Document saved to current session!");
    }
  };

  const handleUpdateDocument = async (docData) => {
    const targetId = editingDoc?.id || editingDoc?._id;
    if (!targetId) return;

    try {
      await dispatch(updateDocument({
        id: targetId,
        payload: {
          title: docData.title,
          content: docData.description || docData.content,
          category: docData.category,
          type: docData.type,
          status: docData.status || "Active",
        }
      })).unwrap();

      setLocalDocs((prev) => prev.map((d) => ((d.id || d._id) === targetId ? { ...d, ...docData } : d)));
      setEditingDoc(null);
      setShowModal(false);
      dispatch(fetchDocuments());
      toast.success("Document updated successfully!");
    } catch (err) {
      console.error("Update document error:", err);
      toast.error("Failed to update document");
    }
  };

  const handleRestoreVersion = async (versionItem, refetchVersions) => {
    if (!currId) return;
    const confirmed = window.confirm(`Are you sure you want to restore document to version ${versionItem.version}?`);
    if (!confirmed) return;

    try {
      const targetDoc = safeDocuments.find((d) => (d.id || d._id) === currId);
      await dispatch(updateDocument({
        id: currId,
        payload: {
          title: versionItem.title || targetDoc?.title,
          content: versionItem.content || targetDoc?.content,
          category: targetDoc?.category,
          type: targetDoc?.type,
          status: "Active",
        }
      })).unwrap();

      refetchVersions?.();
      dispatch(fetchDocuments());
      toast.success(`Document restored to ${versionItem.version}!`);
    } catch (err) {
      console.error("Restore error:", err);
      toast.error("Failed to restore document version");
    }
  };

  const handleExportAll = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      toast.info("Generating reports export...");
      const res = await api.get("/documents/export/all", { responseType: "blob" });
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `documents_and_reports_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Documents and reports exported successfully!");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to export documents and reports");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative w-full transition-colors duration-500 border-t dark:border-[#000000] h-full bg-[#FFFFFF] dark:bg-black pt-6 pb-24 overflow-y-auto">
      <div className="flex items-center justify-between w-full px-2 sm:px-7">
        <div className="flex items-center justify-start">
          <h1 className="text-[#000000] text-xl lg:text-2xl font-semibold dark:text-[#FFFFFF]">Documents and Report</h1>
        </div>
        <div className="flex items-center justify-end">
          <button
            onClick={handleExportAll}
            disabled={isExporting}
            className="flex items-center justify-center rounded-4xl border gap-2 border-[#2461E6] dark:border-[#73FBFD] px-3 sm:px-5 py-1 sm:py-2 hover:bg-blue-50 dark:hover:bg-cyan-950/30 transition cursor-pointer disabled:opacity-50 btn-hover"
          >
            <Download className="text-[#2457C5] dark:text-[#73FBFD] size-4 sm:size-5" />
            <p className="text-xs sm:text-base font-bold text-[#2457C5] dark:text-[#73FBFD]">
              {isExporting ? "Exporting..." : "Export All"}
            </p>
          </button>
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

          {appliedFilters && (
            <button
              onClick={() => setAppliedFilters(null)}
              className="text-xs font-semibold text-red-500 dark:text-red-400 hover:underline cursor-pointer"
            >
              Clear Filters
            </button>
          )}

          <AnimatePresence mode="wait">
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full absolute left-0 top-16 md:top-45 xl:top-35 z-100"
              >
                <DocumentFilter
                  currentFilters={appliedFilters}
                  onClose={() => setShowFilter(false)}
                  onApply={handleApplyFilters}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex col-span-5 items-center w-full gap-x-2 bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2A2A2A] px-3.5 rounded-xl py-2 shadow-xs">
            <Search className="size-4 text-gray-400 dark:text-gray-500 shrink-0" />
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              value={search}
              placeholder="Search documents..."
              className="flex-1 outline-none text-gray-800 dark:text-gray-200 text-sm font-medium placeholder:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-[99.5%] gap-4 mt-5">

          {/* Table Header */}
          <div className="hidden md:flex items-center w-full border px-10 py-3 border-gray-200 dark:border-gray-700">

            {/* Name */}
            <div className={`${isAdminOrCoAdmin ? "w-[30%]" : "w-[35%]"} flex items-center justify-start`}>
              <h1 className="text-lg text-black dark:text-white font-semibold">
                Name
              </h1>
            </div>

            {/* Type */}
            <div className={`${isAdminOrCoAdmin ? "w-[12%]" : "w-[13%]"} flex items-center justify-start`}>
              <h1 className="text-lg text-black dark:text-white font-semibold">
                Type
              </h1>
            </div>

            {/* Version */}
            <div className={`${isAdminOrCoAdmin ? "w-[10%]" : "w-[11%]"} flex items-center justify-start`}>
              <h1 className="text-lg text-black dark:text-white font-semibold">
                Version
              </h1>
            </div>

            {/* Last Modified */}
            <div className={`${isAdminOrCoAdmin ? "w-[15%]" : "w-[15%]"} flex items-center justify-start`}>
              <h1 className="text-lg text-black dark:text-white font-semibold">
                Last Modified
              </h1>
            </div>

            {/* Status */}
            <div className={`${isAdminOrCoAdmin ? "w-[11%]" : "w-[12%]"} flex items-center justify-center`}>
              <h1 className="text-lg text-black dark:text-white font-semibold">
                Status
              </h1>
            </div>

            {/* Document */}
            <div className={`${isAdminOrCoAdmin ? "w-[14%]" : "w-[14%]"} flex items-center justify-center`}>
              <h1 className="text-lg text-black dark:text-white font-semibold">
                Document
              </h1>
            </div>

            {/* Edit */}
            {isAdminOrCoAdmin && (
              <div className="w-[8%] flex items-center justify-center">
                <h1 className="text-lg text-black dark:text-white font-semibold">
                  Edit
                </h1>
              </div>
            )}

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
          {!loading && !error && filteredDocuments.length === 0 && (
            <p className="text-gray-400 text-center py-10">
              No documents found.
            </p>
          )}

          {/* Document Rows */}
          <div className="flex flex-col items-center justify-center w-full gap-3">
            {paginatedDocuments.map((item, idx) => (
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
                  canEdit={isAdminOrCoAdmin}
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

            {/* Pagination Controls */}
            <div className="w-full mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredDocuments.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
                itemLabel="documents"
              />
            </div>

          </div>

        </div>
      </div>

      {isAdminOrCoAdmin && (
        <button
          onClick={() => {
            setEditingDoc(null);
            setShowModal(true);
          }}
          className="fixed bottom-8 right-8 flex items-center gap-2 rounded-full bg-blue-600 dark:bg-[#73FBFD] dark:text-black transition duration-500 px-6 py-3 text-white shadow-lg hover:bg-blue-500 dark:hover:bg-[#2cc4c7] btn-hover font-semibold cursor-pointer z-20"
        >
          <Upload size={18} />
          <span>Upload Document</span>
        </button>
      )}

      {showModal && (
        <DocumentModal
          initialData={editingDoc}
          addReport={editingDoc ? handleUpdateDocument : handleAddDocument}
          onClose={() => {
            setShowModal(false);
            setEditingDoc(null);
          }}
        />
      )}
      {currId && (
        <VersionHistoryDrawer
          docId={currId}
          document={safeDocuments.find((d) => (d.id || d._id) === currId)}
          open={currId !== null}
          onClose={() => setCurrId(null)}
          onOpenEditor={(doc) => {
            setEditingDoc(doc);
            setShowModal(true);
          }}
          onViewVersion={(versionItem) => {
            const parentDoc = safeDocuments.find((d) => (d.id || d._id) === currId);
            setViewingDoc({
              ...(parentDoc || {}),
              title: versionItem.title || parentDoc?.title || "Document",
              content: versionItem.content || parentDoc?.content,
              description: versionItem.content || parentDoc?.description,
              versions: [{ version: versionItem.version, date: versionItem.date }],
            });
          }}
          onRestoreVersion={handleRestoreVersion}
        />
      )}
      {viewingDoc && (
        <ViewDocumentModal
          document={viewingDoc}
          onClose={() => setViewingDoc(null)}
        />
      )}
    </div>
  );
}
