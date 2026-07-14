import React from 'react';
// import { useNavigate } from 'react-router-dom';
import heroTeam from "../../assets/hero-team.png";
import { Link } from "react-router-dom";

const Hero = () => {
  // const navigate = useNavigate();

  const scrollToFeatures = (e) => {
    e.preventDefault();
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="w-full pt-10 md:pt-16 pb-10"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* 🔥 FIX: proper flex layout instead of grid */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">

          {/* TEXT SECTION */}
          <div className="w-full md:w-1/2 space-y-5 text-center md:text-left">

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Welcome to <br className="hidden md:block" /> Flowbit
            </h1>

            <p className="text-[14px] md:text-lg lg:text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <span className="md:hidden">Flowbit brings projects, tasks, chat, meetings, documents and performance insights into one seamless workspace. Create your first project and start organizing your workflow today.
              </span><span className="hidden md:inline">Flowbit brings projects, tasks, chat, <br />meetings, documents and performance <br /> insights into one seamless workspace. <br />Create your first project and start organizing <br /> your workflow today.
              </span></p>

            {/* Buttons - Exact Figma Layout */}
            <div className="flex justify-center md:justify-start gap-3 pt-6">
              <Link to="/sign-up">
                <button
                  className="px-8 md:px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity w-full md:w-auto btn-hover"
                  style={{
                    backgroundColor: 'var(--accent-color)',
                    color: 'var(--bg-primary)'
                  }}
                >
                  Get started
                </button>
              </Link>

              <button
                onClick={scrollToFeatures}
                className="w-full sm:w-auto px-6 py-2.5 border text-sm font-medium hover:opacity-70 transition-opacity"
                style={{
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                Features
              </button>

          </div>
        </div>

          {/* IMAGE */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={heroTeam}
              alt="Team collaboration illustration"
              className="w-full max-w-xs sm:max-w-sm md:max-w-lg h-auto"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;