import { motion } from "framer-motion";

const contributions = [
  { title: "Mobile App Launch", value: 75 },
  { title: "Enterprise CRM Integration", value: 40 },
  { title: "Internal HR Portal Update", value: 90 },
  { title: "Marketing Website Localization", value: 15 },
];

export default function ProjectContributionCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-white rounded-xl p-6 border border-slate-200 dark:border-[#2d2f31] shadow-sm dark:shadow-none"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">My Individual Contribution</h2>
        <button className="text-xs text-cyan-600 dark:text-[#00D2FF] font-bold tracking-tight hover:underline transition-colors btn-hover">
          View Detailed Log
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {contributions.map((item, index) => (
          <div key={index} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              {/* Title: Dark slate in light, White in dark */}
              <span className="text-sm font-medium text-slate-700 dark:text-white">
                {item.title}
              </span>
              {/* Percentage: Deep cyan in light, Neon cyan in dark */}
              <span className="text-cyan-600 dark:text-[#00D2FF] text-sm font-bold">
                {item.value}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-[#2d2f31] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                /* Bar: Solid cyan in light, Glowing neon cyan in dark */
                className="h-full bg-cyan-500 dark:bg-[#00D2FF] rounded-full dark:shadow-[0_0_8px_rgba(0,210,255,0.4)]"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}