import React from 'react';

const Testimonials = () => {
  const testimonials = [
    { quote: "We reduced 40% of manual work after switching to Flowbit. Attendance and leave tracking became effortless.", name: "Priya S", role: "HR Executive", initial: "P", color: "#f43f5e" },
    { quote: "The UI is super clean and intuitive. Kanban boards and real-time chat make daily work so much smoother.", name: "Rahul M", role: "Product Designer", initial: "R", color: "#22c55e" },
    { quote: "Scheduling meetings with auto Google Meet links is a lifesaver. No more jumping between tools.", name: "Sneha K", role: "Team Lead", initial: "S", color: "#6366f1" },
    { quote: "Our documentation, tasks, and meetings stay perfectly in sync. It feels like having everything in one brain.", name: "Vikas R", role: "Engineering Manager", initial: "V", color: "#d97706" },
  ];

  return (
    <>
      <style>{`
        @keyframes scroll-testimonials {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-260px * 4 - 1.5rem * 4));
          }
        }

        .animate-scroll-testimonials {
          animation: scroll-testimonials 20s linear infinite;
        }

        .animate-scroll-testimonials:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section
        className="w-full py-8 md:py-12"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16">

          <div className="overflow-hidden relative">

            <div className="flex gap-4 md:gap-6 animate-scroll-testimonials">

              {[...testimonials, ...testimonials].map((item, index) => (
                <div
                  key={index}
                  className="w-[240px] sm:w-[260px] md:w-[260px]
                             min-h-[170px]
                             flex flex-col justify-between
                             p-4 rounded-xl shadow-sm flex-shrink-0 border"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <p
                    className="text-xs sm:text-sm leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.quote}
                  </p>

                  <div className="flex items-center gap-3 mt-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.initial}
                    </div>

                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {item.name}
                      </p>

                      <p
                        className="text-xs"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {item.role}
                      </p>
                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>
      </section>
    </>
  );
};

export default Testimonials;