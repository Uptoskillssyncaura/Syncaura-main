import { Loader, Moon, Sun } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import PasswordField from "../components/auth/PasswordField";
import { Link, useNavigate } from "react-router-dom";
import AnimatedInput from "../components/auth/AnimatedInput";
import { useSelector, useDispatch } from "react-redux";
import { registerUser } from "../redux/features/authThunks";
import { validationRules } from "../constant/validationRules";
import { handleError, handleSuccess } from "../services/errorHandler";

const SignUp = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.auth);

  const [isDark, setIsDark] = useState(false);

  const userRef = useRef(null);
  const wrapperRef = useRef(null);
  const passRef = useRef(null);
  const conPassRef = useRef(null);

  const t = isDark
    ? {
        pageBg: "#000000",
        leftBg: "#0d0d0d",

        titleColor: "#00e5cc",
        // labelColor: "#ffffff",
        labelColor: "#00e5cc",

        inputBg: "#1e1e1e",
        inputBorder: "#2e2e2e",
        inputText: "#cccccc",
        inputPlaceholder: "#666666",

        btnBg: "#00e5cc",
        btnText: "#000000",

        divColor: "#2e2e2e",
        orColor: "#555555",

        socialBg: "#1e1e1e",
        socialBorder: "#2e2e2e",

        loginMuted: "#888888",
        loginLink: "#00e5cc",

        toggleColor: "#ffffff",

        curveStart: "#00e5cc",
        curveEnd: "#00a896",

        btnShadow: "0 8px 22px rgba(0,229,204,0.4)",
      }
    : {
        pageBg: "#dce3ec",
        leftBg: "#ffffff",

        titleColor: "#2563eb",
        labelColor: "#2563eb",

        inputBg: "#f0f4fb",
        inputBorder: "#dce3ef",
        inputText: "#374151",
        inputPlaceholder: "#9ca3af",

        btnBg: "#2563eb",
        btnText: "#ffffff",

        divColor: "#d1d5db",
        orColor: "#9ca3af",

        socialBg: "#ffffff",
        socialBorder: "#e5e7eb",

        loginMuted: "#6b7280",
        loginLink: "#2563eb",

     toggleColor: "#000000",

        curveStart: "#3b82f6",
        curveEnd: "#1d4ed8",

        btnShadow: "0 8px 22px rgba(37,99,235,0.4)",
      };

  useEffect(() => {
    [userRef, wrapperRef, passRef, conPassRef].forEach((ref) => {
      if (!ref?.current) return;

      ref.current.style.backgroundColor = t.inputBg;
      ref.current.style.borderColor = t.inputBorder;
      ref.current.style.borderRadius = "0px";

      const input = ref.current.querySelector("input");

      if (input) {
        input.style.backgroundColor = t.inputBg;
        input.style.color = t.inputText;
        input.style.borderRadius = "0px";
      }
    });
  }, [isDark]);

  const handleFocus = (ref) => {
    if (!ref?.current) return;

    const c = isDark ? "#00e5cc" : "#0f2b67";

    ref.current.style.borderColor = c;
    ref.current.style.boxShadow = `0 0 0 2px ${c}33`;
  };

  const handleBlur = (ref) => {
    if (!ref?.current) return;

    ref.current.style.borderColor = t.inputBorder;
    ref.current.style.boxShadow = "";
  };

  const onSubmit = async (data) => {
    try {
      // 🚀 SIGNUP API (Aiswarya): Dispatch signup payload to registerUser
      const res = await dispatch(registerUser(data)).unwrap();

      // 🎉 TOASTS (Vedant): Show success notification
      handleSuccess("Account created successfully!");

      switch (res?.role || data?.role) {
        case "Admin":
          navigate("/admin");
          break;

        case "Co-Admin":
          navigate("/co-admin");
          break;

        default:
          navigate("/user-dashboard");
      }
    } catch (err) {
      // ❌ ERROR HANDLING (Vedant): Process backend signup errors
      handleError(err || "Registration failed");
    }
  };

  const onError = (errs) => {
    // ❌ ERROR HANDLING (Vedant): Show first validation error message
    const first = Object.values(errs)[0];
    handleError(first?.message || "Please fix the form errors");
  };

  const socialProviders = [
    {
      id: "google",
      icon: "/images/Auth/google.png",
      alt: "Google",
    },

    {
      id: "github",
      icon: "/images/Auth/github.png",
      alt: "GitHub",
    },

    {
      id: "facebook",
      icon: "/images/Auth/facebook.png",
      alt: "Facebook",
    },
  ];

  // Light mode → Sun icon (you're in light, click to go dark)
  // Dark mode  → Moon icon (you're in dark, click to go light)
  const ThemeIcon = isDark ? Moon : Sun;

  return (
    <div
      style={{ backgroundColor: t.pageBg }}
      className="w-full min-h-screen flex items-center justify-center px-6 py-8 transition-colors duration-500"
    >
      <style>{`
        .su-form input {
          background-color: ${t.inputBg} !important;
          color: ${t.inputText} !important;
          border-color: ${t.inputBorder} !important;
          border-radius: 0px !important;
        }

        .su-form input::placeholder {
          color: ${t.inputPlaceholder} !important;
          opacity: 1;
        }

        .su-form .input-wrapper,
        .su-form [class*="wrapper"],
        .su-form [class*="field-wrap"] {
          background-color: ${t.inputBg} !important;
          border-color: ${t.inputBorder} !important;
          border-radius: 0px !important;
        }

        .su-form label,
        .su-form [class*="label"],
        .su-form [class*="field-label"] {
          color: ${t.labelColor} !important;
        }

        .su-form button[type="submit"] {
          border-radius: 0px !important;
        }

        .su-form .social-btn {
          border-radius: 0px !important;
        }
      `}</style>

      <div
        className="relative w-full"
        style={{ maxWidth: 980 }}
      >
        <motion.div
          className="relative flex flex-col lg:flex-row shadow-2xl overflow-hidden"
          style={{
            minHeight:620,
            background: `linear-gradient(160deg, ${t.curveStart} 0%, ${t.curveEnd} 100%)`,
          }}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 24,
          }}
        >

          {/* ══ CURVE SHAPE ══ */}
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 20,
              pointerEvents: "none",
            }}
            viewBox="0 0 860 600"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="shapeGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={t.curveStart}
                />

                <stop
                  offset="90%"
                  stopColor={t.curveEnd}
                />
              </linearGradient>

              <clipPath id="cardBounds">
                <rect
                  width="860"
                  height="600"
                />
              </clipPath>
            </defs>

            <g clipPath="url(#cardBounds)">

              {/* WHITE AREA */}
              <rect
                x="0"
                y="0"
                width="980"
                height="600"
                fill={t.leftBg}
                style={{ transition: "fill 0.5s" }}
              />

              {/* BIG BLUE CURVE */}
              {/* Desktop */}
