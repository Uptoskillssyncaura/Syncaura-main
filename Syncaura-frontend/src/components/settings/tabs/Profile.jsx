import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  Shield,
  Camera,
  Trash2,
  CheckCircle2,
  ListTodo,
  FolderKanban,
  TrendingUp,
  Lock,
  Mail,
  Phone,
  Globe,
  User as UserIcon,
  Calendar,
  Sparkles,
  ArrowRight,
  Check,
  AlertCircle
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import i18n from "../../../i18n/i18n";
import api from "../../../config/axios";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../../../redux/features/authThunks";
import { updateFrontendProfilePhoto } from "../../../redux/slices/authSlice";

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
  const navigate = useNavigate();
  const { user, profileLoading } = useSelector((state) => state.auth);

  const fileInputRef = useRef(null);
  const [savingField, setSavingField] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Live Activity Stats
  const [stats, setStats] = useState({
    assignedTasks: 0,
    completedTasks: 0,
    activeProjects: 0,
    loading: true,
  });

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
      firstName: profile?.first_name || firstName,
      lastName: profile?.last_name || lastNameParts.join(" "),
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

  // Fetch Live Activity Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats((prev) => ({ ...prev, loading: true }));
        const [tasksRes, projectsRes] = await Promise.allSettled([
          api.get("/tasks"),
          api.get("/projects"),
        ]);

        let assignedCount = 0;
        let completedCount = 0;
        let projectCount = 0;

        if (tasksRes.status === "fulfilled" && tasksRes.value?.data) {
          const tasks = Array.isArray(tasksRes.value.data)
            ? tasksRes.value.data
            : tasksRes.value.data.tasks || [];
          assignedCount = tasks.length;
          completedCount = tasks.filter(
            (t) =>
              t.status?.toLowerCase() === "completed" ||
              t.status?.toLowerCase() === "done"
          ).length;
        }

        if (projectsRes.status === "fulfilled" && projectsRes.value?.data) {
          const projects = Array.isArray(projectsRes.value.data)
            ? projectsRes.value.data
            : projectsRes.value.data.projects || [];
          projectCount = projects.length;
        }

        setStats({
          assignedTasks: assignedCount,
          completedTasks: completedCount,
          activeProjects: projectCount,
          loading: false,
        });
      } catch (err) {
        console.error("Failed to load profile stats:", err);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, [user]);

  const handleEdit = (field) =>
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const buildProfilePayload = () => ({
    first_name: formData.firstName.trim(),
    last_name: formData.lastName.trim(),
    name: `${formData.firstName} ${formData.lastName}`.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    language: formData.language,
  });

  const handleSave = async (field) => {
    try {
      setSavingField(field);

      if (field === "language") {
        await i18n.changeLanguage(formData.language);
      }

      await dispatch(updateUserProfile(buildProfilePayload())).unwrap();

      setIsEditing((prev) => ({
        ...prev,
        [field]: false,
      }));

      toast.success(
        t("notif_profileUpdated") || "Profile updated successfully"
      );
    } catch (err) {
      toast.error(err?.message || err || "Failed to update profile");
    } finally {
      setSavingField(null);
    }
  };

  // Handle Photo Upload
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setIsUploadingPhoto(true);
        const base64Data = reader.result;

        // Update Backend
        await dispatch(
          updateUserProfile({
            ...buildProfilePayload(),
            profile_pic: base64Data,
          })
        ).unwrap();

        // Update Redux photo cache
        dispatch(updateFrontendProfilePhoto(base64Data));
        toast.success("Profile photo updated successfully!");
      } catch (err) {
        console.error("Photo upload error:", err);
        toast.error("Failed to upload photo. Please try again.");
      } finally {
        setIsUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Remove Photo
  const handleRemovePhoto = async () => {
    try {
      setIsUploadingPhoto(true);
      await dispatch(
        updateUserProfile({
          ...buildProfilePayload(),
          profile_pic: "",
        })
      ).unwrap();
      dispatch(updateFrontendProfilePhoto(null));
      toast.info("Profile photo removed.");
    } catch (err) {
      console.error("Failed to remove photo:", err);
      toast.error("Failed to remove photo.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const displayName =
    formData.firstName || formData.lastName
      ? `${formData.firstName} ${formData.lastName}`.trim()
      : user?.name || "User";

  const userInitials = (displayName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const userRole = (user?.role || "user").toUpperCase();
  const avatarImage = user?.profile_pic || user?.profilePic || null;

  const completionRate =
    stats.assignedTasks > 0
      ? Math.round((stats.completedTasks / stats.assignedTasks) * 100)
      : 0;

  const memberSinceYear = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recent";

  const fieldRow = (field, label, icon, type = "text", placeholder = "") => {
    const IconComponent = icon;
    return (
      <div className="flex flex-col sm:flex-row sm:items-center w-full gap-3 sm:gap-4 justify-between bg-gray-50/50 dark:bg-[#111111]/50 p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-[#222222]">
        <div className="flex items-center gap-2.5 w-full sm:w-[150px]">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#2461E6] dark:text-[#73FBFD]">
            <IconComponent className="w-4 h-4" />
          </div>
          <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-left">
            {label}
          </label>
        </div>

        <input
          type={type}
          value={formData[field]}
          placeholder={placeholder || label}
          onChange={(e) => handleChange(field, e.target.value)}
          disabled={!isEditing[field]}
          className="flex-1 sm:max-w-[400px] h-[44px] px-4 border border-gray-300 dark:border-[#2A2A2A] rounded-xl text-sm text-gray-900 dark:text-white bg-white dark:bg-[#0B0B0B]
          focus:outline-none focus:border-[#2461E6] dark:focus:border-[#73FBFD] focus:ring-2 focus:ring-[#2461E6]/10 dark:focus:ring-[#73FBFD]/10
          transition-all duration-200 disabled:bg-gray-100/70 dark:disabled:bg-[#151515] disabled:text-gray-600 dark:disabled:text-gray-400 font-medium"
        />

        <button
          disabled={savingField === field || profileLoading}
          onClick={() =>
            isEditing[field] ? handleSave(field) : handleEdit(field)
          }
          className="w-full sm:w-[84px] h-[38px] px-3 py-1 rounded-xl bg-[#2461E6] text-white border border-[#2461E6] text-xs font-semibold flex items-center justify-center hover:bg-blue-600 dark:bg-[#73FBFD] dark:text-black dark:border-[#73FBFD] dark:hover:bg-[#52d7d9] transition-all shadow-sm cursor-pointer"
        >
          {savingField === field ? (
            <span className="animate-spin text-xs">●</span>
          ) : isEditing[field] ? (
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> {t("save") || "Save"}
            </span>
          ) : (
            t("edit") || "Edit"
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12">
      {/* 1. Main Profile Banner Card */}
      <div className="w-full bg-white dark:bg-[#0B0B0B] border border-gray-200 dark:border-[#2A2A2A] rounded-2xl shadow-sm overflow-hidden">
        {/* Top Decorative Gradient */}
        <div className="h-28 sm:h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Profile Info Header */}
        <div className="px-6 sm:px-8 pb-6 relative pt-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-14 sm:-mt-16 gap-4">
            {/* Avatar with Camera Overlay */}
            <div className="relative group">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoSelect}
                accept="image/*"
                className="hidden"
              />

              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-[#0B0B0B] shadow-xl overflow-hidden bg-white dark:bg-[#111] flex items-center justify-center relative">
                {avatarImage ? (
                  <img
                    src={avatarImage}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#2461E6] dark:bg-[#73FBFD] text-white dark:text-black flex items-center justify-center text-3xl font-bold">
                    {userInitials}
                  </div>
                )}

                {/* Loading overlay during upload */}
                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-medium">
                    Uploading...
                  </div>
                )}
              </div>

              {/* Upload Trigger Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                title="Change profile photo"
                className="absolute bottom-1 right-1 p-2 bg-[#2461E6] dark:bg-[#73FBFD] text-white dark:text-black rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Remove Photo Button (if photo exists) */}
              {avatarImage && !isUploadingPhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  title="Remove photo"
                  className="absolute -top-1 -right-1 p-1.5 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 hover:scale-110 active:scale-95 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => navigate("/settings")}
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-[#333] hover:border-blue-500 dark:hover:border-[#73FBFD] text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-[#151515] transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#2461E6] dark:text-[#73FBFD]" />
                Security & Password
              </button>
              <button
                onClick={() => navigate("/tasks")}
                className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#2461E6] dark:text-[#73FBFD] border border-blue-200 dark:border-blue-800 text-xs sm:text-sm font-semibold flex items-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all cursor-pointer"
              >
                <ListTodo className="w-4 h-4" />
                My Tasks
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* User Details & Badges */}
          <div className="mt-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {displayName}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-[#73FBFD] border border-blue-200 dark:border-blue-800">
                  {userRole}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Shield className="w-3 h-3" />
                  Verified
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-gray-400" />
                {formData.email || user?.email || "No email"}
              </span>
              {formData.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {formData.phone}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                Joined {memberSinceYear}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Activity & Productivity Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Assigned Tasks */}
        <div className="bg-white dark:bg-[#0B0B0B] border border-gray-200 dark:border-[#2A2A2A] rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-medium">Assigned Tasks</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#2461E6] dark:text-[#73FBFD]">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.loading ? "..." : stats.assignedTasks}
            </span>
            <span className="text-xs text-gray-400 ml-2">Total tasks</span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white dark:bg-[#0B0B0B] border border-gray-200 dark:border-[#2A2A2A] rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-medium">Completed</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.loading ? "..." : stats.completedTasks}
            </span>
            <span className="text-xs text-gray-400 ml-2">Finished</span>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white dark:bg-[#0B0B0B] border border-gray-200 dark:border-[#2A2A2A] rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-medium">Projects</span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.loading ? "..." : stats.activeProjects}
            </span>
            <span className="text-xs text-gray-400 ml-2">Active</span>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white dark:bg-[#0B0B0B] border border-gray-200 dark:border-[#2A2A2A] rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-medium">Productivity</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.loading ? "..." : `${completionRate}%`}
            </span>
            <span className="text-xs text-emerald-500 ml-2 font-medium">
              Rate
            </span>
          </div>
        </div>
      </div>

      {/* 3. Account & Personal Details Form Card */}
      <div className="w-full bg-white dark:bg-[#0B0B0B] border border-gray-200 dark:border-[#2A2A2A] rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#2A2A2A] pb-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Personal Information
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Update your personal details and app preferences.
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-[#2461E6] dark:text-[#73FBFD] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Flowbit Profile
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {fieldRow("firstName", t("firstName") || "First Name", UserIcon, "text", "Your first name")}
          {fieldRow("lastName", t("lastName") || "Last Name", UserIcon, "text", "Your last name")}
          {fieldRow("email", t("email") || "Email Address", Mail, "email", "name@company.com")}
          {fieldRow("phone", t("phone") || "Phone Number", Phone, "tel", "+1 (555) 000-0000")}

          {/* Language Selector Row */}
          <div className="flex flex-col sm:flex-row sm:items-center w-full gap-3 sm:gap-4 justify-between bg-gray-50/50 dark:bg-[#111111]/50 p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-[#222222]">
            <div className="flex items-center gap-2.5 w-full sm:w-[150px]">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#2461E6] dark:text-[#73FBFD]">
                <Globe className="w-4 h-4" />
              </div>
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-left">
                {t("language") || "Language"}
              </label>
            </div>

            <div className="flex-1 sm:max-w-[400px] relative w-full">
              {isEditing.language ? (
                <>
                  <select
                    value={formData.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                    className="w-full h-[44px] px-4 border border-gray-300 dark:border-[#2A2A2A] rounded-xl text-sm text-gray-900 dark:text-white bg-white dark:bg-[#0B0B0B]
                    focus:outline-none focus:border-[#2461E6] dark:focus:border-[#73FBFD] focus:ring-2 focus:ring-[#2461E6]/10 dark:focus:ring-[#73FBFD]/10
                    appearance-none transition-all duration-200 font-medium cursor-pointer"
                  >
                    {Object.entries(languageNames).map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="absolute right-[16px] top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
                </>
              ) : (
                <input
                  type="text"
                  value={languageNames[currentLanguageDisplay] || "English"}
                  disabled
                  className="w-full h-[44px] px-4 border border-gray-300 dark:border-[#2A2A2A] rounded-xl text-sm text-gray-900 dark:text-white bg-white dark:bg-[#0B0B0B]
                  disabled:bg-gray-100/70 dark:disabled:bg-[#151515] disabled:text-gray-600 dark:disabled:text-gray-400 font-medium"
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
              className="w-full sm:w-[84px] h-[38px] px-3 py-1 rounded-xl bg-[#2461E6] text-white border border-[#2461E6] text-xs font-semibold flex items-center justify-center hover:bg-blue-600 dark:bg-[#73FBFD] dark:text-black dark:border-[#73FBFD] dark:hover:bg-[#52d7d9] transition-all shadow-sm cursor-pointer"
            >
              {savingField === "language" ? (
                <span className="animate-spin text-xs">●</span>
              ) : isEditing.language ? (
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {t("save") || "Save"}
                </span>
              ) : (
                t("edit") || "Edit"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
