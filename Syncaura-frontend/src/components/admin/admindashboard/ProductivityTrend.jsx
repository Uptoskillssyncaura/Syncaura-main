import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const ProductivityTrend = () => {
  const { t } = useTranslation();
  const data = [
    { name: t("month_jan"), val: 10 },
    { name: t("month_feb"), val: 25 },
    { name: t("month_mar"), val: 45 },
    { name: t("month_apr"), val: 30 },
    { name: t("month_may"), val: 60 },
    { name: t("month_jun"), val: 75 },
  ];
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    checkTheme();    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white dark:bg-[#161616] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 mt-6 transition-colors duration-300">
      <div className="flex justify-between items-center mb-10 px-2">
        <h2 className="text-2xl font-bold text-black dark:text-white">{t("admin_org_productivity_trend")}</h2>
        
        <select className="text-xs bg-gray-50 dark:bg-[#1a1a1a] border dark:border-zinc-800 p-2 px-3 rounded-md text-black dark:text-gray-300 outline-none cursor-pointer">
          <option>{t("admin_last_six_months")}</option>
        </select>
      </div>
      <div className="h-64 w-full mx-10"> 
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 20, right: 60, top: 20, bottom: 10 }}>
            <CartesianGrid 
              strokeDasharray="0" 
              vertical={false} 
              stroke={isDarkMode ? "#262626" : "#93c5fd"} 
            />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ 
                fontSize: 12, 
                fill: isDarkMode ? '#ffffff' : '#4b5563', 
                fontWeight: 600 
              }}
              dy={15}
            />
            <YAxis hide domain={[0, 100]} />
            
            <Line 
              type="linear" 
              dataKey="val" 
              stroke={isDarkMode ? "#00f2ff" : "#3b82f6"} 
              strokeWidth={isDarkMode ? 4 : 5} 
              dot={{ 
                r: 12, 
                fill: isDarkMode ? '#00f2ff' : '#3b82f6', 
                strokeWidth: 0,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductivityTrend;
