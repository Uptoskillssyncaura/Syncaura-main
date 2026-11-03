import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  Shield,
  KeyRound,
  Smartphone,
  CheckCircle2,
  Lock,
  UserCheck,
  AlertTriangle,
  History,
  Laptop,
} from "lucide-react";
import TwoFactorModal from "../models/TwoFactorModal";
import ChangePasswordModal from "../models/ChangePasswordModal";

const AccountSecurity = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);

  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const displayName = user?.name || user?.first_name ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.name : "User";
  const userInitials = (displayName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const userRole = (user?.role || "user").toUpperCase();
  const avatarImage = user?.profile_pic || user?.profilePic || null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* 1. Account Summary Card */}
      <div className="w-full rounded-2xl border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#0B0B0B] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              {avatarImage ? (
                <img
                  src={avatarImage}
                  alt={displayName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#2461E6] dark:border-[#73FBFD] shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#2461E6] dark:bg-[#73FBFD] text-white dark:text-black flex items-center justify-center text-xl font-bold shadow-md">
                  {userInitials}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-[#0B0B0B] rounded-full">
                <Shield className="w-4 h-4 text-[#2461E6] dark:text-[#73FBFD]" />
              </div>
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {displayName}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-[#73FBFD] border border-blue-200 dark:border-blue-800">
                  {userRole}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email || "No email available"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-6 py-2.5 rounded-xl bg-[#2461E6] text-white hover:bg-blue-600 dark:bg-[#73FBFD] dark:text-black dark:hover:bg-[#52d7d9] text-sm font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            {t("changePassword") || "Change Password"}
          </button>
        </div>
      </div>

      {/* 2. Security Status & Two-Step Verification */}
      <div className="w-full rounded-2xl border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#0B0B0B] p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {t("accountSecurity") || "Security Preferences"}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your credentials and advanced authentication options.
          </p>
        </div>

        {/* 2FA Card */}
        <div className="p-5 rounded-xl border border-gray-100 dark:border-[#222222] bg-gray-50/50 dark:bg-[#111111]/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#2461E6] dark:text-[#73FBFD] mt-0.5">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                  {t("twoStepVerification") || "Two-Step Verification (2FA)"}
                </h4>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                  {t("recommended") || "Recommended"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
                {t("twoStepDesc") ||
                  "Add an extra layer of security to your Flowbit workspace by requiring an authenticator code."}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2 rounded-xl border border-gray-300 dark:border-[#333] hover:border-blue-500 dark:hover:border-[#73FBFD] text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-semibold hover:bg-white dark:hover:bg-[#181818] transition-all cursor-pointer whitespace-nowrap"
          >
            {t("learnMore") || "Configure 2FA"}
          </button>
        </div>

        {/* Active Session & Device Information */}
        <div className="p-5 rounded-xl border border-gray-100 dark:border-[#222222] bg-gray-50/50 dark:bg-[#111111]/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mt-0.5">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                  Active Session
                </h4>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Current Device
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Connected via Web Browser • JWT Token Authenticated
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Protected
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && <TwoFactorModal onClose={() => setShowModal(false)} />}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

export default AccountSecurity;
