import { motion } from "framer-motion";
import { Mail, User } from "lucide-react"; // You can import more icons if needed

const AnimatedInput = ({
  type = "text", // "email", "text", "password", etc.
  placeholder = "",
  register,
  wrapperRef,
  handleFocus,
  name,
  handleBlur,
  iconType = "mail", // "mail" | "user" | "lock" etc.
  label,
  validation
}) => {
  // Choose icon based on type
  const renderIcon = () => {
    switch (iconType) {
      case "mail":
        return <Mail className="text-black size-6" />;
      case "user":
        return <User className="text-black size-6" />;
      default:
        return null;
    }
  };

  // Fallback to default validation if none is provided
  const rules = validation || {
    required: `${label || name} is required`,
    ...(type === "email"
      ? {
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email",
          },
        }
      : {}),
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 22,
      }}
      className="w-full"
    >
      {/* ref on normal div */}
      <div
        ref={wrapperRef}
        className="bg-[#F8F8F8] w-full px-4 py-2 flex items-center gap-2
        border border-transparent rounded-md transition-all duration-200"
      >
        {renderIcon()}

        <motion.input
          type={type}
          placeholder={placeholder}
          {...register(name, rules)}
          onFocus={() => handleFocus(wrapperRef)}
          onBlur={() => handleBlur(wrapperRef)}
          initial={false}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="text-black text-sm placeholder:text-black bg-transparent outline-none w-full"
        />
      </div>
    </motion.div>
  );
};

export default AnimatedInput;
