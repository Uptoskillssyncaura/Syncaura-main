import React, { useEffect, useRef } from 'react';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { Users, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';
import img3 from "../../assets/3-Photoroom.png";
import img5 from "../../assets/5-Photoroom.png";
import img6 from "../../assets/6-Photoroom.png";
import img9 from "../../assets/9-Photoroom.png";
import img10 from "../../assets/10-Photoroom.png";
import img12 from "../../assets/12-Photoroom.png";
import img13 from "../../assets/13-Photoroom.png";
import img14 from "../../assets/14-Photoroom.png";
import img15 from "../../assets/15-Photoroom.png";
import img16 from "../../assets/16-Photoroom.png";
import img17 from "../../assets/17-Photoroom.png";

const trustImages = [img3, img5, img6, img9, img10, img12, img13, img14, img15, img16, img17];

const StatsSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null); // Reference to track when this section scrolls into view
  const usersRef = useRef(null); // Reference for the "2M+" counter
  const satisfactionRef = useRef(null); // Reference for the "98%" counter
  
  // Triggers animations only once when the component enters 30% of the viewport
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return; // Wait until visible

    // Animate the users count from 0 to 2,000,000 over 2.5 seconds
    const controlsUsers = animate(0, 2000000, {
      duration: 2.5,
      ease: "easeOut",
      onUpdate: (val) => {
        if (usersRef.current) {
          const num = Math.floor(val);
          // Format with commas, or show 2M+ when it hits the max
          usersRef.current.textContent = num >= 2000000 ? "2M+" : new Intl.NumberFormat('en-US').format(num);
        }
      }
    });

    // Animate the satisfaction percentage from 0 to 98
    const controlsSat = animate(0, 98, {
      duration: 2.5,
      ease: "easeOut",
      onUpdate: (val) => {
        if (satisfactionRef.current) {
          satisfactionRef.current.textContent = Math.floor(val) + "%";
        }
      }
    });

    return () => {
      controlsUsers.stop();
      controlsSat.stop();
    };
  }, [isInView]);

  return (
    <section ref={sectionRef} className="w-full py-8 md:py-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        
        {/* 
          MAIN STATS CARD
          A large, glass-like container holding the text and statistics.
        */}
        <motion.div 
          whileHover="hover"
          initial="initial"
          className="relative mb-12 p-6 md:p-10 lg:p-12 rounded-[2rem] overflow-hidden group max-w-6xl mx-auto transition-all duration-500 hover:-translate-y-1"
          style={{
            background: "linear-gradient(145deg, rgba(128, 128, 128, 0.08) 0%, rgba(128, 128, 128, 0.02) 100%)",
            border: "1px solid rgba(128, 128, 128, 0.15)",
            boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.1), 0 0 15px rgba(0, 0, 0, 0.03)",
            backdropFilter: "blur(20px)",
            transformStyle: "preserve-3d",
            perspective: 1200
          }}
        >
          {/* 
            FLUID BACKGROUND RIPPLE
            This creates a glowing gradient blob that slowly rotates infinitely behind the content.
          */}
          <motion.div 
            variants={{
              initial: { opacity: 0, scale: 0.8, rotate: 0 },
              hover: { 
                opacity: 0.15, 
                scale: 1.5, 
                rotate: 90,
                transition: { duration: 10, ease: "linear", repeat: Infinity }
              }
            }}
            className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.5) 0%, rgba(168, 85, 247, 0.4) 30%, transparent 70%)",
              filter: "blur(60px)",
              zIndex: 0
            }}
          />

          <div className="relative z-10 flex flex-col gap-8 lg:gap-10">
            
            {/* 
              TOP SECTION: TEXT HEADERS 
              Contains the "Growth" badge, headline, and paragraph description.
            */}
            <div className="w-full text-center md:text-left max-w-4xl mx-auto md:mx-0 flex flex-col items-center md:items-start">
              
              {/* Animated Growth Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 mb-6 shadow-sm"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-black tracking-[0.2em] uppercase">{t("stats_growth")}</span>
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-[54px] font-black tracking-tighter mb-6 leading-[1.1]" 
                style={{ color: 'var(--text-primary)' }}
              >
                {t("stats_title")}
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base md:text-lg lg:text-xl font-medium max-w-2xl leading-relaxed" 
                style={{ color: 'var(--text-secondary)' }}
              >
                {t("stats_description")}
              </motion.p>
            </div>

            {/* 
              BOTTOM SECTION: THE STATISTIC CARDS
              Holds the two number counters (2M+ users and 98% satisfaction).
            */}
            <div className="w-full flex flex-col sm:flex-row gap-6 md:gap-8 mt-2 max-w-4xl mx-auto">
              
              {/* Users Counter Card */}
              <motion.div
                variants={{
                  initial: { y: 0 },
                  hover: { y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }
                }}
                className="relative p-6 md:p-8 rounded-3xl flex-1 overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.03) 100%)",
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
                }}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px] group-hover:bg-indigo-500/40 transition-colors duration-700" />
                <div className="flex flex-col items-start text-left relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-5 shadow-sm border border-indigo-500/20">
                    <Users className="w-6 h-6 text-indigo-500" strokeWidth={2.5} />
                  </div>
                  <h3 
                    ref={usersRef}
                    className="text-[40px] md:text-5xl lg:text-6xl font-black mb-2 tracking-tighter"
                    style={{
                      background: "linear-gradient(to right, #6366f1, #a855f7)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      filter: "drop-shadow(0px 4px 10px rgba(99,102,241,0.2))"
                    }}
                  >
                    0
                  </h3>
                  <div className="h-[2px] w-10 bg-indigo-500/40 mb-3 rounded-full" />
                  <p className="text-sm md:text-base font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Active users across the globe
                  </p>
                </div>
              </motion.div>

              {/* 98% Card */}
              <motion.div
                variants={{
                  initial: { y: 0 },
                  hover: { y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }
                }}
                className="relative p-6 md:p-8 rounded-3xl flex-1 overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, rgba(20, 184, 166, 0.08) 0%, rgba(59, 130, 246, 0.03) 100%)",
                  border: "1px solid rgba(20, 184, 166, 0.2)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
                }}
              >
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal-500/20 rounded-full blur-[40px] group-hover:bg-teal-500/40 transition-colors duration-700" />
                <div className="flex flex-col items-start text-left relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-5 shadow-sm border border-teal-500/20">
                    <TrendingUp className="w-6 h-6 text-teal-500" strokeWidth={2.5} />
                  </div>
                  <h3 
                    ref={satisfactionRef}
                    className="text-[40px] md:text-5xl lg:text-6xl font-black mb-2 tracking-tighter"
                    style={{
                      background: "linear-gradient(to right, #14b8a6, #3b82f6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      filter: "drop-shadow(0px 4px 10px rgba(20,184,166,0.2))"
                    }}
                  >
                    0%
                  </h3>
                  <div className="h-[2px] w-10 bg-teal-500/40 mb-3 rounded-full" />
                  <p className="text-sm md:text-base font-medium" style={{ color: 'var(--text-secondary)' }}>
                    User satisfaction rating from our community
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-start gap-4 mb-12 pt-2 md:mb-16 pl-2">
          {/* Learn More Button */}
          <Link to="/learn-more" className="inline-block">
            <button className="group relative flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-110 active:scale-95 bg-blue-600 text-white shadow-[0_4px_14px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.6)] overflow-hidden">
              <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-[150%] skew-x-[-20deg] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
              <BookOpen className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
              Learn More
            </button>
          </Link>

        </div>

        {/* Trust Bar */}
        <div>
          <div className="flex items-center justify-center gap-3 md:gap-6 mb-8 pt-6">
            <div className="h-[1px] w-12 md:w-32" style={{ background: 'linear-gradient(to right, transparent, var(--text-secondary))', opacity: 0.3 }}></div>
            <p className="text-center text-base md:text-xl lg:text-2xl font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>
              Trusted by Top Professionals
            </p>
            <div className="h-[1px] w-12 md:w-32" style={{ background: 'linear-gradient(to left, transparent, var(--text-secondary))', opacity: 0.3 }}></div>
          </div>
          
          {/* Infinite Marquee Container */}
          <div className="overflow-hidden relative w-full flex justify-center py-2">
            
            {/* Fade Edges (Left and Right) */}
            <div 
              className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none" 
              style={{ background: 'linear-gradient(to right, var(--bg-primary) 0%, transparent 100%)' }}
            />
            <div 
              className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none" 
              style={{ background: 'linear-gradient(to left, var(--bg-primary) 0%, transparent 100%)' }}
            />

            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes scroll-logos {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-scroll-logos {
                animation: scroll-logos 40s linear infinite;
                width: max-content;
              }
              .animate-scroll-logos:hover {
                animation-play-state: paused;
              }
            `}} />
            
            <div className="flex gap-6 md:gap-8 animate-scroll-logos">
              {/* Double the array for seamless infinite looping */}
              {[...trustImages, ...trustImages].map((imgSrc, i) => (
                <div
                  key={i}
                  className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full flex-shrink-0 flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.3)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden ring-2 ring-transparent hover:ring-blue-500/50"
                  style={{ backgroundColor: 'var(--bg-primary)' }}
                >
                  <img 
                    src={imgSrc} 
                    alt="Trusted Student" 
                    className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-110" 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
