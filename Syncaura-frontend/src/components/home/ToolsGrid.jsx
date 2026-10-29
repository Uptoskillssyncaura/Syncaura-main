import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers, MessageSquare, Video, Clock,
  FileText, BarChart3, ShieldCheck, Zap
} from 'lucide-react';

const tools = [
  {
    icon: Layers,
    title: 'Task & Project Management',
    description: 'Create tasks, set priorities, add deadlines, and track progress with Kanban or Gantt views — everything stays organized.',
    color: '#3b82f6',
    grad: 'linear-gradient(135deg, rgba(59,130,246,0.14), rgba(99,102,241,0.06))',
    number: '01',
  },
  {
    icon: MessageSquare,
    title: 'Real-time Chat',
    description: 'Chat instantly, share files, and collaborate in private or group channels with real-time updates.',
    color: '#8b5cf6',
    grad: 'linear-gradient(135deg, rgba(139,92,246,0.14), rgba(99,102,241,0.06))',
    number: '02',
  },
  {
    icon: Video,
    title: 'Meetings & Video Calls',
    description: 'Schedule meetings with auto Google Meet/Zoom links, calendar sync, and notes — all in one place.',
    color: '#06b6d4',
    grad: 'linear-gradient(135deg, rgba(6,182,212,0.14), rgba(59,130,246,0.06))',
    number: '03',
  },
  {
    icon: Clock,
    title: 'Attendance & Leave Tracker',
    description: 'Mark attendance, request or approve leave, and monitor team availability easily.',
    color: '#f59e0b',
    grad: 'linear-gradient(135deg, rgba(245,158,11,0.14), rgba(239,68,68,0.06))',
    number: '04',
  },
  {
    icon: FileText,
    title: 'Documents & Notes',
    description: 'Create, share, and co-edit rich documents, meeting notes, and wikis — all in one searchable workspace.',
    color: '#22c55e',
    grad: 'linear-gradient(135deg, rgba(34,197,94,0.14), rgba(6,182,212,0.06))',
    number: '05',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description: 'Live dashboards, KPI tracking, and team insights to drive smarter decisions across your organization.',
    color: '#ec4899',
    grad: 'linear-gradient(135deg, rgba(236,72,153,0.14), rgba(139,92,246,0.06))',
    number: '06',
  },
  {
    icon: ShieldCheck,
    title: 'Security & Compliance',
    description: 'Enterprise-grade encryption, role-based access control, and audit logs to keep your data safe.',
    color: '#14b8a6',
    grad: 'linear-gradient(135deg, rgba(20,184,166,0.14), rgba(59,130,246,0.06))',
    number: '07',
  },
  {
    icon: Zap,
    title: 'Automations & Integrations',
    description: 'Connect your favourite tools and automate repetitive tasks so your team can focus on what matters.',
    color: '#f97316',
    grad: 'linear-gradient(135deg, rgba(249,115,22,0.14), rgba(245,158,11,0.06))',
    number: '08',
  },
];

const ToolsGrid = () => {
  return (
    <section
      id="features"
      className="w-full py-20 md:py-28 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* 
        BACKGROUND ATMOSPHERE
        A large, blurred oval in the center of the screen that slowly pulses.
      */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-[130px]"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 relative z-10">

        {/* ── Section Header ── */}
        <div className="text-center mb-16 md:mb-20 space-y-5">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.12))',
              border: '1px solid rgba(99,102,241,0.28)',
              color: '#818cf8',
            }}
          >
            <Zap size={11} className="animate-pulse" />
            Tools &amp; Features
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]"
            style={{ color: 'var(--text-primary)' }}
          >
            Everything you need{' '}
            <span
              className="text-transparent bg-clip-text block sm:inline"
              style={{ backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)' }}
            >
              to work
            </span>
          </motion.h2>

          {/* Sub-text */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Each feature built to save time and{' '}
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              eliminate friction
            </span>{' '}
            from your daily workflow.
          </motion.p>
        </div>

        {/* 
          CARDS GRID 
          Maps through the 'tools' array defined at the top of the file to render 
          a responsive grid of feature cards (1 column on mobile, 2 on tablet, 4 on desktop).
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.number}
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: 'easeOut' }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative flex flex-col gap-4 p-6 rounded-2xl overflow-hidden cursor-default"
              style={{
                background: tool.grad,
                border: `1px solid ${tool.color}22`,
                boxShadow: `0 4px 24px ${tool.color}12`,
                transition: 'all 0.3s cubic-bezier(.22,1,.36,1)',
              }}
            >
              {/* 
                HOVER BORDER GLOW 
                An invisible inner border that fades in when you hover over the card.
              */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ boxShadow: `inset 0 0 0 1.5px ${tool.color}55` }}
              />

              {/* Corner glow */}
              <div
                className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-25 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none"
                style={{ backgroundColor: tool.color }}
              />

              {/* 
                NUMBER BADGE & ICON
                Shows the tool's icon in a styled bubble on the left, 
                and a large, faint background number on the right.
              */}
              <div className="flex items-center justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${tool.color}28, ${tool.color}10)`,
                    border: `1px solid ${tool.color}40`,
                    boxShadow: `0 6px 20px ${tool.color}22`,
                  }}
                >
                  <tool.icon size={22} style={{ color: tool.color }} />
                </div>

                <span
                  className="text-3xl font-black opacity-10 group-hover:opacity-20 transition-opacity select-none"
                  style={{ color: tool.color, fontVariantNumeric: 'tabular-nums' }}
                >
                  {tool.number}
                </span>
              </div>

              {/* Text */}
              <div className="space-y-2 flex-1">
                <h3
                  className="text-base font-bold leading-snug"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {tool.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--text-secondary)', opacity: 0.8 }}
                >
                  {tool.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-5 right-5 h-[1.5px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ToolsGrid;