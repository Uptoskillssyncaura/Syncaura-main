import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import TwoFactorModal from "../models/TwoFactorModal";
import ChangePasswordModal from "../models/ChangePasswordModal";

const AccountSecurity = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);

  const [twoStep] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <div className="w-full">

      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-7">
       {t("accountSecurity")}
      </h2>

      {/* User Row */}
      <div className="flex items-center justify-between mb-8 w-full px-4 md:px-20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white text-xl font-semibold shadow-sm">
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {user?.name || "User"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email || "No email available"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPasswordModal(true)}
          className="px-8 py-2 rounded-full bg-white text-[#2461E6] border border-[#2461E6] text-sm font-semibold hover:bg-blue-50 hover:text-[#2461E6] dark:bg-black dark:text-[#73FBFD] dark:border-[#73FBFD] dark:hover:bg-gray-800 dark:hover:text-[#73FBFD] transition-colors btn-hover"
        >
          {t("manage")}
        </button>
      </div>

      {/* Two Step Verification */}
      <div className="w-full rounded-xl border border-[#EAECEF] dark:border-[#2A2A2A] bg-white dark:bg-[#0B0B0B] px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">

        {/* Text */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("twoStepVerification")}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("twoStepDesc")}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-10">
            <span className="text-sm text-gray-500 dark:text-gray-300">{t("comingSoon")}</span>

            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("twoStepVerification")}
            </span>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-1 rounded-full bg-[#2461E6] text-white border border-[#2461E6] text-sm font-semibold flex items-center gap-2 hover:bg-blue-50 hover:text-[#2461E6] dark:bg-[#73FBFD] dark:text-black dark:border-[#73FBFD] dark:hover:bg-gray-800 dark:hover:text-[#73FBFD] transition-colors shadow-sm btn-hover"
          >
            {t("learnMore")}
          </button>
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
