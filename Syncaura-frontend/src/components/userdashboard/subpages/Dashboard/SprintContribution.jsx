import { motion } from "framer-motion";
import ContributionCard from "./ContributionCard";

const SprintContribution = ({ CONTRIBUTIONS }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="
        w-full 
        p-5 
        rounded-2xl 
        bg-white 
        dark:bg-[#1E1E1E]
        shadow-[0_0_12px_#00000020]
        dark:shadow-[0_0_12px_#00000080] 
      "
    >
      
      <h2 className="text-gray-900 dark:text-white font-bold text-xl sm:text-2xl mb-6">
        Sprint Contribution
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-6 sm:gap-10 xl:px-20">
        {CONTRIBUTIONS.length > 0 && CONTRIBUTIONS.map((item) => (
          <ContributionCard key={item.id} {...item} />
        ))}
        {CONTRIBUTIONS.length === 0 && (
          <p className="col-span-2 text-sm text-gray-500 dark:text-gray-400">Sprint contribution data is unavailable.</p>
        )}
      </div>
    </motion.div>
  );
};

export default SprintContribution;