import { motion } from "framer-motion";
import StatusSegment from "./StatusSegment";


export default function StatusBar({ data, total }) {
  return (
    <div className="flex flex-col gap-1 items-start justify-center ">
     {total && <h1 className="text-sm font-bold text-[#000000] " >Task Status Distribution</h1>}

      <div className="w-full h-12 bg-gray-100 rounded-xl overflow-hidden flex">
      {data.map((item, index) => (
        <StatusSegment
          key={item.id}
          item={item}
          total={total}
          delay={index * 0.15}
        />
      ))}
    </div>
    </div>
  );
}
