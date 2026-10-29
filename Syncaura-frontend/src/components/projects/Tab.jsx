
import { useTranslation } from "react-i18next";

const Tab = ({ name, count, curr, setCurr }) => {
  const { t } = useTranslation();
  return (
    <div onClick={()=> setCurr(name)} 
      className={` px-5 py-2 rounded-xl flex items-center justify-center gap-3 ${
        name === curr ? "bg-[#E0DDDD] dark:bg-[#4B4B4B] dark:text-[#F8F8F8]" : "bg-[#F8F8F8] dark:bg-[#000000] border border-[#EAECEF] dark:border-[#626262] cursor-pointer"
      } `}
    >
      <h1 className={`text-sm font-semibold ${
        name === curr ?"dark:text-[#F8F8F8] text-[#000000]": "dark:text-[#C2BFBF] text-[#000000]"} `}>{t(`tab_${name.replace(/\s+/g, '')}`, name)}</h1>
      <div
        className={`size-6 rounded-full ${
          name === curr ? "bg-[#2461E6] dark:bg-[#73FBFD] dark:text-[#000000]": "bg-[#ECEEF0] text-[#000000] dark:bg-[#575757] dark:text-[#F8F8F8]"
        }  p-1 text-xs flex items-center justify-center `}
      >
        {count}
      </div>
    </div>
  );
};

export default Tab;