<circle
  className="hidden lg:block"
  cx="950"
  cy="-70"
  r="670"
  fill="url(#shapeGrad)"
/>

{/* Mobile */}
<circle
  className="block lg:hidden"
  cx="1103"
  cy="-50"
  r="345"
  fill="url(#shapeGrad)"
/>

              {/* SMALL BOTTOM CIRCLE */}
              <circle
                cx="-20"
                cy="620"
                r="90"
                fill="url(#shapeGrad)"
              />

            </g>
          </svg>

          {/* LEFT SIDE */}
          <div
  className="
    w-full
    lg:w-[40%]
    px-6
    sm:px-8
    lg:px-14
    py-10
    flex
    flex-col
    justify-center
  "
  style={{
    zIndex: 30,
  }}
>

            <h1
              style={{ color: t.titleColor }}
              className="text-3xl font-bold mb-4 text-center"
            >
              Create Account
            </h1>

            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="su-form space-y-2"
            >

              {/* NAME */}
              <div className="flex flex-col gap-1">
                <label
                  style={{ color: t.labelColor }}
                  className="text-sm font-semibold"
                >
                  Full Name
                </label>

                <AnimatedInput
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  iconType="user"
                  register={register}
                  wrapperRef={userRef}
                  handleFocus={handleFocus}
                  handleBlur={handleBlur}
                  validation={validationRules.name}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* EMAIL */}
              <div className="flex flex-col gap-1">
                <label
                  style={{ color: t.labelColor }}
                  className="text-sm font-semibold"
                >
                  Email Address
                </label>

                <AnimatedInput
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  iconType="mail"
                  register={register}
                  wrapperRef={wrapperRef}
                  handleFocus={handleFocus}
                  handleBlur={handleBlur}
                  validation={validationRules.email}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col gap-1">
                <label
                  style={{ color: t.labelColor }}
                  className="text-sm font-semibold"
                >
                  Password
                </label>

                <PasswordField
                  name="password"
                  placeholder="Create a password"
                  register={register}
                  passRef={passRef}
                  handleFocus={handleFocus}
                  handleBlur={handleBlur}
                  validation={validationRules.password}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="flex flex-col gap-1">
                <label
                  style={{ color: t.labelColor }}
                  className="text-sm font-semibold"
                >
                  Confirm Password
                </label>

                <PasswordField
                  name="confirmPassword"
                  placeholder="Confirm password"
                  register={register}
                  passRef={conPassRef}
                  handleFocus={handleFocus}
                  handleBlur={handleBlur}
                  validation={validationRules.confirmPassword(watch("password"))}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* BUTTON */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{
                  scale: 1.02,
                  boxShadow: t.btnShadow,
                }}
                whileTap={{ scale: 0.97 }}
                style={{
                  backgroundColor: t.btnBg,
                  color: t.btnText,
                  borderRadius: "0px",
                }}
                className="w-full mt-3 py-3 font-bold text-sm flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </motion.button>

              {/* OR */}
              <div className="flex items-center gap-3 py-1">
                <span
                  style={{ backgroundColor: t.divColor }}
                  className="flex-1 h-px"
                />

                <span
                  style={{ color: t.orColor }}
                  className="text-xs font-semibold"
                >
                  OR
                </span>

                <span
                  style={{ backgroundColor: t.divColor }}
                  className="flex-1 h-px"
                />
              </div>

              {/* SOCIAL */}
              <div className="flex items-center justify-center gap-3">
                {socialProviders.map((p) => (
                  <motion.button
                    key={p.id}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    style={{
                      backgroundColor: t.socialBg,
                      borderColor: t.socialBorder,
                      borderRadius: "0px",
                    }}
                    className="w-11 h-11 border flex items-center justify-center social-btn"
                  >
                    <img
                      src={p.icon}
                      alt={p.alt}
                      className="w-5 h-5 object-contain"
                    />
                  </motion.button>
                ))}
              </div>

              {/* LOGIN */}
              <div className="flex items-center justify-center gap-1 pt-2">
                <span
                  style={{ color: t.loginMuted }}
                  className="text-sm"
                >
                  Already have an account?
                </span>

                <Link to="/sign-in">
                  <span
                    style={{ color: t.loginLink }}
                    className="text-sm font-bold hover:underline"
                  >
                    Login
                  </span>
                </Link>
              </div>

            </form>
          </div>

          {/* RIGHT SIDE */}
          <div
            style={{ zIndex: 25 }}
                  className="hidden lg:flex flex-1 relative overflow-hidden"
          >

            {/* TOGGLE */}
            <motion.button
              onClick={() => setIsDark((d) => !d)}
              whileHover={{
                scale: 1.15,
                rotate: 15,
              }}
              whileTap={{ scale: 0.9 }}
              style={{ color: t.toggleColor }}
              className="absolute top-5 right-5 z-50"
            >
              <ThemeIcon
                size={22}
                strokeWidth={2}
                 fill={isDark ? "currentColor" : "none"}
              />
            </motion.button>

            {/* IMAGE */}
            <img
              src="/images/Auth/loginHuman.png"
              alt="Sign up illustration"
              draggable={false}
              className="absolute bottom-0 right-0 object-contain select-none"
              style={{
                width: "85%",
                maxWidth: "500px",
                zIndex: 40,
              }}
            />

          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;