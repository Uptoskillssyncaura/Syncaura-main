import { motion } from "framer-motion";
import { useMemo } from "react";

const SHAPES = Array.from({ length: 40 });

export default function GeometricBackground() {
  const items = useMemo(() => {
    return SHAPES.map((_, i) => {
      const size = Math.random() * 10 + 14;

      return {
        id: i,
        shape: getRandomShape(),
        size,
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        moveX: Math.random() * 40 - 20,
        moveY: Math.random() * 40 - 20,
        rotate: Math.random() * 360,
        duration: Math.random() * 20 + 20,
        delay: Math.random() * 5,
      };
    });
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#f5f5f56c] dark:bg-[#0f0f0f]">
      {items.map((item) => (
        <motion.span
          key={item.id}
          className="absolute font-medium select-none
                     text-black/40 dark:text-white/70"
          style={{
            top: `${item.startY}%`,
            left: `${item.startX}%`,
            fontSize: item.size,
          }}
          animate={{
            x: [0, item.moveX, -item.moveX, 0],
            y: [0, item.moveY, -item.moveY, 0],
            rotate: [0, item.rotate],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.shape}
        </motion.span>
      ))}
    </div>
  );
}

function getRandomShape() {
  const shapes = ["△", "◇", "○", "□", "—", "∟", "⌒", ];
  return shapes[Math.floor(Math.random() * shapes.length)];
}
