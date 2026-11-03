import React, { useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import { Rocket, Compass } from 'lucide-react';
import { useTranslation } from "react-i18next";
import heroAnimatedVideo from "../../assets/hero animated video.mp4";

const Hero = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start video from 3 seconds once metadata is loaded
    const handleLoadedMetadata = () => {
      video.currentTime = 3;
      video.playbackRate = 0.33; // Slow down the video by 3 times (1/3 speed)
    };
    
    if (video.readyState >= 1) {
      video.currentTime = 3;
      video.playbackRate = 0.33; // Slow down the video by 3 times (1/3 speed)
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    // Standard forward loop, jumping back to 3 seconds when ended
    const handleEnded = () => {
      video.currentTime = 3;
      video.play().catch(e => console.log("Playback prevented", e));
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);
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

          {/* 
            LEFT COLUMN: TEXT & CTA BUTTONS
            This holds the main headline, description, and primary actions.
            On mobile (md:), it stacks on top of the image. On desktop, it takes the left half.
          */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-20">

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              {t("hero_title_line1")} <br className="hidden md:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400">
                {t("hero_title_line2")}
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-lg lg:text-xl font-medium leading-relaxed max-w-xl mb-8" 
              style={{ color: 'var(--text-secondary)' }}
            >
              {t("hero_description")}
            </motion.p>

            {/* 
              CALL TO ACTION BUTTONS 
              A flex container to hold the primary (Get Started) and secondary (Explore Features) buttons side by side.
            */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link to="/sign-up" className="w-full sm:w-auto">
                <button
                  className="group relative flex items-center justify-center gap-2 px-8 py-3.5 w-full sm:w-auto text-sm font-bold text-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-110 active:scale-95 bg-blue-600 shadow-[0_8px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_12px_30px_rgba(59,130,246,0.6)]"
                >
                  {/* Shimmer Effect */}
                  <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-[150%] skew-x-[-20deg] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                  
                  {t("cta_getStarted")}
                  <Rocket className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </Link>

              <button
                onClick={scrollToFeatures}
                className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-110 active:scale-95 border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 shadow-sm hover:shadow-xl"
              >
                {t("cta_learnMore")}
                <Compass className="w-4 h-4 transition-transform group-hover:rotate-45" />
              </button>
            </motion.div>
          </div>

          {/* 
            RIGHT COLUMN: MEDIA & ANIMATION
            Holds the glowing bulb animation and the main looping hero video.
          */}
          <div className="w-full md:w-1/2 flex justify-center relative">
            
            {/* 
              BACKGROUND GLOW EFFECT
              A decorative pulsing cyan blur behind the video that grows and shrinks infinitely.
            */}
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[20%] left-1/2 -translate-x-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-cyan-400/40 rounded-full blur-[70px] z-0 pointer-events-none" 
            />
            
            {/* Main Animated Video (Ping-Pong Loop) */}
            <div className="relative z-10 w-full flex justify-center">
              <video
                ref={videoRef}
                src={heroAnimatedVideo}
                className="w-full max-w-sm sm:max-w-md md:max-w-xl h-auto drop-shadow-2xl rounded-2xl"
                autoPlay
                muted
                playsInline
                // Note: No 'loop' attribute here because our useEffect handles the reverse ping-pong looping
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
