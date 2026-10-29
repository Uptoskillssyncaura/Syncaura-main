import { useSelector } from "react-redux";

const projectStatusData = [
  { name: "Completed", value: 65, color: "#6366F1" },
  { name: "In Progress", value: 40, color: "#10B981" },
  { name: "On Hold", value: 75, color: "#F59E0B" },
  { name: "Delayed", value: 55, color: "#EF4444" },
];

const productivityData = [20, 35, 28, 55, 48, 70];

const AdminTable = () => {
  const isDarkMode = useSelector((state) => state.theme.isDark);

  const maxValue = Math.max(...productivityData);

  const points = productivityData
    .map((val, i) => {
      const x = (i / (productivityData.length - 1)) * 100;
      const y = 100 - (val / maxValue) * 100;
      return `${x},${y}`;
    })
    .join(",");

  const cardStyle = {
    width: "565px",
    height: "340px",
    borderRadius: "10px",
    boxShadow: "0px 4px 4px 4px #00000040",
    backgroundColor: isDarkMode ? "#0F172A" : "#FFFFFF",
    padding: "1.5rem",
  };

  const barEmptyColor = isDarkMode ? "#1E293B" : "#F1F5F9";
  const valueColor = isDarkMode ? "#FFFFFF" : "#000000";
  const labelColor = isDarkMode ? "#94A3B8" : "#6B7280";
  const gridLineColor = isDarkMode ? "rgba(255,255,255,0.1)" : "#E5E7EB";

  return (
    <div className="ml-9 grid grid-cols-1 lg:grid-cols-2 gap-13">
      {/* PROJECT STATUS */}
      <div style={cardStyle}>
        <h3 style={{ color: valueColor, fontWeight: 600, marginBottom: "1.5rem" }}>
          Project Status
        </h3>

        <div className="flex items-end justify-between h-[220px] px-15 mt-5">
          {projectStatusData.map((item) => (
            <div key={item.name} className="flex flex-col items-center gap-3">
              <div
                className="relative rounded-[3px]"
                style={{ width: "36px", height: "145px", backgroundColor: barEmptyColor }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-[6px]"
                  style={{
                    height: `${item.value}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>

              <span style={{ fontSize: "0.75rem", color: valueColor, fontWeight: 500 }}>
                {item.value}
              </span>
              <span style={{ fontSize: "0.6875rem", color: labelColor, textAlign: "center" }}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TEAM PRODUCTIVITY */}
      <div style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ color: valueColor, fontWeight: 600, fontSize: "0.875rem" }}>
            Team Productivity
          </h3>
          <span style={{ fontSize: "0.75rem", color: labelColor }}>Last 30 Days</span>
        </div>

        <div className="relative h-[220px]">
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="h-px" style={{ backgroundColor: gridLineColor }} />
            <div className="h-px" style={{ backgroundColor: gridLineColor }} />
            <div className="h-px" style={{ backgroundColor: gridLineColor }} />
          </div>

          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            <polyline
              points={points}
              fill="none"
              stroke="#6366F1"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AdminTable;
