import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const PasswordField = ({
  name = "password",
  placeholder = "Password",
  register,
  handleFocus,
  handleBlur,
  passRef,
  validation = {},
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col w-full gap-1">
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className="w-full"
      >
        <div
          ref={passRef}
          className="bg-[#F8F8F8] w-full px-4 py-2 flex items-center gap-2
          border border-transparent rounded-md transition-all duration-200"
        >
          <Lock className="text-black size-6" />

          <motion.input
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            {...register(name, validation)}
            onFocus={() => handleFocus(passRef)}
            onBlur={() => handleBlur(passRef)}
            whileFocus={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="text-black text-sm placeholder:text-black bg-transparent outline-none w-full"
          />

          <motion.div
            onClick={() => setShowPassword((p) => !p)}
            whileTap={{ scale: 0.85 }}
            className="cursor-pointer"
          >
            <AnimatePresence mode="wait">
              {showPassword ? (
                <motion.div
                  key="eye-off"
                  initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 20, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <EyeOff className="text-black size-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="eye-on"
                  initial={{ opacity: 0, rotate: 20, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -20, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Eye className="text-black size-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PasswordField;
