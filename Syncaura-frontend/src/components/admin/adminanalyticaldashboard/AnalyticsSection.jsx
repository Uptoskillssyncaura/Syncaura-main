// import React from "react";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// import {
//   TrendingUp,
//   TrendingDown,
//   Minus,
//   MoreHorizontal,
//   AlertTriangle,
//   Gauge,
//   CheckCircle,
//   Clock,
//   ShieldCheck,
// } from "lucide-react";

// const topMetricsData = [
//   {
//     id: 1,
//     title: "Velocity",
//     value: "42 pts",
//     change: "+12%",
//     changeType: "increase",
//     icon: Gauge,
//     data: [
//       { value: 5 },
//       { value: 5 },
//       { value: 5 },
//       { value: 30 },
//       { value: 32 },
//       { value: 27 },
//       { value: 40 },
//     ],
//   },
//   {
//     id: 2,
//     title: "Completion Rate",
//     value: "94%",
//     change: "+2%",
//     changeType: "increase",
//     icon: CheckCircle,
//     data: [
//       { value: 15 },
//       { value: 13 },
//       { value: 15 },
//       { value: 30 },
//       { value: 25 },
//       { value: 27 },
//       { value: 28 },
//     ],
//   },
//   {
//     id: 3,
//     title: "Cycle Time",
//     value: "4.2 days",
//     change: "-0.5%",
//     changeType: "decrease",
//     icon: Clock,
//     data: [
//       { value: 16 },
//       { value: 16 },
//       { value: 15 },
//       { value: 13 },
//       { value: 5 },
//       { value: 4 },
//       { value: 5 },
//     ],
//   },
//   {
//     id: 4,
//     title: "SLA Compliance",
//     value: "98.5%",
//     change: "0%",
//     changeType: "neutral",
//     icon: ShieldCheck,
//     data: [
//       { value: 98.5 },
//       { value: 98.5 },
//       { value: 98.5 },
//       { value: 98.5 },
//       { value: 98.5 },
//       { value: 98.5 },
//       { value: 98.5 },
//     ],
//   },
// ];

// const productivityData = [
//   { team: "Team A", delivered: 75, capacity: 90 },
//   { team: "Team B", delivered: 110, capacity: 115 },
//   { team: "Team C", delivered: 85, capacity: 80 },
//   { team: "Team D", delivered: 60, capacity: 105 },
// ];

// const defectRateData = [
//   { week: "W1", defects: 12 },
//   { week: "W2", defects: 38 },
//   { week: "W3", defects: 25 },
//   { week: "W4", defects: 45 },
// ];

// const sprintPerformanceData = [
//   { sprint: "Sprint 10", done: 40, inProgress: 20, todo: 10 },
//   { sprint: "Sprint 11", done: 35, inProgress: 30, todo: 15 },
//   { sprint: "Sprint 12", done: 45, inProgress: 12, todo: 8 },
//   { sprint: "Sprint 13", done: 30, inProgress: 35, todo: 20 },
// ];

// const projectTrendData = [
//   { month: "Jan", value: 10, forecast: 25 },
//   { month: "Feb", value: 25, forecast: 30 },
//   { month: "Mar", value: 40, forecast: 40 },
//   { month: "Apr", value: 55, forecast: 50 },
//   { month: "May", value: 75, forecast: 60 },
//   { month: "Jun", value: 90, forecast: 70 },
// ];

// export const resourceUtilizationData = [
//   {
//     name: "Sarah J.",
//     mon: 35,
//     tue: 60,
//     wed: 75,
//     thu: 65,
//     fri: 45,
//   },
//   {
//     name: "Mike R.",
//     mon: 80,
//     tue: 78,
//     wed: 65,
//     thu: 30,
//     fri: 20,
//   },
//   {
//     name: "Emily T.",
//     mon: 45,
//     tue: 50,
//     wed: 55,
//     thu: 60,
//     fri: 40,
//   },
//   {
//     name: "David L.",
//     mon: 90,
//     tue: 92,
//     wed: 70,
//     thu: 40,
//     fri: 30,
//   },
// ];

// export const bottleneckData = [
//   { stage: "Backlog", value: 140, color: "#137FEC" },
//   { stage: "Analysis", value: 120, color: "#2A8CEE" },
//   { stage: "Development", value: 85, color: "#4498F3" },
//   { stage: "QA Review", value: 35, color: "#FF726F", bottleneck: true },
//   { stage: "Deployed", value: 32, color: "#21C45E" },
// ];

// const TopMetrics = () => {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//       {topMetricsData.map((metric) => {
//         const Icon = metric.icon;

