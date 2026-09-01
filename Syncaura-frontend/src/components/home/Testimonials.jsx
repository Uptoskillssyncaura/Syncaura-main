import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const testimonials = [
  {
    key: "priya",
    quote: "We reduced 40% of manual work after switching to FlowBit. Attendance and leave tracking became completely effortless.",
    name: "Priya S",
    role: "HR Executive",
    company: "TechCorp India",
    initial: "P",
    color: "#f43f5e",
    rating: 4.8,
  },
  {
    key: "rahul",
    quote: "The UI is super clean and intuitive. Kanban boards and real-time chat make daily work so much smoother for our team.",
    name: "Rahul M",
    role: "Product Designer",
    company: "DesignHub",
    initial: "R",
    color: "#22c55e",
    rating: 5.0,
  },
  {
    key: "sneha",
    quote: "Scheduling meetings with auto Google Meet links is a lifesaver. No more jumping between tools. Everything just works.",
    name: "Sneha K",
    role: "Team Lead",
    company: "AgileWorks",
    initial: "S",
    color: "#6366f1",
    rating: 4.7,
  },
  {
    key: "vikas",
    quote: "Our documentation, tasks, and meetings stay perfectly in sync. It feels like having everything in one brain.",
    name: "Vikas R",
    role: "Engineering Manager",
    company: "BuildFast",
    initial: "V",
    color: "#f59e0b",
    rating: 4.9,
  },
  {
    key: "ananya",
    quote: "FlowBit completely transformed how our remote team collaborates. Productivity has never been this high.",
    name: "Ananya T",
    role: "COO",
    company: "ScaleUp Labs",
    initial: "A",
    color: "#06b6d4",
    rating: 4.5,
  },
  {
    key: "karan",
    quote: "Performance analytics in FlowBit helped us identify bottlenecks we never knew existed. Game-changer.",
    name: "Karan D",
    role: "CTO",
    company: "NexaCloud",
    initial: "K",
    color: "#8b5cf6",
    rating: 4.3,
  },
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => {
          const isFilled = i < Math.floor(rating) || (i === Math.floor(rating) && rating % 1 >= 0.5);
          return (
            <Star 
              key={i} 
              size={14} 
              fill={isFilled ? "#f59e0b" : "var(--border-color)"} 
              stroke="none" 
            />
          );
        })}
      </div>
      <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

const TestimonialCard = ({ item }) => {
  const { t } = useTranslation();
  return (
    <div
      className="relative flex flex-col justify-between w-[300px] sm:w-[320px] flex-shrink-0 p-6 rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.03)',
        minHeight: '220px',
      }}
    >
      {/* Corner glow */}
      <div
        className="absolute -top-5 -right-5 w-20 h-20 rounded-full blur-2xl opacity-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-20"
        style={{ backgroundColor: item.color }}
      />

      {/* Quote icon & Rating */}
      <div className="flex flex-col gap-3">
        <Quote size={22} style={{ color: 'var(--text-secondary)', opacity: 0.3 }} />

        <StarRating rating={item.rating} />

        <p
          className="text-[15px] leading-relaxed font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          "{t(`testimonial_${item.key}_quote`, item.quote)}"
        </p>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 mt-5 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${item.color}, ${item.color}cc)`,
            boxShadow: `0 4px 14px ${item.color}40`,
          }}
        >
          {item.initial}
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            {t(`testimonial_${item.key}_name`, item.name)}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
            {t(`testimonial_${item.key}_role`, item.role)} · <span style={{ color: item.color }}>{t(`testimonial_${item.key}_company`, item.company)}</span>
          </p>
        </div>
      </div>

      {/* Bottom accent */}
      <div
        className="absolute bottom-0 left-5 right-5 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
      />
    </div>
  );
};

const CARD_W = 320;
const GAP = 20;
const TOTAL = (CARD_W + GAP) * testimonials.length;

const Testimonials = () => {
  const { t } = useTranslation();
  return (
    <>
      <style>{`
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${TOTAL}px); }
        }
        .scroll-track {
          animation: scroll-left ${testimonials.length * 5}s linear infinite;
          display: flex;
          gap: ${GAP}px;
          width: max-content;
        }
        .scroll-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section
        className="w-full py-16 md:py-24 relative overflow-hidden"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.09, 0.04] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-[100px]"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          />
        </div>

        <div className="relative z-10">

          <div className="text-center mb-14 space-y-5 px-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.14), rgba(139,92,246,0.14))',
                border: '1px solid rgba(99,102,241,0.3)',
                color: '#818cf8',
              }}
            >
              <Star size={11} fill="#818cf8" stroke="none" />
              {t('testimonials_badge', 'Trusted by Top Professionals')}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('testimonials_title_prefix', 'What our users')}{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)' }}
              >
                {t('testimonials_title_highlight', 'are saying')}
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg max-w-xl mx-auto leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('testimonials_subtitle', 'Real stories from professionals who transformed how their teams work.')}
            </motion.p>
          </div>

          <div className="overflow-hidden">
            <div className="scroll-track">
              {[...testimonials, ...testimonials].map((item, i) => (
                <TestimonialCard key={i} item={item} />
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Testimonials;
