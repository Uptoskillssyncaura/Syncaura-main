import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Layers, MessageSquare, BarChart3, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const features = [
  {
    key: 'project',
    icon: Layers,
    label: 'Project Management',
    desc: 'Plan, track & deliver projects on time with full visibility.',
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.18)',
    grad: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.08))',
  },
  {
    key: 'chat',
    icon: MessageSquare,
    label: 'Team Chat',
    desc: 'Real-time messaging, threads & file sharing in one place.',
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.18)',
    grad: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.08))',
  },
  {
    key: 'sched',
    icon: Calendar,
    label: 'Smart Scheduling',
    desc: 'AI-assisted scheduling that keeps your entire team in sync.',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.18)',
    grad: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.08))',
  },
  {
    key: 'analytics',
    icon: BarChart3,
    label: 'Performance Analytics',
    desc: 'Live dashboards & insights to drive smarter decisions.',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.18)',
    grad: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(239,68,68,0.06))',
  },
];

const checklistItems = [
  { key: 'workflow_checklist_1', text: 'Unified inbox for tasks, chats & meetings' },
  { key: 'workflow_checklist_2', text: 'Real-time collaboration across all tools' },
  { key: 'workflow_checklist_3', text: 'AI-powered performance insights' },
  { key: 'workflow_checklist_4', text: 'Zero setup — ready in under 2 minutes' },
];

const statsItems = [
  { key: 'uptime', val: '98%',  label: 'Uptime SLA',       color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.22)'  },
  { key: 'speed',  val: '3×',   label: 'Faster Delivery',  color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.22)' },
  { key: 'teams',  val: '50K+', label: 'Teams Worldwide',  color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.22)' },
  { key: 'setup',  val: '<2min',label: 'Setup Time',       color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.22)' },
];

const WorkflowSection = () => {
  const { t } = useTranslation();
  const scrollToFeatures = (e) => {
    e.preventDefault();
    const element = document.getElementById('features');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="w-full py-16 md:py-24 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-500 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 right-0 w-[400px] h-[400px] rounded-full bg-indigo-500 blur-[100px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          <div className="space-y-8">

            {/* Glowing "Workflow" Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12))',
                border: '1px solid rgba(59,130,246,0.25)',
                color: '#60a5fa',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              {t('workflow_badge', 'Workflow')}
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('workflow_title_1', 'Work smarter,')}{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)' }}
              >
                {t('workflow_title_2', 'collaborate')}
              </span>
              <br />{t('workflow_title_3', 'faster.')}
            </motion.h2>

            <div className="grid grid-cols-2 gap-4">
              {features.map(({ key, icon: Icon, label, desc, color, glow, grad }, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 24, rotateX: 8 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.2 + i * 0.09, ease: 'easeOut' }}
                  whileHover={{ y: -6, scale: 1.03, rotateX: -3, rotateY: 3 }}
                  style={{
                    background: grad,
                    border: `1px solid ${color}30`,
                    boxShadow: `0 8px 32px ${glow}, inset 0 1px 0 rgba(255,255,255,0.06)`,
                    transformStyle: 'preserve-3d',
                    perspective: 800,
                    cursor: 'default',
                  }}
                  className="relative flex flex-col gap-3 p-5 rounded-2xl overflow-hidden group transition-all duration-300"
                >
                  <div
                    className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-xl opacity-40 pointer-events-none"
                    style={{ backgroundColor: color }}
                  />

                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${color}22, ${color}10)`,
                      border: `1px solid ${color}40`,
                      boxShadow: `0 4px 16px ${color}25`,
                    }}
                  >
                    <Icon size={20} style={{ color }} />
                  </div>

                  <div>
                    <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {t(`workflow_feat_${key}_label`, label)}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', opacity: 0.75 }}>
                      {t(`workflow_feat_${key}_desc`, desc)}
                    </p>
                  </div>

                  <div
                    className="absolute bottom-0 left-4 right-4 h-[1.5px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <Link to="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                    boxShadow: '0 8px 32px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
                  }}
                >
                  <span className="absolute inset-0 bg-white/20 -translate-x-[150%] skew-x-[-20deg] group-hover:translate-x-[150%] transition-transform duration-700" />
                  {t('workflow_startFreeBtn', 'Start for free')}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </motion.button>
              </Link>

              <motion.button
                onClick={scrollToFeatures}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all bg-white hover:bg-gray-50 text-gray-800"
                style={{
                  border: '1px solid var(--border-color)'
                }}
              >
                {t('workflow_exploreBtn', 'Explore features')}
                <ArrowRight size={14} className="opacity-60" />
              </motion.button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div
              className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
            />

            <div
              className="relative rounded-2xl p-8 md:p-10 space-y-8"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.08)',
              }}
            >
              <div
                className="absolute top-0 left-8 right-8 h-[2px] rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, #3b82f6, #6366f1, transparent)' }}
              />

              <p
                className="text-base md:text-lg leading-relaxed font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t('workflow_desc_p1', 'From planning to execution, everything happens in one place. No more switching between tools. No more lost messages.')}{' '}
                <span
                  className="font-bold text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                >
                  {t('workflow_desc_highlight', 'Just pure productivity.')}
                </span>
              </p>

              <ul className="space-y-3.5">
                {checklistItems.map((item, i) => (
                  <motion.li
                    key={item.key}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                    className="flex items-start gap-3 text-sm font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <CheckCircle2 size={16} style={{ color: '#22c55e', flexShrink: 0, marginTop: 1 }} />
                    {t(item.key, item.text)}
                  </motion.li>
                ))}
              </ul>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                {statsItems.map(({ key, val, label, color, bg, border }) => (
                  <motion.div
                    key={key}
                    whileHover={{ y: -3, scale: 1.03 }}
                    className="relative flex flex-col items-center justify-center py-4 px-3 rounded-xl text-center overflow-hidden group cursor-default"
                    style={{
                      background: bg,
                      border: `1px solid ${border}`,
                      boxShadow: `0 4px 16px ${color}10`,
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <div
                      className="absolute -top-3 -right-3 w-10 h-10 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none"
                      style={{ backgroundColor: color }}
                    />
                    <p
                      className="text-2xl font-black text-transparent bg-clip-text leading-none"
                      style={{ backgroundImage: `linear-gradient(135deg, ${color}, ${color}bb)` }}
                    >
                      {t(`workflow_stat_${key}_val`, val)}
                    </p>
                    <p
                      className="text-[10px] font-bold mt-1.5 uppercase tracking-widest"
                      style={{ color: 'var(--text-secondary)', opacity: 0.65 }}
                    >
                      {t(`workflow_stat_${key}_label`, label)}
                    </p>
                    <div
                      className="absolute bottom-0 left-3 right-3 h-[1.5px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;