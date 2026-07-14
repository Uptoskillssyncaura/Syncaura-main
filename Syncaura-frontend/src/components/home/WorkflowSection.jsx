import React from 'react';

const WorkflowSection = () => {
  const scrollToFeatures = (e) => {
    e.preventDefault();
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="w-full py-8 md:py-12 lg:py-20 border-t"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16">

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-start">

          {/* Heading Section */}
          <div>
            <p
              className="text-xs sm:text-sm md:text-base font-semibold mb-2 md:mb-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              Workflow
            </p>

            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Work smarter,<br />collaborate faster
            </h2>
          </div>

          {/* Description and Buttons */}
          <div className="space-y-4 md:space-y-6 lg:space-y-8">

            <p
              className="text-sm sm:text-base leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              From planning to execution, everything happens in one place. No more switching between tools. No more lost messages. Just pure productivity.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 md:flex-none md:px-6 lg:px-10 py-2.5 lg:py-3 text-sm lg:text-lg font-medium hover:opacity-90 transition-opacity btn-hover" style={{
                backgroundColor: 'var(--accent-color)',
                color: 'var(--bg-primary)'
              }}>
                Start
              </button>

              <button
                onClick={scrollToFeatures}
                className="flex-1 md:flex-none md:px-6 lg:px-10 py-2.5 lg:py-3 border text-sm lg:text-lg font-medium hover:opacity-70 transition-opacity btn-hover"
                style={{
                  borderColor: 'var(--accent-color)',
                  color: 'var(--accent-color)',
                  backgroundColor: 'transparent'
                }}
              >
                Explore
              </button>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;