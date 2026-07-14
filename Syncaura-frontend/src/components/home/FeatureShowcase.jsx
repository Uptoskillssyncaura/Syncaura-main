import React from 'react';
import dashboardPreview from "../../assets/workspace-dashboard.png";

const FeatureShowcase = () => {
  return (
    <section id="features" className="w-full py-8 md:py-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header - Centered */}
        <div className="text-center mb-8 md:mb-20">
          <h2 className="text-[19px] md:text-xl font-bold mb-3 md:mb-4" style={{ color: 'var(--text-primary)' }}>
            Work Smarter. Collaborate Faster. Grow Together.
          </h2>

          <p
            className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            From planning and collaboration to deployment and performance tracking — everything in one platform.
          </p>

        </div>

        {/* Content Card */}
        <div className="rounded-2xl md:rounded-3xl overflow-hidden" style={{ backgroundColor: 'var(--card-bg)' }}>
          <div className="grid lg:grid-cols-2 gap-6 md:gap-12 p-5 md:p-10 lg:p-14">

            {/* Text Content */}
            <div className="flex flex-col justify-start space-y-4 md:space-y-6">
              <h3 className="text-[26px] md:text-3xl lg:text-4xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                From Start to Success — All in One Workspace
              </h3>
              <p className="text-[14px] leading-[30px] tracking-normal" style={{ color: 'var(--text-primary)' }}>
                Flowbit streamlines your workflow from planning to execution.
                Manage projects, tasks, chats, meetings, documents, attendance,
                and performance — all inside one seamless and modern platform
                built to scale with your team.
              </p>
            </div>

            {/* Dashboard Image */}
            <div className="flex items-center pt-5 justify-center">
              <div className="w-full max-w-xl rounded-xl md:rounded-2xl shadow-xl overflow-hidden" style={{
                backgroundColor: 'var(--bg-secondary)'
              }}>
                <div className="w-full aspect-video flex items-center justify-center" style={{
                  backgroundColor: 'var(--bg-secondary)'
                }}>
                  <img
                    src={dashboardPreview}
                    alt="Workspace dashboard preview"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto"
                  />
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default FeatureShowcase;