//         return (
//           <div
//             key={metric.id}
//             className="
//               relative
//               bg-white dark:bg-[#111111]
//               border border-gray-200
//               dark:border-white/10
//               rounded-xl p-5
//               shadow-sm dark:shadow-lg
//             "
//           >
//             {/* Top Right Icon */}
//             <div className="absolute top-4 right-4 p-2 rounded-lg bg-[#71B2F4]/10">
//               <Icon size={20} className="text-[#71B2F4] dark:text-[#71B2F4]" />
//             </div>

//             {/* Title */}
//             <p className="text-md text-gray-500 dark:text-gray-400 mb-3">
//               {metric.title}
//             </p>

//             {/* Value + Change */}
//             <div className="flex items-center gap-3 mb-4">
//               <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
//                 {metric.value}
//               </h2>

//               <span
//                 className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md
//                   ${
//                     metric.changeType === "increase"
//                       ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
//                       : metric.changeType === "decrease"
//                         ? "bg-blue-100 text-blue-700 dark:bg-cyan-500/20 dark:text-cyan-400"
//                         : "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400"
//                   }`}
//               >
//                 {metric.changeType === "increase" && <TrendingUp size={14} />}
//                 {metric.changeType === "decrease" && <TrendingDown size={14} />}
//                 {metric.changeType === "neutral" && <Minus size={14} />}
//                 {metric.change}
//               </span>
//             </div>

//             {/* Chart */}
//             <div className="h-12">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={metric.data}>
//                   <Line
//                     type="natural"
//                     dataKey="value"
//                     stroke={metric.id === 4 ? "#9CA3AF" : "#3B82F6"}
//                     strokeWidth={2}
//                     dot={false}
//                     activeDot={false}
//                     strokeDasharray={metric.id === 4 ? "4 4" : "0"}
//                   />

//                   {/* Last point marker */}
//                   <Line
//                     type="monotone"
//                     dataKey="value"
//                     stroke="transparent"
//                     dot={({ cx, cy, index }) =>
//                       index === metric.data.length - 1 ? (
//                         <circle
//                           cx={cx}
//                           cy={cy}
//                           r={4}
//                           fill={metric.id === 4 ? "#9CA3AF" : "#3B82F6"}
//                         />
//                       ) : null
//                     }
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// const ProductivityQuality = () => {
//   return (
//     <div className="bg-white dark:bg-[#111111] rounded-xl">
//       <h2 className="text-3xl sm:text-2xl font-semibold px-3 pt-4 pb-2 text-black dark:text-white">
//         Productivity & Quality
//       </h2>

//       <div className="p-4 sm:p-6 dark:bg-[#1E1E1E] border-4 border-gray-100 dark:border-0">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">
//           <div>
//             <h3 className="text-2xl sm:text-sm  font-semibold text-black dark:text-white">
//               Team Productivity
//             </h3>
//             <p className="text-md sm:text-xs text-gray-400">
//               Story points delivered vs capacity
//             </p>
//           </div>

//           <div className="flex gap-4 text-xs flex-wrap">
//             <div className="flex items-center">
//               <span className="w-3 h-3 rounded-full bg-blue-600 dark:bg-cyan-400" />
//               Delivered
//             </div>
//             <div className="flex items-center">
//               <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
//               Capacity
//             </div>
//           </div>
//         </div>

//         {/* Chart */}
//         <div className="h-52 sm:h-70">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={productivityData}>
//               <XAxis
//                 dataKey="team"
//                 tick={{ fontSize: 15 }}
//                 axisLine={false} // remove the axis line
//                 tickLine={false} // remove the small tick marks
//               />
//               <Tooltip />
//               <Bar dataKey="capacity" fill="#E4E6E8" radius={[4, 4, 0, 0]} />
//               <Bar dataKey="delivered" fill="#2563EB" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DefectRate = () => (
//   <div className="bg-white dark:bg-[#1E1E1E] py-3 px-3 sm:p-6 rounded-xs border-4 border-gray-100 dark:border-0">
//     {/* Header */}
//     <div className="flex justify-between items-center mb-4">
//       <div>
//         <h4 className="text-2xl sm:text-sm  font-semibold">Defect Rate</h4>
//         <p className="text-md sm:text-xs text-gray-400">
//           Reported bugs per week
//         </p>
//       </div>
//       <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-red-100 text-red-500 dark:bg-[#341A27] dark:text-[#F87171]">
//         <TrendingDown size={14} />
//         -2%
//       </span>
//     </div>

