import React, { useEffect, useState } from "react";
import api from "../../../config/axios";

const BAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-cyan-500",
];

const ResourceUtilization = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.all([api.get("/dashboard/workload"), api.get("/users/all")])
      .then(([workloadResponse, usersResponse]) => {
        if (!active) return;
        const workload = Array.isArray(workloadResponse.data) ? workloadResponse.data : [];
        const users = Array.isArray(usersResponse.data) ? usersResponse.data : [];

        // tasks.assigned_to can hold a user's id, email, or name depending on
        // how the task was created, so match it against all three fields
        // when we group workload back to a person (same approach the
        // backend uses when joining tasks to users elsewhere).
        const findUser = (assignedTo) => {
          const value = String(assignedTo || "").toLowerCase();
          return users.find(
            (u) =>
              String(u.id).toLowerCase() === value ||
              String(u.email || "").toLowerCase() === value ||
              String(u.name || "").toLowerCase() === value
          );
        };

        const withNames = workload.map((entry) => {
          const user = findUser(entry._id);
          return {
            name: user?.name || entry._id || "Unknown",
            count: Number(entry.task_count) || 0,
          };
        });

        const maxCount = Math.max(1, ...withNames.map((w) => w.count));
        const rateRows = withNames
          .map((w, i) => ({
            name: w.name,
            rate: Math.round((w.count / maxCount) * 100),
            count: w.count,
            color: BAR_COLORS[i % BAR_COLORS.length],
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8);

        setRows(rateRows);
      })
      .catch((requestError) =>
        setError(requestError.response?.data?.message || "Unable to load resource utilization")
      )
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-white dark:bg-[#161616] rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-4 mt-6 transition-colors duration-300">
      <h2 className="text-2xl font-bold  text-black dark:text-white mb-10 transition-colors">
        Resource Utilization
      </h2>

      <div className="space-y-4 px-10">
        {loading && <p className="text-sm text-gray-500">Loading resource utilization...</p>}
        {!loading && error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !error && rows.length === 0 && (
          <p className="text-sm text-gray-500">No assigned tasks yet, so there's no workload to show.</p>
        )}
        {!loading &&
          !error &&
          rows.map((item) => (
            <div key={item.name} className="flex items-center gap-6">
              <span className="w-32 shrink-0 truncate text-l font-bold text-gray-900 dark:text-gray-400 dark:font-semibold transition-colors">
                {item.name}
              </span>

              <div className="flex-1 h-2.5 bg-gray-200 dark:bg-zinc-800/60 rounded-full overflow-hidden transition-colors">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${item.rate}%` }}
                ></div>
              </div>
              <span className="w-10 text-l font-bold text-gray-900 dark:text-white text-right transition-colors">
                {item.count}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ResourceUtilization;