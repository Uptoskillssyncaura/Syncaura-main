import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import avatar1 from "../../assets/10-Photoroom.png";
import avatar2 from "../../assets/12-Photoroom.png";
import avatar3 from "../../assets/13-Photoroom.png";
import avatar4 from "../../assets/14-Photoroom.png";


/* 
  ─── Floating Orb ─────────────────────────────────────────── 
  A reusable component that creates a glowing, blurry circle.
  It slowly bobs up and down and pulses in scale using framer-motion.
*/
const Orb = ({ className, delay = 0, duration = 6 }) => (
  <motion.div
    className={`absolute rounded-full blur-[80px] pointer-events-none ${className}`}
    animate={{ y: [0, -30, 0], scale: [1, 1.15, 1], opacity: [0.5, 0.85, 0.5] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

/* ─── Animated grid overlay ─────────────────────────────────── */
const GridLines = () => (
  <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="ctaGrid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ctaGrid)" />
    </svg>
  </div>
);

/* 
  ─── 3D Tilt Card wrapper ──────────────────────────────────── 
  This wrapper listens to the mouse position (onMouseMove).
  It calculates how far the mouse is from the center of the card,
  and gently tilts the card in 3D space using rotateX and rotateY.
*/
const TiltCard = ({ children }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // useSpring creates a smooth, physics-based transition for the tilt
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    // Calculate mouse position relative to the center of the card (-0.5 to 0.5)
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  // Reset tilt when the mouse leaves the card
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

/* ─── Main Component ────────────────────────────────────────── */
const CTABanner = () => {
  return (
    <section
      className="w-full py-16 md:py-24"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-16">
        <TiltCard>
          {/* MAIN CARD */}
          <div
            className="relative overflow-hidden rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, #0f0c29 0%, #0d1b4b 40%, #0a1628 70%, #050d1a 100%)',
              boxShadow: '0 40px 100px -20px rgba(59,130,246,0.35), 0 0 0 1px rgba(255,255,255,0.07)',
            }}
          >
            <GridLines />

            {/* ── Floating colour orbs ── */}
            <Orb className="w-80 h-80 bg-blue-500/30 -top-20 -left-20" delay={0} duration={7} />
            <Orb className="w-96 h-96 bg-cyan-400/20 -bottom-28 -right-20" delay={1.5} duration={8} />
            <Orb className="w-56 h-56 bg-indigo-600/30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" delay={0.8} duration={6} />

            {/* ── Top accent line ── */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1.5px]"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.7), rgba(147,197,253,0.9), rgba(99,179,237,0.7), transparent)' }}
            />

            {/* ── Sparkle icons ── */}
            {[
              { top: '12%', left: '8%', size: 14, delay: 0 },
              { top: '20%', right: '10%', size: 10, delay: 0.6 },
              { bottom: '18%', left: '15%', size: 8, delay: 1.2 },
              { bottom: '14%', right: '12%', size: 12, delay: 0.9 },
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute text-cyan-300/60 pointer-events-none"
                style={{ top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8], rotate: [0, 20, 0] }}
                transition={{ duration: 3, delay: pos.delay, repeat: Infinity }}
              >
                <Sparkles size={pos.size} />
              </motion.div>
            ))}

            {/* ── CONTENT ── */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 md:px-16 py-20 md:py-28 space-y-8">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 backdrop-blur-sm"
              >
                <Zap size={13} className="text-cyan-300" />
                <span className="text-xs font-semibold tracking-widest text-cyan-300 uppercase">All-in-one platform</span>
              </motion.div>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight text-white max-w-4xl"
                style={{ textShadow: '0 0 40px rgba(147,197,253,0.25)' }}
              >
                Work smarter,{' '}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #38bdf8 40%, #a78bfa 100%)' }}
                >
                  faster,
                </span>
                <br />
                <span className="text-white">together.</span>
              </motion.h2>

              {/* Sub-text */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base md:text-lg lg:text-xl text-white/60 max-w-xl leading-relaxed"
              >
                Manage tasks, chat, meet, and track performance — all in{' '}
                <span className="text-white/90 font-semibold">one seamless workspace</span>.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                {/* Primary */}
                <Link to="/sign-up">
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm md:text-base font-bold text-white overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                      boxShadow: '0 10px 40px rgba(37,99,235,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
                    }}
                  >
                    <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-[150%] skew-x-[-20deg] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                    Get Started Free
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </Link>

                {/* Secondary */}
                <Link to="/learn-more" className="inline-block">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="group flex items-center gap-2 px-8 py-4 rounded-2xl text-sm md:text-base font-semibold text-white/80 hover:text-white transition-colors"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    Learn more
                    <ArrowRight size={14} className="opacity-60 group-hover:opacity-100 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </Link>
              </motion.div>

              {/* 
                SOCIAL PROOF AVATARS
                A small row of overlapping user avatars at the bottom, 
                along with a 5-star rating to build trust.
              */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-col sm:flex-row items-center gap-4 pt-2"
              >
                {/* Overlapping Avatar Stack */}
                <div className="flex items-center">
                  {[avatar1, avatar2, avatar3, avatar4].map((src, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                      className="relative"
                      style={{ marginLeft: i === 0 ? 0 : '-10px', zIndex: i }}
                    >
                      <div
                        className="w-11 h-11 rounded-full overflow-hidden"
                        style={{
                          border: '2px solid rgba(96,165,250,0.5)',
                          boxShadow: '0 0 12px rgba(96,165,250,0.35), 0 0 0 1px rgba(255,255,255,0.06)',
                        }}
                      >
                        <img
                          src={src}
                          alt={`user-${i + 1}`}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'center 8%' }}
                        />
                      </div>
                    </motion.div>
                  ))}

                  {/* +more badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.82 }}
                    className="relative w-11 h-11 rounded-full flex items-center justify-center text-[10px] font-bold text-white/80"
                    style={{
                      marginLeft: '-10px',
                      zIndex: 4,
                      background: 'linear-gradient(135deg, #1e3a5f, #1a2b4a)',
                      border: '2px solid rgba(96,165,250,0.4)',
                      boxShadow: '0 0 10px rgba(96,165,250,0.2)',
                    }}
                  >
                    +9K
                  </motion.div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px h-8 bg-white/10" />

                {/* Stars + Text */}
                <div className="flex flex-col items-center sm:items-start gap-1">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < 4 ? 'text-amber-400' : 'text-amber-400/40'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                    <span className="ml-1.5 text-xs font-semibold text-white/60">4.4 / 5</span>
                  </div>
                  <p className="text-xs text-white/40 font-medium leading-snug">
                    Trusted by <span className="text-white/70 font-bold">10,000+</span> professionals worldwide
                  </p>
                </div>
              </motion.div>


            </div>

            {/* ── Bottom accent line ── */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.3), transparent)' }}
            />
          </div>
        </TiltCard>
      </div>
    </section>
  );
};

export default CTABanner;
