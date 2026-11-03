import {
  FiMoreHorizontal,
  FiLayers,
  FiDollarSign,
  FiClock,
  FiRefreshCcw,
} from "react-icons/fi";

export default function ProjectListItem({ data }) {
  return (
    <>
      <div className="py-4 w-full">

     
        <div className="flex justify-between">

          <div className="flex gap-4">

        
            <div className="w-16 h-16 rounded-full border flex items-center justify-center">
              <img src={data?.logo} className="w-10 h-10 object-contain" />
            </div>

            <div>
              <h3 className="text-[16px] font-semibold text-gray-800">
                {data?.title}
              </h3>

              <div className="flex items-center gap-2 mt-1">
                <div className="w-30 h-0.75 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${data?.percent}%` }}
                  />
                </div>
                <span className="text-[13px] text-gray-600">{data?.percent}%</span>
              </div>

              <div className="flex gap-1 mt-2">
                {data?.avatars.map((a, i) => (
                  <img
                    key={i}
                    className="size-6.5 rounded-full border"
                    src={a}
                  />
                ))}
              </div>
            </div>
          </div>

          <FiMoreHorizontal className="text-gray-500 text-xl" />
        </div>

        <div className="grid grid-cols-2 gap-y-2 mt-3 text-[14px] text-gray-700">

          <div className="flex items-center gap-2">
            <FiLayers className="text-gray-400 text-lg" />
            {data?.stages} Stages
          </div>

          <div className="flex items-center gap-2">
            <FiClock className="text-gray-400 text-lg" />
            Deadline: {data?.deadline}
          </div>

          <div className="flex items-center gap-2">
            <FiDollarSign className="text-gray-400 text-lg" />
            Income: {data?.income}
          </div>

          <div className="flex items-center gap-2">
            <FiRefreshCcw className="text-gray-400 text-lg" />
            {data?.tasks} Tasks
          </div>

        </div>
      </div>

      <div className="border-t border-gray-200"></div>
    </>
  );
}
