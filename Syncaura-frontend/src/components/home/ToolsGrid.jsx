import React from 'react';

const ToolsGrid = () => {
  const tools = [
    {
      title: "Task & Project Management",
      description:
        "Create tasks, set priorities, add deadlines, and track progress with Kanban or Gantt views — everything stays organized.",
    },
    {
      title: "Real-time Chat",
      description:
        "Chat instantly, share files, and collaborate in private or group channels with real-time updates.",
    },
    {
      title: "Meetings & Video Calls",
      description:
        "Schedule meetings with auto Google Meet/Zoom links, calendar sync, and notes — all in one place.",
    },
    {
      title: "Attendance & Leave Tracker",
      description:
        "Mark attendance, request or approve leave, and monitor team availability easily.",
    },
  ];

  return (
    <section
      id="pricing"
      className="w-full pt-10 md:pt-12 pb-8 md:pb-16"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16">

        {/* Header */}
        <div className="text-center mb-8 md:mb-16">

          <p
            className="text-xs sm:text-sm font-medium mb-2 md:mb-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            Tools
          </p>

          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 md:mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Everything you need to work
          </h2>

          <p
            className="text-sm sm:text-base leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Each feature built to save time and eliminate friction from your daily workflow.
          </p>

        </div>

        {/* Cards */}
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6">

          {tools.map((tool, index) => (
            <div
              key={index}
              className="p-5 md:p-6 rounded-2xl border hover:shadow-xl transition-all duration-300 md:hover:-translate-y-1"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)'
              }}
            >
              <h3
                className="text-base sm:text-lg font-semibold mb-3 leading-snug"
                style={{ color: 'var(--text-primary)' }}
              >
                {tool.title}
              </h3>

              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {tool.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default ToolsGrid;