import ToggleSwitch from "../../dashboard/Header/ToggleSwitch";
import { useSelector } from "react-redux";
import { Menu } from "lucide-react";

const Header = ({ setOpen }) => {
  const user = useSelector((state) => state.auth.user);

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const dayName = today.toLocaleDateString("en-US", {
    weekday: "long",
  });

  return (
    <div className="text-black py-3 bg-[#FFFFFF] dark:bg-[#2E2F2F] shadow-[0_10px_20px_-10px_rgba(0,0,0,0.25)] w-full flex items-center justify-end z-50">
      <div className="w-full flex items-center justify-between px-3 sm:px-4 lg:px-6">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Mobile Menu Button */}
          <button className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu size={28} className="text-black dark:text-white" />
          </button>

          {/* Profile Section */}
          <div className="flex gap-2 items-center">
            {/* Avatar */}
            <div className="size-10 sm:size-12 rounded-full bg-gradient-to-b from-red-600 to-red-900 text-white flex items-center justify-center font-semibold text-lg sm:text-xl">
              J
            </div>

            {/* Profile Text */}
            <div className="flex flex-col">
              <div className="flex gap-1 items-center text-black dark:text-white">
                <h1 className="font-light text-base sm:text-lg">Hello!</h1>
                <h1 className="font-semibold text-base sm:text-lg">
                  {user?.name || "John Doe"}
                </h1>
              </div>

              <div className="text-[#989696] font-semibold text-xs sm:text-sm -mt-1">
                Employee
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop date */}
          <div className="hidden sm:flex items-center gap-2 text-base dark:text-white">
            <div className="flex items-center justify-center gap-1.5">
              <span className="font-bold">{dayName}</span>
              <span className="font-light"> | {formattedDate}</span>
            </div>

            <ToggleSwitch />
          </div>

          {/* Mobile controls */}
          <div className="flex sm:hidden items-center gap-2">
            <ToggleSwitch />
            <button
              type="button"
              onClick={() => setOpen?.(true)}
              className="inline-flex items-center justify-center rounded-full p-2 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
