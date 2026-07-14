import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

const ChangePasswordModal = ({ onClose }) => {
  const { t } = useTranslation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t("allFieldsRequired"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    if (newPassword.length < 8) {
      setError(t("passwordTooShort"));
      return;
    }

    alert(t("passwordChangedSuccess"));

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-xl rounded-[26px] bg-white dark:bg-[#181919] px-10 py-9 shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">
            {t("changePassword")}
          </h2>

          <p className="text-gray-500 mb-6">
            {t("changePasswordDesc")}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 mb-6">
              <PasswordField
                label={t("currentPassword")}
                value={currentPassword}
                setValue={setCurrentPassword}
                show={showCurrent}
                toggle={() => setShowCurrent(!showCurrent)}
              />

              <PasswordField
                label={t("newPassword")}
                value={newPassword}
                setValue={setNewPassword}
                show={showNew}
                toggle={() => setShowNew(!showNew)}
              />

              <PasswordField
                label={t("confirmPassword")}
                value={confirmPassword}
                setValue={setConfirmPassword}
                show={showConfirm}
                toggle={() => setShowConfirm(!showConfirm)}
              />
            </div>

            {error && (
              <p className="text-lg text-red-600 dark:text-red-400 mb-6">
                {error}
              </p>
            )}

            <div className="flex gap-6 mt-9">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-2xl border border-gray-700 text-lg text-gray-700 hover:bg-gray-100 dark:bg-black dark:text-[#73FBFD] dark:border-[#73FBFD] dark:hover:bg-gray-800 transition btn-hover"
              >
                {t("discard")}
              </button>

              <button
                type="submit"
                className="flex-1 py-2.5 rounded-2xl bg-[#2461E6] text-lg text-white font-medium border border-[#2461E6] hover:bg-blue-100 hover:text-[#2461E6] dark:bg-[#73FBFD] dark:text-black dark:border-[#73FBFD] dark:hover:bg-gray-800 transition shadow-sm btn-hover"
              >
                {t("saveChanges")}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const PasswordField = ({ label, value, setValue, show, toggle }) => (
  <div className="flex items-center justify-between">
    <label className="w-[210px] text-lg font-semibold text-black dark:text-white">
      {label}
    </label>

    <div className="relative flex-1">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full h-[45px] px-6 rounded-lg border border-gray-400 bg-white text-black text-base focus:outline-none focus:border-black dark:bg-[#0B0B0B] dark:text-white dark:border-gray-600 dark:focus:border-white transition"
      />

      <button
        type="button"
        onClick={toggle}
        className="absolute right-5 top-1/2 -translate-y-1/2 text-black dark:text-white btn-hover"
      >
        {show ? <Eye size={22} /> : <EyeOff size={22} />}
      </button>
    </div>
  </div>
);

export default ChangePasswordModal;