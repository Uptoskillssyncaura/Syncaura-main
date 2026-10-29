import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Shield,
  Eye,
  Download,
  Trash2,
  Lock,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const PrivacyData = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);

  const [showOnlineStatus, setShowOnlineStatus] = useState(() => {
    return localStorage.getItem("syncaura_privacy_status") !== "hidden";
  });

  const [shareAnalytics, setShareAnalytics] = useState(true);

  const handleToggleOnline = () => {
    const next = !showOnlineStatus;
    setShowOnlineStatus(next);
    localStorage.setItem(
      "syncaura_privacy_status",
      next ? "visible" : "hidden"
    );
    toast.success("Online status privacy preference updated", { autoClose: 1500 });
  };

  const handleExportData = () => {
    try {
      const exportObject = {
        exportedAt: new Date().toISOString(),
        user: {
          id: user?.id,
          name: user?.name,
          first_name: user?.first_name,
          last_name: user?.last_name,
          email: user?.email,
          role: user?.role,
          created_at: user?.created_at,
        },
        preferences: {
          language: localStorage.getItem("app_language") || "en",
          theme: localStorage.getItem("syncaura_theme") || "system",
        },
      };

      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `flowbit_profile_data_${user?.id || "user"}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast.success("Account data export generated successfully!");
    } catch (err) {
      toast.error("Failed to generate data export.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Privacy Settings Card */}
      <div className="w-full rounded-2xl border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#0B0B0B] p-6 sm:p-8 shadow-sm">
        <div className="border-b border-gray-200 dark:border-[#2A2A2A] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#2461E6] dark:text-[#73FBFD]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("privacyData") || "Privacy & Data Controls"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {t("privacyDataDesc") ||
                  "Control your workspace visibility, data sharing, and export personal archives."}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Online Presence Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-[#222222] bg-gray-50/50 dark:bg-[#111111]/50">
            <div className="flex items-start gap-3.5 pr-4">
              <div className="p-2 rounded-lg bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#2a2a2a] text-gray-700 dark:text-gray-300 mt-0.5">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Display Online Activity Status
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Allow team members in your workspace to see when you are active.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={showOnlineStatus}
              onClick={handleToggleOnline}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                showOnlineStatus
                  ? "bg-[#2461E6] dark:bg-[#73FBFD]"
                  : "bg-gray-200 dark:bg-gray-800"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  showOnlineStatus
                    ? "translate-x-5 dark:bg-black"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Export Data Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-[#222222] bg-gray-50/50 dark:bg-[#111111]/50 gap-4">
            <div className="flex items-start gap-3.5 pr-4">
              <div className="p-2 rounded-lg bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#2a2a2a] text-gray-700 dark:text-gray-300 mt-0.5">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Export Workspace Profile Data
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Download a complete JSON copy of your account profile and preferences.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportData}
              className="px-4 py-2 rounded-xl bg-[#2461E6] text-white hover:bg-blue-600 dark:bg-[#73FBFD] dark:text-black dark:hover:bg-[#52d7d9] text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyData;
