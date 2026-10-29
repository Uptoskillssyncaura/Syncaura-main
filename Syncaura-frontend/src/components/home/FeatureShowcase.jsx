import React from 'react';
import { motion } from 'framer-motion';
import dashboardPreview from "../../assets/Imageto.PNG";
import { Zap, CheckCircle2, Layers, MessageSquare, BarChart3, Users, Clock, ShieldCheck } from 'lucide-react';

const stats = [
  { val: '10+',   label: 'Modules',  icon: Layers,     color: '#3b82f6' },
  { val: '99.9%', label: 'Uptime',   icon: ShieldCheck, color: '#22c55e' },
  { val: '50K+',  label: 'Users',    icon: Users,      color: '#8b5cf6' },
  { val: '<2min', label: 'Setup',    icon: Clock,      color: '#f59e0b' },
];

const featureList = [
  { icon: Layers,        color: '#3b82f6', text: 'Unified project & task management' },
  { icon: MessageSquare, color: '#8b5cf6', text: 'Real-time team chat & threads'     },
  { icon: BarChart3,     color: '#06b6d4', text: 'Live performance dashboards'       },
  { icon: ShieldCheck,   color: '#22c55e', text: 'Enterprise-grade security & uptime'},
];

const FeatureShowcase = () => {
  return (
    <section
      id="showcase"
      className="w-full py-20 md:py-32 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* 
        RICH BACKGROUND
        Large, slow-moving blurred orbs that create a subtle ambient glow 
        behind the entire section.
      */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 left-1/4 w-[700px] h-[400px] rounded-full blur-[120px]"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 12, delay: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[300px] rounded-full blur-[100px]"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #6366f1)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">

        {/* ── Section Header ── */}
        <div className="text-center mb-16 md:mb-24 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15))',
              border: '1px solid rgba(139,92,246,0.3)',
              color: '#a78bfa',
            }}
          >
            <Zap size={12} className="animate-pulse" />
            All-in-one platform
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]"
            style={{ color: 'var(--text-primary)' }}
          >
            Work Smarter.{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)' }}
            >
              Collaborate Faster.
            </span>
            <br />Grow Together.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            From planning and collaboration to deployment and performance tracking —
            everything in one platform.
          </motion.p>
        </div>

        {/* 
          MAIN CONTENT CARD 
          A massive, glass-like container that holds the feature text, stats, and the main image.
          Uses a subtle border and shadow to lift it off the background.
        */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        >
          {/* Rainbow Top Border Accent */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ background: 'linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6, #06b6d4)' }}
          />

          <div className="grid lg:grid-cols-2 gap-0">

            {/* ── LEFT: Text + Stats + Feature list ── */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-10">

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <h3
                  className="text-3xl md:text-4xl font-black leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  From Start to Success —{' '}
                  <span
                    className="text-transparent bg-clip-text"
                    style={{ backgroundImage: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                  >
                    All in One Workspace
                  </span>
                </h3>
                <p
                  className="text-sm md:text-base leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  FlowBit streamlines your workflow from planning to execution. Manage projects,
                  tasks, chats, meetings, documents, attendance, and performance — all inside one
                  seamless and modern platform built to scale with your team.
                </p>
              </motion.div>

              {/* ── STAT CARDS ── */}
              <div className="grid grid-cols-2 gap-3">
                {stats.map(({ val, label, icon: Icon, color }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                    whileHover={{ y: -4, scale: 1.04 }}
                    className="relative flex items-center gap-3.5 p-4 rounded-2xl overflow-hidden group cursor-default"
                    style={{
                      background: `linear-gradient(135deg, ${color}12, ${color}06)`,
                      border: `1px solid ${color}28`,
                      boxShadow: `0 4px 20px ${color}15`,
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${color}25, ${color}10)`,
                        border: `1px solid ${color}35`,
                      }}
                    >
                      <Icon size={18} style={{ color }} />
                    </div>
                    {/* Value + Label */}
                    <div>
                      <p
                        className="text-xl font-black leading-none text-transparent bg-clip-text"
                        style={{ backgroundImage: `linear-gradient(135deg, ${color}, ${color}aa)` }}
                      >{val}</p>
                      <p className="text-[11px] font-semibold mt-0.5 uppercase tracking-wide" style={{ color: 'var(--text-secondary)', opacity: 0.65 }}>{label}</p>
                    </div>
                    {/* Corner glow */}
                    <div
                      className="absolute -top-3 -right-3 w-12 h-12 rounded-full blur-lg opacity-30 group-hover:opacity-55 transition-opacity"
                      style={{ backgroundColor: color }}
                    />
                    {/* Bottom accent on hover */}
                    <div
                      className="absolute bottom-0 left-3 right-3 h-[1.5px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* ── FEATURE CHECKLIST ── */}
              <motion.ul
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="space-y-3"
              >
                {featureList.map(({ icon: Icon, color, text }, i) => (
                  <motion.li
                    key={text}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.48 + i * 0.07 }}
                    className="flex items-center gap-3 text-sm font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                    >
                      <CheckCircle2 size={13} style={{ color }} />
                    </div>
                    {text}
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* ── RIGHT: Dashboard Image ── */}
            <div
              className="relative flex items-center justify-center p-6 md:p-10 lg:p-12"
              style={{ borderLeft: '1px solid var(--border-color)' }}
            >
              {/* Background radial glow specifically behind the image */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(99,102,241,0.2) 0%, transparent 65%)' }}
              />

              {/* 
                3D IMAGE CONTAINER
                Holds the main product screenshot (downimg.png) along with floating 
                statistic badges that bob up and down infinitely.
              */}
              <motion.div
                initial={{ opacity: 0, y: 30, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.25 }}
                style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
                className="relative w-full"
              >
                {/* Outer glow ring — adapts per theme */}
                <div
                  className="absolute -inset-4 rounded-3xl blur-2xl opacity-30 pointer-events-none dark-glow light-glow"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                />

                {/* Image frame */}
                <div
                  className="relative rounded-2xl overflow-hidden feature-img-frame"
                  style={{
                    boxShadow: '0 32px 90px rgba(59,130,246,0.22), 0 0 0 1px rgba(99,102,241,0.22)',
                    background: 'var(--card-bg)',
                    padding: '6px',
                  }}
                >
                  {/* Elegant Theme-Aware Image Frame */}
                  <div className="rounded-xl overflow-hidden relative group">
                    
                    {/* Dark/Light mode base background to ensure contrast if image is transparent */}
                    <div className="absolute inset-0 bg-[var(--card-bg)] transition-colors duration-300"></div>

                    <img
                      src={dashboardPreview}
                      alt="FlowBit workspace — all in one platform"
                      loading="lazy"
                      decoding="async"
                      className="relative z-10 w-full h-auto block transform group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                    />
                    
                    {/* Subtle shine overlay — adapts to theme via CSS variables */}
                    <div
                      className="absolute inset-0 pointer-events-none z-20"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
                        mixBlendMode: 'overlay'
                      }}
                    />
                    
                    {/* Glassmorphic border ring inside the frame */}
                    <div className="absolute inset-0 z-30 pointer-events-none rounded-xl border border-white/20 dark:border-white/10" />
                  </div>
                </div>

                {/* Floating badge — top right */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-4 -right-4 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: '#fff',
                    boxShadow: '0 8px 24px rgba(34,197,94,0.4)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Live & Syncing
                </motion.div>

                {/* Floating badge — bottom left */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-4 -left-4 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl shadow-xl"
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    boxShadow: '0 8px 32px rgba(99,102,241,0.2)',
                  }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    <BarChart3 size={13} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black" style={{ color: 'var(--text-primary)' }}>+24% ↑</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-secondary)', opacity: 0.65 }}>Productivity</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};


export default FeatureShowcase;

