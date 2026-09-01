import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';
import { 
  Terminal, 
  Layers, 
  Video, 
  MessageSquare, 
  FileText, 
  Calendar, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';

export default function LearnMore() {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [hoveredFAQ, setHoveredFAQ] = useState(null); // number | null
  const [hoveredStep, setHoveredStep] = useState(null); // number | null
  const [hoveredFeature, setHoveredFeature] = useState(null); // number | null

  const workflowSteps = [
    {
      step: '01',
      title: 'Initialize Workspace',
      description: 'Set up your organization, customize preferences, and configure roles (Admin, Co-Admin, and standard User accounts).'
    },
    {
      step: '02',
      title: 'Create & Assign Tasks',
      description: 'Break projects down into customizable tasks, set priority levels, due dates, and assign them directly to team members.'
    },
    {
      step: '03',
      title: 'Communicate & Collaborate',
      description: 'Initiate channels or direct messages in the chat panel, update the organization notice board, or host instant video meetings.'
    },
    {
      step: '04',
      title: 'Review Performance Insights',
      description: 'Track attendance, complete tasks, compile rich-text wikis, and monitor team analytics on the centralized dashboard.'
    }
  ];

  const features = [
    {
      icon: <Layers className="w-6 h-6 text-blue-600 dark:text-[#73FBFD]" />,
      title: 'Project & Task Management',
      description: 'Organize files, tasks, and roadmaps. Use our card-based Kanban boards to assign items, configure progress states, and ensure project deadlines are met.'
    },
    {
      icon: <Video className="w-6 h-6 text-blue-600 dark:text-[#73FBFD]" />,
      title: 'HD Video Meetings',
      description: 'Start or join secure virtual meetings instantly from your browser. Includes real-time screen sharing, in-call chat, and live collaborative meeting notes.'
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-600 dark:text-[#73FBFD]" />,
      title: 'Real-Time Team Chat',
      description: 'Unify conversations with project-based chat channels, threads, direct messages, file sharing, and custom emoji reactions to streamline feedback.'
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-600 dark:text-[#73FBFD]" />,
      title: 'Centralized Documentation',
      description: 'Create and edit documents in our collaborative editor. Build a team wiki, organize folders, and link files directly to specific tasks or projects.'
    },
    {
      icon: <Calendar className="w-6 h-6 text-blue-600 dark:text-[#73FBFD]" />,
      title: 'Attendance & Notice System',
      description: 'Keep the team updated with official announcements via the Notice Board. Manage time-off requests, check-ins, and leave status seamlessly.'
    },
    {
      icon: <Terminal className="w-6 h-6 text-blue-600 dark:text-[#73FBFD]" />,
      title: 'Role-Based Dashboards',
      description: 'Separate interfaces customized for Admins (organizational overview), Co-Admins (operational management), and Users (task-focused view).'
    }
  ];

  const howToUseGuides = [
    {
      id: 'task',
      question: 'How do I create and manage a task?',
      answer: 'Go to your User Dashboard or Projects section. Click on "Add Task", enter details (title, description, priority, and assignees), and click save. Drag the task card across the columns (To Do, In Progress, Review, Completed) as your work progresses.'
    },
    {
      id: 'meet',
      question: 'How do I host a meeting with screen share?',
      answer: 'Navigate to the "Meetings" section. Click "Create Meeting" to generate a unique room link. Share this link with your team. Once inside, use the bottom navigation toolbar to turn on video/audio, share your screen, or edit the shared notepad.'
    },
    {
      id: 'chat',
      question: 'How do I use chat channels?',
      answer: 'Open the "Chat" interface from the sidebar. You can select an existing public channel corresponding to your project, or click the "+" button to create a private direct message conversation. Share code snippets, images, or documents directly in the chat input.'
    },
    {
      id: 'doc',
      question: 'How do I create collaborative team docs?',
      answer: 'Click on the "Documents" tab. Select "New Document" to open the interactive editor. Choose a folder destination or create a new folder structure. The document autosaves in real time, allowing team members to review or reference it anytime.'
    }
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
                Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400">FlowBit</span>
              </h1>
              <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Learn how FlowBit integrates task management, virtual meetings, group messaging, and documents into a unified, lightning-fast workspace.
              </p>
            </motion.div>
          </div>
        </section>

        {/* How the Platform Works */}
        <section className="w-full py-16 md:py-24" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                How the Platform Works
              </h2>
              <p className="text-sm md:text-base max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Four simple phases to shift your team's coordination and performance to the next level.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {workflowSteps.map((step, idx) => {
                const isHovered = hoveredStep === idx;
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    onMouseEnter={() => setHoveredStep(idx)}
                    onMouseLeave={() => setHoveredStep(null)}
                    className="p-6 rounded-2xl border relative flex flex-col justify-between h-64 transition-all duration-300 cursor-default"
                    style={{ 
                      backgroundColor: 'var(--card-bg)', 
                      borderColor: isHovered ? 'var(--accent-color)' : 'var(--border-color)',
                      transform: isHovered ? 'scale(1.04) translateY(-4px)' : 'scale(1)',
                      boxShadow: isHovered ? '0 15px 30px -10px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    <div>
                      <span 
                        className="text-4xl font-black block mb-4 transition-all duration-300" 
                        style={{ 
                          color: isHovered ? 'var(--accent-color)' : 'var(--text-secondary)',
                          opacity: isHovered ? 0.7 : 0.2
                        }}
                      >
                        {step.step}
                      </span>
                      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Features Grid */}
        <section className="w-full py-16 md:py-24 border-t" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                FlowBit Core Features
              </h2>
              <p className="text-sm md:text-base max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Every element of our stack is crafted to operate smoothly side-by-side.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feat, idx) => {
                const isHovered = hoveredFeature === idx;
                return (
                  <motion.div
                    key={feat.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    onMouseEnter={() => setHoveredFeature(idx)}
                    onMouseLeave={() => setHoveredFeature(null)}
                    className="p-6 rounded-2xl border space-y-4 transition-all duration-300 cursor-default"
                    style={{ 
                      backgroundColor: 'var(--card-bg)', 
                      borderColor: isHovered ? 'var(--accent-color)' : 'var(--border-color)',
                      transform: isHovered ? 'scale(1.03) translateY(-3px)' : 'scale(1)',
                      boxShadow: isHovered ? '0 15px 30px -10px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-950/50 transition-transform duration-300"
                      style={{
                        transform: isHovered ? 'scale(1.1) translateY(-2px)' : 'scale(1)'
                      }}
                    >
                      {feat.icon}
                    </div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {feat.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {feat.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How to Use Them Accordion */}
        <section className="w-full py-16 md:py-24 border-t" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Quick Usage Guides
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Need help getting started? Find concise step-by-step instructions on utilizing the workspace.
              </p>
            </div>

            <div className="space-y-4">
              {howToUseGuides.map((guide, index) => {
                const isOpen = activeFAQ === index;
                const isHovered = hoveredFAQ === index;
                return (
                  <div
                    key={guide.id}
                    className="border rounded-2xl overflow-hidden transition-all duration-300"
                    style={{ 
                      backgroundColor: 'var(--card-bg)', 
                      borderColor: isHovered ? 'var(--accent-color)' : 'var(--border-color)',
                      boxShadow: isHovered ? '0 8px 20px -8px var(--accent-color)' : 'none'
                    }}
                  >
                    <button
                      onClick={() => setActiveFAQ(isOpen ? null : index)}
                      onMouseEnter={() => setHoveredFAQ(index)}
                      onMouseLeave={() => setHoveredFAQ(null)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-md transition-all duration-300"
                      style={{ 
                        backgroundColor: isHovered ? 'var(--accent-color)' : 'transparent',
                        color: isHovered ? 'var(--bg-primary)' : 'var(--text-primary)' 
                      }}
                    >
                      <span className="flex items-center gap-3">
                        <CheckCircle2 
                          className="w-5 h-5 flex-shrink-0 transition-colors duration-300" 
                          style={{
                            color: isHovered ? 'var(--bg-primary)' : 'var(--accent-color)'
                          }}
                        />
                        {guide.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        style={{ 
                          color: isHovered ? 'var(--bg-primary)' : 'var(--text-secondary)' 
                        }}
                      />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="px-6 pb-6 pt-2 text-sm leading-relaxed border-t" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                            {guide.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
