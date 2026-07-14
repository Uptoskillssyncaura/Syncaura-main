import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import i18n from "../../../i18n/i18n";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../../../redux/features/authThunks";

const languageNames = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  hi: "हिंदी",
  zh: "中文",
  ja: "日本語",
};

const Profile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user, profileLoading } = useSelector((state) => state.auth);
  const [savingField, setSavingField] = useState(null);

  const [isEditing, setIsEditing] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    language: false,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    language: (localStorage.getItem("app_language") || "en").substring(0, 2),
  });

  const [currentLanguageDisplay, setCurrentLanguageDisplay] = useState(
    (i18n.language || localStorage.getItem("app_language") || "en").substring(0, 2)
  );

  const getProfileNameParts = (profile) => {
    const fullName = profile?.name || "";
    const [firstName = "", ...lastNameParts] = fullName.trim().split(" ");

    return {
      firstName: profile?.firstName || firstName,
      lastName: profile?.lastName || lastNameParts.join(" "),
    };
  };

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!user) return;

    const nameParts = getProfileNameParts(user);
    const language = (
      user.language ||
      localStorage.getItem("app_language") ||
      "en"
    ).substring(0, 2);

    setFormData((prev) => ({
      ...prev,
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      email: user.email || "",
      phone: user.phone || "",
      language,
    }));
    setCurrentLanguageDisplay(language);
  }, [user]);

  // Sync language across app
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      const clean = lng.substring(0, 2);
      setCurrentLanguageDisplay(clean);
      setFormData((prev) => ({ ...prev, language: clean }));
    };

    const handleCustomEvent = (e) => {
      const clean = e.detail.language.substring(0, 2);
      setCurrentLanguageDisplay(clean);
      setFormData((prev) => ({ ...prev, language: clean }));
    };

    i18n.on("languageChanged", handleLanguageChange);
    window.addEventListener("languageChange", handleCustomEvent);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
      window.removeEventListener("languageChange", handleCustomEvent);
    };
  }, []);

  const handleEdit = (field) =>
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const buildProfilePayload = () => ({
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    name: `${formData.firstName} ${formData.lastName}`.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    language: formData.language,
  });

  const handleSave = async (field) => {
    try {
      setSavingField(field);
      await dispatch(updateUserProfile(buildProfilePayload())).unwrap();

      if (field === "language") {
        i18n.changeLanguage(formData.language);
      }

      setIsEditing((prev) => ({ ...prev, [field]: false }));
      toast.success(t("notif_profileUpdated") || "Profile updated successfully");
    } catch (err) {
      toast.error(err || "Failed to update profile");
    } finally {
      setSavingField(null);
    }
  };

  const fieldRow = (field, type = "text") => (
    <div className="flex items-center">
      <label className="w-[120px] text-[16px] font-normal text-gray-900 dark:text-white text-left mr-[2px]">
        {t(field)}
      </label>

      <input
        type={type}
        value={formData[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        disabled={!isEditing[field]}
        className="w-[385px] h-[54px] px-5 border border-gray-300 dark:border-[#2A2A2A] rounded-xl text-base text-gray-900 dark:text-white bg-white dark:bg-[#0B0B0B]
        focus:outline-none focus:border-[#2461E6] dark:focus:border-[#73FBFD] focus:ring-2 focus:ring-[#2461E6]/10 dark:focus:ring-[#73FBFD]/10
        transition-all duration-200 disabled:bg-gray-50 dark:disabled:bg-[#111] disabled:text-gray-700 dark:disabled:text-gray-400 mr-[28px]"
      />

      <button
        disabled={savingField === field || profileLoading}
        onClick={() =>
          isEditing[field] ? handleSave(field) : handleEdit(field)
        }
        className="w-[72px] px-0 py-1 rounded-full bg-[#2461E6] text-white border border-[#2461E6] text-sm font-normal flex items-center justify-center hover:bg-blue-50 hover:text-[#2461E6] dark:bg-[#73FBFD] dark:text-black dark:border-[#73FBFD] dark:hover:bg-gray-800 dark:hover:text-[#73FBFD] transition-colors shadow-sm btn-hover"
      >
        {savingField === field ? "..." : isEditing[field] ? t("save") : t("edit")}
      </button>
    </div>
  );

  return (
    <div className="w-full">
      {/* Title */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
          {t("profile")}
        </h2>
        <p className="text-sm text-black dark:text-gray-400 mb-7">
          {t("manageProfileSettings")}
        </p>
      </div>

      <div className="w-full max-w-[700px] mx-auto">
        <div className="flex flex-col items-center gap-[28px]">
          {fieldRow("firstName")}
          {fieldRow("lastName")}
          {fieldRow("email", "email")}
          {fieldRow("phone", "tel")}

          {/* Language */}
          <div className="flex items-center">
            <label className="w-[120px] text-[16px] font-normal text-gray-900 dark:text-white text-left mr-[2px]">
              {t("language")}
            </label>

            <div className="w-[385px] relative mr-[28px]">
              {isEditing.language ? (
                <>
                  <select
                    value={formData.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                    className="w-full h-[54px] px-5 border border-gray-300 dark:border-[#2A2A2A] rounded-xl text-base text-gray-900 dark:text-white bg-white dark:bg-[#0B0B0B]
                    focus:outline-none focus:border-[#2461E6] dark:focus:border-[#73FBFD] focus:ring-2 focus:ring-[#2461E6]/10 dark:focus:ring-[#73FBFD]/10
                    appearance-none transition-all duration-200"
                  >
                    {Object.entries(languageNames).map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="absolute right-[20px] top-1/2 -translate-y-1/2 w-5 h-5 text-black dark:text-white pointer-events-none" />
                </>
              ) : (
                <input
                  type="text"
                  value={languageNames[currentLanguageDisplay] || "English"}
                  disabled
                  className="w-full h-[54px] px-5 border border-gray-300 dark:border-[#2A2A2A] rounded-xl text-base text-gray-900 dark:text-white bg-white dark:bg-[#0B0B0B]
                  disabled:bg-gray-50 dark:disabled:bg-[#111] disabled:text-gray-700 dark:disabled:text-gray-400"
                />
              )}
            </div>

            <button
              disabled={savingField === "language" || profileLoading}
              onClick={() =>
                isEditing.language
                  ? handleSave("language")
                  : handleEdit("language")
              }
              className="w-[72px] px-0 py-1 rounded-full bg-[#2461E6] text-white border border-[#2461E6] text-sm font-normal flex items-center justify-center hover:bg-blue-50 hover:text-[#2461E6] dark:bg-[#73FBFD] dark:text-black dark:border-[#73FBFD] dark:hover:bg-gray-800 dark:hover:text-[#73FBFD] transition-colors shadow-sm btn-hover"
            >
              {savingField === "language"
                ? "..."
                : isEditing.language
                  ? t("save")
                  : t("edit")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
