
import { FaMoon } from "react-icons/fa";
import { IoIosSunny } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setTheme as setUiTheme } from "../../../redux/uiSlice";
import { setTheme as setBoolTheme } from "../../../redux/slices/themeSlice";

  const ToggleSwitch = () => {
  const theme = useSelector((state) => state.ui?.theme || "light");
  const isDark = theme === "dark";

  const dispatch = useDispatch();
  // const { isDark, toggleTheme } = useThemeStore();
  const toggleTheme = () => {
  const newTheme = isDark ? "light" : "dark";

  dispatch(setUiTheme(newTheme));
  dispatch(setBoolTheme(newTheme === "dark"));
};
  return (
    <div
      onClick={toggleTheme}
      className={`relative w-14 h-6 xl:w-17 xl:h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300
        ${!isDark ? "bg-green-500" : "bg-[#1A1B1E] border border-gray-200"}`}
    >
      <div className={`absolute top-1 ${!isDark ? "left-1" : "right-1"} flex items-center justify-center size-4 xl:size-6`}>
        {!isDark ? <IoIosSunny className="text-white text-xl font-bold" /> : <FaMoon className="text-white text-xs" />}
      </div>

      <div
        className={`bg-white px-2 py-1.5 xl:px-3.5 xl:py-3 rounded-full shadow-md transform transition-transform duration-300
          ${isDark ? "translate-x-0" : "translate-x-8  xl:translate-x-8"}`}
      />
    </div>
  );
};

export default ToggleSwitch;
