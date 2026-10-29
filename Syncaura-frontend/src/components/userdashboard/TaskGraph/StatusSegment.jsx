import { motion } from "framer-motion";

export default function StatusSegment({ item, total, delay }) {
  const width =
    typeof item.count === "string" && item.count.includes("%")
      ? item.count
      : `${(item.count / total) * 100}%`;

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width }}
      transition={{
        duration: 0.8,
        delay,
        ease: "easeInOut",
      }}
      className="h-full"
      style={{ backgroundColor: item.color }}
    />
  );
}
