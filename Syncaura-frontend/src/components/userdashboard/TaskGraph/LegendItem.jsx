import { motion } from "framer-motion";

export default function LegendItem({ item }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-2 text-sm font-medium text-[#A5A5A5]"
    >
      <span
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: item.color }}
      />
      <span>{item.label}</span>
      <span className="text-gray-400">({item.count})</span>
    </motion.div>
  );
}