//     {/* Chart */}
//     <div className="h-52 sm:h-64">
//       <ResponsiveContainer>
//         <AreaChart
//           data={defectRateData}
//           margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
//         >
//           {/* 🔥 Gradient for smooth rounded feel */}
//           <defs>
//             <linearGradient id="defectGradient" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
//               <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
//             </linearGradient>
//           </defs>

//           {/* Smooth curved line */}
//           <XAxis
//             dataKey="week"
//             axisLine={false}
//             tickLine={false}
//             tick={{ fontSize: 10 }}
//           />

//           <YAxis hide />

//           <Tooltip
//             contentStyle={{
//               borderRadius: "8px",
//               border: "none",
//               fontSize: "12px",
//             }}
//           />

//           <Area
//             type="monotone"
//             dataKey="defects"
//             stroke="#3B82F6"
//             strokeWidth={2}
//             fill="url(#defectGradient)" // 🔥 gradient fill
//             dot={false}
//             activeDot={{
//               r: 5,
//               style: {
//                 borderRadius: "50%",
//               },
//             }}
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   </div>
// );

// const SprintPerformance = () => (
//   <div className="bg-white dark:bg-[#1E1E1E] p-5 sm:p-6 rounded-xs border-4 border-gray-100 dark:border-0">
//     {/* Header */}
//     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5">
//       {/* Left */}
//       <div>
//         <h4 className="font-semibold text-2xl sm:text-sm ">
//           Sprint Performance
//         </h4>
//         <p className="text-md sm:text-xs text-gray-400">
//           Task status distribution
//         </p>
//       </div>

//       {/* Legend */}
//       <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
//         <div className="flex items-center gap-2">
//           <span className="w-3 h-3 rounded-full bg-[#2563EB]"></span>
//           <span className="text-gray-600 dark:text-gray-300">Done</span>
//         </div>

//         <div className="flex items-center gap-2">
//           <span className="w-3 h-3 rounded-full bg-[#93C5FD]"></span>
//           <span className="text-gray-600 dark:text-gray-300">In Prog</span>
//         </div>

//         <div className="flex items-center gap-2">
//           <span className="w-3 h-3 rounded-full bg-[#D1D5DB]"></span>
//           <span className="text-gray-600 dark:text-gray-300">Todo</span>
//         </div>
//       </div>
//     </div>

//     {/* Chart */}
//     <div className="h-52 sm:h-64 md:h-72">
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart data={sprintPerformanceData} barCategoryGap="25%">
//           <XAxis
//             dataKey="sprint"
//             axisLine={false}
//             tickLine={false}
//             tick={{ fontSize: 15 }}
//           />

//           <YAxis hide />

//           <Tooltip
//             contentStyle={{
//               borderRadius: "8px",
//               border: "none",
//               fontSize: "12px",
//             }}
//           />

//           {/* Responsive bars */}
//           <Bar dataKey="done" stackId="a" fill="#2563EB" maxBarSize={100} />
//           <Bar
//             dataKey="inProgress"
//             stackId="a"
//             fill="#93C5FD"
//             maxBarSize={100}
//           />
//           <Bar dataKey="todo" stackId="a" fill="#D1D5DB" maxBarSize={100} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   </div>
// );

// const ProjectTrend = () => (
//   <div className="bg-white dark:bg-[#1E1E1E] px-5 sm-py-6 py-5 rounded-xs border-4 border-gray-100 dark:border-0">
//     <div className="flex justify-between items-center mb-4">
//       {/* Left Section */}
//       <div>
//         <h4 className="font-semibold text-2xl sm:text-sm mb-1">
//           Project Delivery Trends
//         </h4>
//         <p className="text-md sm:text-xs text-gray-400">
//           Cumulative value Delivery
//         </p>
//       </div>

//       {/* Right Section */}
//       <div>
//         <span className="flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 cursor-pointer">
//           <MoreHorizontal size={28} />
//         </span>
//       </div>
//     </div>

//     <div className="h-72">
//       <ResponsiveContainer width="100%" height="100%">
//         <AreaChart
//           data={projectTrendData}
//           margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
//         >
//           {/* Grid removed */}

//           <XAxis dataKey="month" axisLine={false} tickLine={false} />
//           <YAxis hide domain={[0, "auto"]} />
//           <Tooltip />

//           <Area
//             type="monotone"
//             dataKey="value"
//             stroke="#2563EB"
//             fill="#93C5FD"
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   </div>
// );

// const ResourceUtilization = () => {
//   const getColor = (v) => {
//     if (v >= 90) return "bg-[#F87171]";
//     if (v >= 70) return "bg-[#1D4ED8]";
//     if (v >= 50) return "bg-[#3B82F6]";
//     if (v >= 30) return "bg-[#93C5FD]";
//     return "bg-[#E5E7EB]";
//   };

