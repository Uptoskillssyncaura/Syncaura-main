import React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export const FileMoving = () => {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center cursor-pointer group" style={{ perspective: 500 }}>
      <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all duration-500" />
      <div className="absolute inset-0 flex items-center justify-center overflow-visible">
        <motion.div
          animate={{ y: [-8, -36, -22, -8], x: [0, 10, -6, 0], rotateX: [0, 40, 10, 0], rotateY: [0, -25, 15, 0], opacity: [0, 1, 1, 0], scale: [0.7, 1, 0.9, 0.7] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0 }}
          className="absolute w-10 h-12 bg-gradient-to-br from-white to-slate-100 rounded border border-slate-200/60 shadow-md p-1.5 flex flex-col gap-1"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="w-6 h-1 bg-blue-500/70 rounded" />
          <div className="w-5 h-0.5 bg-slate-400/50 rounded" />
          <div className="w-4 h-0.5 bg-slate-400/50 rounded" />
        </motion.div>
        <motion.div
          animate={{ y: [-6, -28, -18, -6], x: [-4, -14, 8, -4], rotateX: [10, -30, 35, 10], rotateY: [-8, 20, -14, -8], opacity: [0, 0.9, 0.9, 0], scale: [0.6, 0.95, 0.85, 0.6] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
          className="absolute w-9 h-10 bg-gradient-to-br from-blue-50 to-white rounded border border-blue-100/60 shadow-md p-1 flex flex-col gap-1"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="w-5 h-0.5 bg-blue-400/60 rounded" />
          <div className="w-4 h-0.5 bg-slate-400/40 rounded" />
        </motion.div>
        <motion.div
          animate={{ y: [-4, -32, -16, -4], x: [6, -8, 4, 6], rotateX: [-12, 18, -10, -12], rotateY: [12, -12, 8, 12], opacity: [0, 0.85, 0.85, 0], scale: [0.6, 0.9, 0.8, 0.6] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          className="absolute w-9 h-11 bg-gradient-to-br from-white to-slate-50/90 rounded border border-slate-200/40 shadow-md p-1 flex flex-col gap-1"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="w-6 h-0.5 bg-emerald-400/60 rounded" />
          <div className="w-4 h-0.5 bg-slate-400/40 rounded" />
        </motion.div>
      </div>
      <motion.div
        whileHover={{ rotateY: 15, rotateX: -5, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="relative z-10 w-18 h-14 flex flex-col"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-blue-600/90 rounded-lg shadow-lg border border-blue-400/20" style={{ transform: "rotateX(8deg)" }} />
        <div className="absolute -top-2 left-1.5 w-5 h-2.5 bg-blue-600/90 rounded-t border-t border-r border-l border-blue-400/20" style={{ transform: "rotateX(8deg)" }} />
        <motion.div
          animate={{ rotateX: [10, 22, 10] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-br from-blue-400/80 to-blue-600/90 rounded-lg border border-white/15 origin-bottom shadow-inner"
          style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-white/20 rounded-lg" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export const TimeRunning = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center cursor-pointer group" style={{ perspective: 500 }}>
      <div className="absolute w-20 h-20 rounded-full bg-indigo-500/10 blur-lg" />

      <motion.div
        whileHover={{ rotateY: -15, rotateX: 10, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          transformStyle: "preserve-3d",
          background: "radial-gradient(circle at 30% 25%, #4338ca, #1e1b4b 80%)",
          boxShadow: "0 4px 20px rgba(67,56,202,0.6), inset 0 1px 0 rgba(255,255,255,0.15)",
          border: "2px solid rgba(129,140,248,0.35)"
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: i % 3 === 0 ? "2px" : "1px",
              height: i % 3 === 0 ? "6px" : "4px",
              background: i % 3 === 0 ? "rgba(199,210,254,0.9)" : "rgba(199,210,254,0.4)",
              borderRadius: "1px",
              top: "4px",
              left: "calc(50% - 1px)",
              transformOrigin: "bottom center",
              transform: `rotate(${i * 30}deg) translateY(0px)`,
              transformOrigin: `1px ${(80 / 2) - 4}px`
            }}
          />
        ))}

        <div
          className="absolute rounded-full"
          style={{
            width: "2px",
            height: "22px",
            background: "rgba(199,210,254,0.85)",
            borderRadius: "2px",
            bottom: "50%",
            left: "calc(50% - 1px)",
            transformOrigin: "bottom center",
            transform: `rotate(${hourDeg}deg)`,
            transition: "transform 0.5s ease"
          }}
        />

        <div
          className="absolute rounded-full"
          style={{
            width: "1.5px",
            height: "28px",
            background: "#a5b4fc",
            borderRadius: "2px",
            bottom: "50%",
            left: "calc(50% - 0.75px)",
            transformOrigin: "bottom center",
            transform: `rotate(${minuteDeg}deg)`,
            transition: "transform 0.5s ease"
          }}
        />

        <div
          className="absolute rounded-full"
          style={{
            width: "1px",
            height: "32px",
            background: "#73FBFD",
            borderRadius: "2px",
            bottom: "50%",
            left: "calc(50% - 0.5px)",
            transformOrigin: "bottom center",
            transform: `rotate(${secondDeg}deg)`,
            transition: "transform 0.2s ease",
            boxShadow: "0 0 4px #73FBFD"
          }}
        />

        <div
          className="absolute rounded-full"
          style={{
            width: "5px",
            height: "5px",
            background: "#73FBFD",
            border: "1px solid rgba(255,255,255,0.7)",
            borderRadius: "50%",
            boxShadow: "0 0 6px #73FBFD",
            zIndex: 10
          }}
        />
      </motion.div>
    </div>
  );
};


export const DynamicCollaboration = () => {
  const [checked, setChecked] = React.useState([false, false, false, false]);

  React.useEffect(() => {
    const timers = [
      setTimeout(() => setChecked([true, false, false, false]), 600),
      setTimeout(() => setChecked([true, true, false, false]), 1400),
      setTimeout(() => setChecked([true, true, true, false]), 2200),
      setTimeout(() => setChecked([false, false, false, false]), 3800),
    ];
    const loop = setInterval(() => {
      setChecked([false, false, false, false]);
      setTimeout(() => setChecked([true, false, false, false]), 600);
      setTimeout(() => setChecked([true, true, false, false]), 1400);
      setTimeout(() => setChecked([true, true, true, false]), 2200);
    }, 4400);
    return () => { timers.forEach(clearTimeout); clearInterval(loop); };
  }, []);

  const tasks = ["Plan", "Develop", "Test", "Deploy"];

  return (
    <div className="relative w-24 h-24 flex items-center justify-center cursor-pointer group" style={{ perspective: 600 }}>
      <div className="absolute inset-0 bg-amber-700/10 rounded-full blur-xl group-hover:bg-amber-700/20 transition-all duration-500" />

      <motion.div
        whileHover={{ rotateY: 10, rotateX: -5, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="relative z-10"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Wooden Board */}
        <div style={{
          width: "68px",
          height: "82px",
          borderRadius: "8px",
          background: "linear-gradient(145deg, #d4a373, #a67c52)",
          boxShadow: "3px 5px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
          border: "1px solid rgba(139, 69, 19, 0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative"
        }}>
          
          {/* Paper */}
          <div style={{
            width: "56px",
            height: "72px",
            background: "#fdfdfd",
            borderRadius: "2px",
            boxShadow: "1px 1px 4px rgba(0,0,0,0.15)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            padding: "10px 4px 4px 4px",
            overflow: "hidden"
          }}>
            {/* Title */}
            <div style={{
              fontSize: "9px",
              fontWeight: "bold",
              color: "#1e3a8a",
              textAlign: "center",
              marginBottom: "1px",
              fontFamily: "'Comic Sans MS', cursive, sans-serif"
            }}>
              Projects
            </div>
            {/* Underline */}
            <div style={{ width: "80%", height: "1px", background: "#1e3a8a", margin: "0 auto 6px auto", opacity: 0.6 }} />

            {/* Checklists */}
            {tasks.map((task, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginBottom: "4px",
                paddingLeft: "4px"
              }}>
                <div style={{
                  width: "8px",
                  height: "8px",
                  border: "1px solid #1e3a8a",
                  borderRadius: "1px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative"
                }}>
                  {checked[i] && (
                    <motion.svg
                      initial={{ opacity: 0, pathLength: 0 }}
                      animate={{ opacity: 1, pathLength: 1 }}
                      transition={{ duration: 0.2 }}
                      width="6" height="6" viewBox="0 0 6 6"
                      style={{ position: "absolute", top: "0.5px", left: "0.5px" }}
                    >
                      <polyline
                        points="1,3 2.5,4.5 5,1"
                        fill="none"
                        stroke="#1e3a8a"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  )}
                </div>
                <div style={{
                  fontSize: "6.5px",
                  color: "#1e293b",
                  fontFamily: "'Comic Sans MS', cursive, sans-serif"
                }}>
                  {task}
                </div>
                {/* Thin line under text */}
                <div style={{
                  flex: 1,
                  height: "0.5px",
                  background: "rgba(0,0,0,0.2)",
                  alignSelf: "flex-end",
                  marginBottom: "1px",
                  marginLeft: "2px"
                }} />
              </div>
            ))}
            
            {/* Yellow Sticky Note */}
            <motion.div 
              style={{
                position: "absolute",
                top: "3px",
                right: "-2px",
                width: "22px",
                height: "22px",
                background: "#fef08a",
                boxShadow: "-1px 1px 3px rgba(0,0,0,0.15)",
                transform: "rotate(6deg)",
                padding: "2px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 10
              }}
            >
              <div style={{ fontSize: "3.5px", lineHeight: "1.1", color: "#333", textAlign: "center", fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
                Team Work<br/>Makes<br/>Things<br/>Happen!
              </div>
              <svg width="5" height="5" viewBox="0 0 10 10" style={{ marginTop: "1px" }}>
                 <circle cx="5" cy="5" r="4" fill="none" stroke="#333" strokeWidth="0.5"/>
                 <circle cx="3.5" cy="4" r="0.5" fill="#333"/>
                 <circle cx="6.5" cy="4" r="0.5" fill="#333"/>
                 <path d="M 3 6 Q 5 8 7 6" fill="none" stroke="#333" strokeWidth="0.5" strokeLinecap="round"/>
              </svg>
            </motion.div>
          </div>

          {/* Metal Clip Top */}
          <div style={{
            position: "absolute",
            top: "-5px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "28px",
            height: "14px",
            background: "linear-gradient(to bottom, #d1d5db, #9ca3af)",
            borderRadius: "4px 4px 2px 2px",
            border: "1px solid #6b7280",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 15
          }}>
            {/* Clip Hole part */}
            <div style={{
                marginTop: "-3px",
                width: "12px",
                height: "6px",
                border: "1px solid #6b7280",
                borderBottom: "none",
                borderRadius: "4px 4px 0 0",
                background: "#d1d5db",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#4b5563", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)" }} />
            </div>
            
            {/* Clip bar */}
            <div style={{ position: "absolute", bottom: "1px", width: "24px", height: "3px", background: "linear-gradient(to bottom, #f3f4f6, #9ca3af)", borderRadius: "1px", border: "1px solid #6b7280" }} />
            <div style={{ position: "absolute", bottom: "6px", width: "16px", height: "2px", background: "rgba(0,0,0,0.1)", borderRadius: "1px" }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};


export const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        animate={{ x: [0, 60, -30, 90, 0], y: [0, 80, 160, 60, 0], rotate: [0, 90, 180, 270, 360] }}
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-52 h-52 rounded-full"
        style={{
          top: "10%", left: "8%",
          background: "radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.22), rgba(79, 70, 229, 0.04) 55%, transparent 80%)",
          boxShadow: "inset -8px -8px 20px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.08)"
        }}
      />
      <motion.div
        animate={{ x: [0, -80, 50, -100, 0], y: [0, 100, -50, 80, 0], rotate: [360, 270, 180, 90, 0] }}
        transition={{ duration: 42, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-64 h-64 rounded-full"
        style={{
          bottom: "8%", right: "5%",
          background: "radial-gradient(circle at 30% 30%, rgba(20, 184, 166, 0.18), rgba(13, 148, 136, 0.03) 55%, transparent 80%)",
          boxShadow: "inset -10px -10px 26px rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.06)"
        }}
      />
      <motion.div
        animate={{ x: [0, 80, -60, 60, 0], y: [0, -60, 90, -30, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-40 h-40 rounded-full"
        style={{
          top: "42%", left: "48%",
          background: "radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.16), rgba(109, 40, 217, 0.03) 55%, transparent 80%)",
          boxShadow: "inset -6px -6px 18px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.05)"
        }}
      />
    </div>
  );
};

export const TrustStats = () => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => {
    if (latest >= 2000000) return "2M+";
    if (latest >= 1000000) return (latest / 1000000).toFixed(1) + "M+";
    if (latest >= 1000) return (latest / 1000).toFixed(0) + "K+";
    return Math.round(latest);
  });

  const pct = useMotionValue(0);
  const pctRounded = useTransform(pct, latest => Math.round(latest) + "%");

  React.useEffect(() => {
    const controls1 = animate(count, 2000000, { duration: 2.5, ease: "easeOut" });
    const controls2 = animate(pct, 98, { duration: 2.5, ease: "easeOut", delay: 0.5 });
    return () => { controls1.stop(); controls2.stop(); };
  }, []);

  return (
    <div className="w-full mt-12 mb-4">
      <div className="mb-8">
        <h3 className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-widest">Growth</h3>
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Millions trust Flowbit daily</h2>
        <p className="text-slate-300 text-sm leading-relaxed max-w-lg font-light">
          Over two million users worldwide depend on Flowbit to manage their work. Students, teams, and organizations choose us because we deliver results.
        </p>
      </div>

      <div className="flex gap-6 items-center" style={{ perspective: 1000 }}>
        {/* 2M+ Stat Card */}
        <motion.div 
          whileHover={{ rotateY: 12, rotateX: -8, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="relative group p-6 rounded-2xl flex flex-col justify-center w-[220px]"
          style={{ transformStyle: "preserve-3d", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <motion.h3 
            style={{ transform: "translateZ(40px)" }}
            className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-2"
          >
            {rounded}
          </motion.h3>
          <p style={{ transform: "translateZ(20px)" }} className="text-slate-400 text-sm font-medium">Active users across the globe</p>
        </motion.div>

        {/* 98% Stat Card */}
        <motion.div 
          whileHover={{ rotateY: -12, rotateX: 8, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="relative group p-6 rounded-2xl flex flex-col justify-center w-[260px]"
          style={{ transformStyle: "preserve-3d", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex items-center gap-4">
             {/* 3D Circular Progress inside the card */}
             <div className="relative w-16 h-16 flex items-center justify-center shrink-0" style={{ transform: "translateZ(50px)" }}>
                <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90 drop-shadow-[0_0_10px_rgba(20,184,166,0.6)]">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <motion.circle 
                    cx="32" cy="32" r="28" 
                    fill="none" 
                    stroke="url(#tealGrad)" 
                    strokeWidth="6" 
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 28}
                    initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                    animate={{ strokeDashoffset: (2 * Math.PI * 28) * (1 - 0.98) }}
                    transition={{ duration: 2.5, ease: "easeOut", delay: 0.5 }}
                  />
                  <defs>
                    <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2dd4bf" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span className="text-white font-bold text-sm tracking-tighter">{pctRounded}</motion.span>
                </div>
             </div>

             <div className="flex flex-col">
               <motion.h3 
                 style={{ transform: "translateZ(30px)" }}
                 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-1 leading-none"
               >
                 {pctRounded}
               </motion.h3>
               <p style={{ transform: "translateZ(15px)" }} className="text-slate-400 text-xs leading-snug">User satisfaction rating from our community</p>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
