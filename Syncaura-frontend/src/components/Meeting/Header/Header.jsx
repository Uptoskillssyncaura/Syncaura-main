import ToggleSwitch from "../../dashboard/Header/ToggleSwitch";
import { useSelector } from "react-redux";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import MyProfileModal from "../../profile/MyProfileModal";

const Header = ({ setOpen, open }) => {
  const { t, i18n } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const getRoleName = () => {
    switch (user?.role?.toLowerCase()) {
      case "admin":
        return "Admin";

      case "co-admin":
      case "co_admin":
        return "Co-Admin";

      case "user":
        return "User";

      default:
        return "User";
    }
  };

  const today = new Date();

  const formattedDate = today.toLocaleDateString(i18n.language || "en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const dayName = today.toLocaleDateString(i18n.language || "en", {
    weekday: "long",
  });

  return (
    <div className="text-black py-3 bg-[#FFFFFF] dark:bg-[#2E2F2F] shadow-[0_10px_20px_-10px_rgba(0,0,0,0.25)] w-full flex items-center justify-end z-50">
      <div className="w-full flex items-center justify-between px-3 sm:px-4 lg:px-6">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* LEFT MENU BUTTON */}
          {!open && (
            <button
              type="button"
              onClick={() => setOpen?.(true)}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors btn-hover cursor-pointer"
              aria-label="Open menu"
            >
              <Menu
                size={26}
                className="text-black dark:text-white"
              />
            </button>
          )}

          {/* PROFILE SECTION */}
          <div
            className="flex gap-2 items-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 p-1.5 rounded-xl transition-colors"
            onClick={() => setShowProfileModal(true)}
          >

            {/* AVATAR */}
            <div className="size-10 sm:size-12 rounded-full bg-gradient-to-b from-red-600 to-red-900 text-white flex items-center justify-center font-semibold text-lg sm:text-xl">
              {(user?.first_name || user?.name || "U")
                .charAt(0)
                .toUpperCase()}
            </div>

            {/* PROFILE TEXT */}
            <div className="flex flex-col">
              <div className="flex gap-1 items-center text-black dark:text-white">

                <h1 className="font-light text-base sm:text-lg">
                  Hello!
                </h1>

                <h1 className="font-semibold text-base sm:text-lg">
                  {user?.first_name
                    ? `${user.first_name} ${user.last_name || ""}`
                    : user?.name || "John Doe"}
                </h1>

              </div>

              <div className="text-[#989696] dark:text-gray-400 font-semibold text-xs sm:text-sm mt-1 truncate">
                {getRoleName()}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* DESKTOP DATE */}
          <div className="hidden sm:flex items-center gap-2 text-base dark:text-white">

            <div className="flex items-center justify-center gap-1.5">

              <span className="font-bold">
                {dayName}
              </span>

              <span className="font-light">
                | {formattedDate}
              </span>

            </div>

            <ToggleSwitch />

          </div>

          {/* Mobile controls */}
<div className="flex sm:hidden items-center gap-2">
  <ToggleSwitch />
</div>

        </div>
      </div>

      {/* PROFILE MODAL */}
      <MyProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

    </div>
  );
};

export default Header;