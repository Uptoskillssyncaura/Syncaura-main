import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';
import { Target, Compass, Sparkles, Award, Users, ChevronRight } from 'lucide-react';

export default function AboutUs() {
  const [hoveredCard, setHoveredCard] = useState(null); // 'aim' | 'mission'
  const [hoveredMilestone, setHoveredMilestone] = useState(null); // number | null

  const milestones = [
    {
      year: '2024',
      title: 'The Inception',
      description: 'FlowBit was founded by a team of visionary developers and designers seeking to eliminate tool fragmentation. We set out to design a single ecosystem that unifies chats, projects, and meetings.',
      icon: <Sparkles className="w-6 h-6 text-blue-600 dark:text-[#73FBFD]" />,
    },
    {
      year: '2025',
      title: 'Beta Release',
      description: 'We opened our platform to private beta testers, onboarding over 10,000 active users. Feedback helped us optimize our real-time data sync engines and improve meeting audio/video latency.',
      icon: <Compass className="w-6 h-6 text-blue-600 dark:text-[#73FBFD]" />,
    },
    {
      year: '2026',
      title: 'Public Launch',
      description: 'FlowBit officially launched to the public worldwide. We introduced drag-and-drop task boards, secure instant chat channels, and interactive collaborative meeting spaces.',
      icon: <Award className="w-6 h-6 text-blue-600 dark:text-[#73FBFD]" />,
    },
    {
      year: '2027',
      title: 'AI Collaboration Suite',
      description: 'Integrating state-of-the-art AI, we released automated meeting transcriptions, smart task breakdown assistants, and predictive project velocity insights.',
      icon: <Users className="w-6 h-6 text-blue-600 dark:text-[#73FBFD]" />,
    },
    {
      year: '2028',
      title: 'Global Expansion',
      description: 'We scaled our hosting infrastructure globally, establishing decentralized servers to provide sub-100ms latency worldwide and offering custom enterprise-grade solutions.',
      icon: <ChevronRight className="w-6 h-6 text-blue-600 dark:text-[#73FBFD]" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] transition-colors duration-500 text-black dark:text-white flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400">FlowBit</span>
              </h1>
              <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                FlowBit is a modern, unified collaborative workspace built to streamline projects, tasks, chat, meetings, and documents. We bring organization and speed to modern teams.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Aim & Mission Section */}
        <section className="w-full py-16 md:py-24" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              
              {/* Aim Card */}
              <motion.div
                initial={{ opacity: 0, x: -35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                onMouseEnter={() => setHoveredCard('aim')}
                onMouseLeave={() => setHoveredCard(null)}
                className="p-8 rounded-2xl border flex flex-col justify-between transition-all duration-300 cursor-default"
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  borderColor: hoveredCard === 'aim' ? 'var(--accent-color)' : 'var(--border-color)',
                  transform: hoveredCard === 'aim' ? 'scale(1.03) translateY(-4px)' : 'none',
                  boxShadow: hoveredCard === 'aim' ? '0 20px 40px -15px rgba(0,0,0,0.15)' : 'none'
                }}
              >
                <div className="space-y-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-950/50 transition-transform duration-300"
                    style={{
                      transform: hoveredCard === 'aim' ? 'scale(1.1) rotate(5deg)' : 'none'
                    }}
                  >
                    <Target className="w-6 h-6 text-blue-600 dark:text-[#73FBFD]" />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Our Aim</h2>
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    To break down information silos and eliminate tool switching. We aim to consolidate project planning, instant messaging, file sharing, and virtual meetings into one smooth, high-performance workspace so your team can focus purely on creating and executing.
                  </p>
                </div>
              </motion.div>

              {/* Mission Card */}
              <motion.div
                initial={{ opacity: 0, x: 35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                onMouseEnter={() => setHoveredCard('mission')}
                onMouseLeave={() => setHoveredCard(null)}
                className="p-8 rounded-2xl border flex flex-col justify-between transition-all duration-300 cursor-default"
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  borderColor: hoveredCard === 'mission' ? 'var(--accent-color)' : 'var(--border-color)',
                  transform: hoveredCard === 'mission' ? 'scale(1.03) translateY(-4px)' : 'none',
                  boxShadow: hoveredCard === 'mission' ? '0 20px 40px -15px rgba(0,0,0,0.15)' : 'none'
                }}
              >
                <div className="space-y-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-950/50 transition-transform duration-300"
                    style={{
                      transform: hoveredCard === 'mission' ? 'scale(1.1) rotate(-5deg)' : 'none'
                    }}
                  >
                    <Compass className="w-6 h-6 text-blue-600 dark:text-[#73FBFD]" />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Our Mission</h2>
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    To power the future of work by developing collaborative products that are secure, blazing fast, and incredibly intuitive. We are on a mission to help teams of all sizes achieve greater transparency, foster deeper alignment, and accelerate their path to success.
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Milestones / Journey Section */}
        <section className="w-full py-16 md:py-24 border-t" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Our Journey & Milestones
              </h2>
              <p className="text-sm md:text-base max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                From inception to global deployment, trace the history and exciting future of FlowBit.
              </p>
            </div>

            {/* Vertical Timeline */}
            <div className="relative max-w-4xl mx-auto">
              {/* Center Line for Desktop, Left Line for Mobile */}
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gray-200 dark:bg-neutral-800" />

              <div className="space-y-12">
                {milestones.map((milestone, idx) => {
                  const isEven = idx % 2 === 0;
                  const isHovered = hoveredMilestone === idx;
                  return (
                    <motion.div
                      key={milestone.year}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className={`relative flex flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''} items-start md:items-center`}
                    >
                      {/* Timeline Dot with Year */}
                      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                        <div 
                          className="w-12 h-12 rounded-full border-4 flex items-center justify-center bg-white dark:bg-neutral-900 transition-all duration-300"
                          style={{ 
                            borderColor: 'var(--accent-color)',
                            transform: isHovered ? 'scale(1.25)' : 'scale(1)',
                            boxShadow: isHovered ? '0 0 20px var(--accent-color)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <div 
                            className="transition-transform duration-300"
                            style={{
                              transform: isHovered ? 'scale(1.15)' : 'scale(1)'
                            }}
                          >
                            {milestone.icon}
                          </div>
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className="w-full md:w-[45%] pl-16 md:pl-0">
                        <div 
                          onMouseEnter={() => setHoveredMilestone(idx)}
                          onMouseLeave={() => setHoveredMilestone(null)}
                          className="p-6 rounded-2xl border transition-all duration-300 shadow-sm cursor-default"
                          style={{ 
                            backgroundColor: 'var(--card-bg)', 
                            borderColor: isHovered ? 'var(--accent-color)' : 'var(--border-color)',
                            transform: isHovered ? 'scale(1.04) translateY(-3px)' : 'scale(1)',
                            boxShadow: isHovered ? '0 15px 30px -10px rgba(0,0,0,0.1)' : 'none'
                          }}
                        >
                          <span className="text-xs font-bold tracking-widest uppercase block mb-1" style={{ color: 'var(--accent-color)' }}>
                            {milestone.year}
                          </span>
                          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                            {milestone.title}
                          </h3>
                          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Empty spacer for alignment on desktop */}
                      <div className="hidden md:block w-[45%]" />
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
