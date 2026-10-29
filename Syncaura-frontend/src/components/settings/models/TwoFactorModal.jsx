import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

const TwoFactorModal = ({ onClose }) => {
  const [authenticator, setAuthenticator] = useState(true);
  const [phone, setPhone] = useState(false);
  const [email, setEmail] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#181919] p-8"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-gray-500 hover:text-black dark:hover:text-white btn-hover"
          >
            <X size={26} />
          </button>

          <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">
            Two-step Verification
          </h2>

          <p className="text-gray-500 mb-6">
            We recommend requiring a verification code in addition to your password
          </p>

          {/* Toggles */}
          <div className="flex flex-col gap-4 mb-8">

            <ToggleRow
              label="Authenticator app"
              state={authenticator}
              setState={setAuthenticator}
            />

            <ToggleRow
              label="Phone number"
              state={phone}
              setState={setPhone}
            />

            <ToggleRow
              label="Email address"
              state={email}
              setState={setEmail}
            />
          </div>

          {/* QR Section */}
          <div className="flex gap-6">

            <img
              src="/images/qr.png"
              alt="QR Code"
              className="w-36 aspect-square rounded-lg object-cover flex-shrink-0"
            />


              <div>
                <div className="flex items-center justify-between">

                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Enable 2FA
                  </h3>

                  <button className="px-5 py-1.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:border-[#73FBFD] whitespace-nowrap transition btn-hover">
                    View guide
                  </button>

                </div>


              <p className="text-sm text-black mt-4 dark:text-white">
                Scan this QR code from an 2FA authenticator app such as Google Authenticator and enter the 6-digit verification code.
              </p>

              {/* OTP Boxes */}
              <div className="flex gap-2 mt-4">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <input
                    key={idx}
                    maxLength={1}
                    placeholder="0"
                    onChange={(e) => {
                        if (e.target.value && e.target.nextSibling) {
                        e.target.nextSibling.focus();
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Backspace" && !e.target.value && e.target.previousSibling) {
                        e.target.previousSibling.focus();
                        }
                    }}
                    className="w-10 h-10 border border-gray-400 rounded-lg text-center bg-white text-black
                    dark:bg-black dark:border-gray-600 dark:text-white"

                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ToggleRow = ({ label, state, setState }) => (
  <div className="flex items-center gap-4">
    <div
      onClick={() => setState(prev => !prev)}
      className={`w-12 h-6 rounded-full p-1 cursor-pointer transition
        ${state ? "bg-blue-600 dark:bg-[#73FBFD]" : "bg-gray-300 dark:bg-gray-700"}
      `}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full transition
          ${state ? "translate-x-6 dark:bg-black" : ""}
        `}
      />
    </div>

    <span className="text-sm text-black dark:text-gray-300">{label}</span>
  </div>
);

export default TwoFactorModal;
