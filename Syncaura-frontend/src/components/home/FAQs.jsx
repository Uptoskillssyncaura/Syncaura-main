import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from "react-i18next";
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';

const faqData = [
  {
    questionKey: "faq_q1",
    answerKey: "faq_a1"
  },
  {
    questionKey: "faq_q2",
    answerKey: "faq_a2"
  },
  {
    questionKey: "faq_q3",
    answerKey: "faq_a3"
  },
  {
    questionKey: "faq_q4",
    answerKey: "faq_a4"
  },
  {
    questionKey: "faq_q5",
    answerKey: "faq_a5"
  },
  {
    questionKey: "faq_q6",
    answerKey: "faq_a6"
  },
  {
    questionKey: "faq_q7",
    answerKey: "faq_a7"
  },
  {
    questionKey: "faq_q8",
    answerKey: "faq_a8"
  }
];

const FAQItem = ({ faq, index, isOpen, onToggle }) => {
  const { t } = useTranslation();
  const itemId = `faq-item-${index}`;
  const contentId = `faq-content-${index}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      style={{ perspective: 1000 }} // 3D Perspective container
      className="mb-4"
    >
      <motion.div
        className="rounded-2xl border relative overflow-hidden"
        style={{ 
          backgroundColor: 'var(--card-bg)',
          borderColor: isOpen ? 'var(--accent-color)' : 'var(--border-color)',
          boxShadow: isOpen ? '0 10px 40px rgba(99, 102, 241, 0.1)' : '0 4px 20px rgba(0, 0, 0, 0.02)',
        }}
        whileHover={{ scale: 1.01, translateY: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Glow effect when open */}
        {isOpen && (
           <div 
             className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ background: 'linear-gradient(120deg, #6366f1, transparent)' }} 
           />
        )}

        <button
          id={itemId}
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => onToggle(index)}
          className="w-full relative z-10 flex items-center justify-between p-5 md:p-6 text-left group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
              style={{
                background: isOpen ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'var(--bg-secondary)',
                color: isOpen ? '#ffffff' : 'var(--text-secondary)'
              }}
            >
              <MessageCircleQuestion size={18} />
            </div>
            <span
              className="text-[15px] md:text-base font-bold pr-4 leading-relaxed transition-colors duration-200"
              style={{ color: isOpen ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              {t(faq.questionKey)}
            </span>
          </div>
          
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'var(--bg-secondary)' }}
          >
            <ChevronDown
              size={16}
              style={{ color: isOpen ? 'var(--accent-color)' : 'var(--text-secondary)' }}
            />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={contentId}
              role="region"
              aria-labelledby={itemId}
              initial={{ height: 0, opacity: 0, rotateX: -15 }}
              animate={{ height: 'auto', opacity: 1, rotateX: 0 }}
              exit={{ height: 0, opacity: 0, rotateX: -15 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
              style={{ transformOrigin: "top center" }} // 3D Hinge effect from the top
              className="relative z-10"
            >
              <div
                className="text-[14px] md:text-[15px] leading-relaxed pb-6 px-5 md:px-6 md:pl-20 pr-8"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t(faq.answerKey)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const FAQs = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faqs"
      className="w-full py-16 md:py-28 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* 3D Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-10 w-96 h-96 rounded-full blur-[100px]"
          style={{ background: '#6366f1' }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.05, 0.03] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 right-10 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: '#ec4899' }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">

          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[34px] md:text-4xl lg:text-5xl font-black mb-5 tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {t("faq_title")}{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)' }}
            >
              {t("faq_title_highlight")}
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[15px] md:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            {t("faq_subtitle")}
          </motion.p>
        </div>

        {/* FAQ List */}
        <div className="flex flex-col gap-2">
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
