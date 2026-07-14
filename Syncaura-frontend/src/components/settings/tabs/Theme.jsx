import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n/i18n";
import { setTheme as setUiTheme, setFont, setFontSize, setZoom } from "../../../redux/uiSlice";
import { setTheme as setBoolTheme } from "../../../redux/slices/themeSlice";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
];

const Theme = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Default values
  const { theme = "light", font = "Arial", fontSize = "medium", zoom = 100 } =
    useSelector((s) => s.ui || {});

  const [language, setLanguage] = useState(
    (localStorage.getItem("app_language") || i18n.language || "en").substring(0, 2)
  );

  const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);
  const [isSyncingContact, setIsSyncingContact] = useState(false);

  // Language sync
  useEffect(() => {
    const handleLangChange = (e) => {
      setLanguage(e.detail.language.substring(0, 2));
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  // Font apply
  useEffect(() => {
    document.body.style.fontFamily = font;
  }, [font]);

  // Font size apply
  useEffect(() => {
    const scaleMap = {
      small: "0.875",
      medium: "1",
      large: "1.125",
      xlarge: "1.25",
    };
    const scale = scaleMap[fontSize] || "1";
    document.documentElement.style.setProperty("--font-scale", scale);
    document.documentElement.setAttribute("data-fontsize", fontSize);
  }, [fontSize]);

  const handleThemeChange = (e) => {
    const val = e.target.value.toLowerCase();
    dispatch(setUiTheme(val));
    dispatch(setBoolTheme(val === "dark"));
  };

  const handleLanguageChange = (e) => {
    const code = e.target.value;
    setLanguage(code);
    i18n.changeLanguage(code);
  };

  const handleFontChange = (e) => dispatch(setFont(e.target.value));

  const handleFontSizeChange = (e) => {
    const map = {
      Small: "small",
      Medium: "medium",
      Large: "large",
      "Extra Large": "xlarge",
    };
    dispatch(setFontSize(map[e.target.value]));
  };

  const handleZoomDecrease = () =>
    dispatch(setZoom(Math.max(50, zoom - 10)));

  const handleZoomIncrease = () =>
    dispatch(setZoom(Math.min(200, zoom + 10)));

  const handleSyncCalendar = () => {
    setIsSyncingCalendar(true);
    setTimeout(() => {
      setIsSyncingCalendar(false);
      alert(t("syncCalendar") + " ✓");
    }, 1500);
  };

  const handleSyncContact = () => {
    setIsSyncingContact(true);
    setTimeout(() => {
      setIsSyncingContact(false);
      alert(t("syncContact") + " ✓");
    }, 1500);
  };

  const currentLangLabel =
    LANGUAGES.find((l) => l.code === language)?.label || "English";

  return (
    <div className="w-full flex justify-center bg-white dark:bg-[#0B0B0B] min-h-screen text-gray-900 dark:text-white">
      <div className="w-full max-w-[650px]">

        {/* Display */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-white">
            {t("Display")}
          </h2>

          <SettingRow label={t("theme")} value={theme}>
            <select
              value={theme === "dark" ? "Dark" : "Light"}
              onChange={handleThemeChange}
              className="bg-white dark:bg-[#0B0B0B] text-black dark:text-white border border-gray-300 dark:border-[#2A2A2A] px-3 py-1 rounded-md focus:outline-none"
            >
              <option value="Light">{t("light")}</option>
              <option value="Dark">{t("dark")}</option>
            </select>
          </SettingRow>
        </div>

        {/* General */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-white">
            {t("general")}
          </h2>

          <div className="space-y-4">
            <SettingRow label={t("language")} value={currentLangLabel}>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="bg-white dark:bg-[#0B0B0B] text-black dark:text-white border border-gray-300 dark:border-[#2A2A2A] px-3 py-1 rounded-md"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </SettingRow>

            <SettingRow label={t("font")} value={font}>
              <select
                value={font}
                onChange={handleFontChange}
                className="bg-white dark:bg-[#0B0B0B] text-black dark:text-white border border-gray-300 dark:border-[#2A2A2A] px-3 py-1 rounded-md"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Arial">Arial</option>
              </select>
            </SettingRow>

            <SettingRow label={t("fontSize")} value={fontSize}>
              <select
                value={fontSize}
                onChange={handleFontSizeChange}
                className="bg-white dark:bg-[#0B0B0B] text-black dark:text-white border border-gray-300 dark:border-[#2A2A2A] px-3 py-1 rounded-md"
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="Extra Large">Extra Large</option>
              </select>
            </SettingRow>

            {/* ✅ Improved zoom UI */}
            <SettingRow label={t("pageZoom")} value="">
              <div className="flex items-center gap-2">
                <button onClick={handleZoomDecrease} className="px-2 border rounded btn-hover">-</button>
                <span>{zoom}%</span>
                <button onClick={handleZoomIncrease} className="px-2 border rounded btn-hover">+</button>
              </div>
            </SettingRow>
          </div>
        </div>

        {/* Sync */}
        <div>
          <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-white">
            {t("syncingOption")}
          </h2>

          <div className="space-y-4">
            <SyncButton label={t("syncCalendar")} onClick={handleSyncCalendar} isSyncing={isSyncingCalendar} />
            <SyncButton label={t("syncContact")} onClick={handleSyncContact} isSyncing={isSyncingContact} />
          </div>
        </div>

      </div>
    </div>
  );
};

const SettingRow = ({ label, value, children }) => (
  <div className="flex justify-between items-center p-3 border border-gray-300 dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#0B0B0B] text-gray-900 dark:text-white">
    <span className="text-gray-800 dark:text-white">{label}</span>
    <div className="flex gap-3 items-center">
      {value && <span className="text-gray-600 dark:text-gray-300">{value}</span>}
      {children}
    </div>
  </div>
);

const SyncButton = ({ label, onClick, isSyncing }) => (
  <button
    onClick={onClick}
    disabled={isSyncing}
    className="flex justify-between items-center w-full p-3 border border-gray-300 dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#0B0B0B] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#111] btn-hover"
  >
    <span>{label}</span>
    <RefreshCw className={isSyncing ? "animate-spin" : ""} />
  </button>
);

export default Theme;