//   return (
//     <>
//       {/* Section Title */}
//       <h2 className="text-2xl sm:text-2xl font-semibold px-3 my-2 text-black dark:text-white">
//         Utilization & Bottlenecks
//       </h2>

//       {/* Container */}
//       <div className="bg-white dark:bg-[#1E1E1E] px-5 sm-py-6 py-5 rounded-xs border-4 border-gray-100 dark:border-0">
//         <div className="mb-4">
//           <h4 className="font-semibold text-2xl sm:text-sm mb-1">
//             Project Delivery Trends
//           </h4>
//           <p className="text-md sm:text-xs text-gray-400">
//             Cumulative value Delivery
//           </p>
//         </div>

//         {/* Header */}
//         <div className="grid grid-cols-6 items-center text-[10px] sm:text-xs text-gray-400 mb-3">
//           <span className="font-medium">NAME</span>
//           <span className="text-center">MON</span>
//           <span className="text-center">TUE</span>
//           <span className="text-center">WED</span>
//           <span className="text-center">THU</span>
//           <span className="text-center">FRI</span>
//         </div>

//         {/* Rows */}
//         <div className="space-y-2 sm:space-y-3">
//           {resourceUtilizationData.map((m, i) => (
//             <div
//               key={i}
//               className="grid grid-cols-6 items-center gap-1 sm:gap-3"
//             >
//               {/* Name */}
//               <span className="text-[11px] sm:text-sm text-gray-700 dark:text-gray-200 truncate">
//                 {m.name}
//               </span>

//               {/* Days */}
//               {["mon", "tue", "wed", "thu", "fri"].map((d) => (
//                 <div
//                   key={d}
//                   className={`
//                     h-7 sm:h-8 md:h-10   /* 👈 responsive height */
//                     w-full               /* 👈 fit inside grid */
//                     rounded-sm
//                     ${getColor(m[d])}
//                     transition-all duration-200
//                   `}
//                   title={`${m.name} - ${d.toUpperCase()}: ${m[d]}%`}
//                 />
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };
// const BottleneckDetection = () => {
//   const maxValue = Math.max(...bottleneckData.map((i) => i.value));

//   return (
//     <div className="bg-white dark:bg-[#1E1E1E] px-6 sm-py-6 py-5  rounded-xs border-4 border-gray-100 dark:border-0">
//       <div className="mb-5">
//         <h4 className="font-semibold text-2xl sm:text-sm mb-1">
//           Bottleneck Detection
//         </h4>
//         <p className="text-md sm:text-xs text-gray-400">
//           Work item flow efficiency
//         </p>
//       </div>

//       {bottleneckData.map((item, i) => {
//         const percent = (item.value / maxValue) * 100;

//         return (
//           <div key={i} className="flex items-center sm-mb-4 mb-2 gap-1">
//             {/* Stage Name */}
//             <div className="w-32 text-sm">{item.stage}</div>

//             {/* Bar + Tag Container */}
//             <div className="w-full relative">
//               {/* Bar Background */}
//               <div className="sm:h-10 rounded w-full overflow-hidden ">
//                 {/* Filled Bar */}
//                 <div
//                   className="h-7 sm:h-10 flex items-center justify-end px-2 text-white text-xs font-semibold whitespace-nowrap"
//                   style={{
//                     width: `${percent}%`,
//                     background: item.color,
//                   }}
//                 >
//                   {item.value}
//                 </div>
//               </div>

//               {/* Bottleneck Tag positioned at bar end */}
//               {item.bottleneck && (
//                 <div
//                   className="absolute top-1/2 -translate-y-1/2 ml-2 text-xs px-2 py-1 rounded flex items-center bg-gray-200 gap-1 whitespace-nowrap shadow"
//                   style={{
//                     left: `${percent}%`,
//                   }}
//                 >
//                   <div className="bg-gray-200 text-xs px-2 py-1 rounded flex items-center gap-1 whitespace-nowrap">
//                     <AlertTriangle className="w-4 h-4 text-yellow-500" />
//                     <span className="text-black font-semibold">Bottleneck</span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// const AnalyticSection = () => {
//   return (
//     <div className="py-6 space-y-8 mb-15">
//       <TopMetrics />
//       <ProductivityQuality />
//       <DefectRate />
//       <SprintPerformance />
//       <ProjectTrend />
//       <ResourceUtilization />
//       <BottleneckDetection />
//     </div>
//   );
// };

// export default AnalyticSection;
