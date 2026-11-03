import React from 'react';
import Navbar from '../components/home/Navbar';
import Hero from '../components/home/Hero';
import StatsSection from '../components/home/StatsSection';
import WorkflowSection from '../components/home/WorkflowSection';
import FeatureShowcase from '../components/home/FeatureShowcase';
import ToolsGrid from '../components/home/ToolsGrid';
import Testimonials from '../components/home/Testimonials';
import CTABanner from '../components/home/CTABanner';
import FAQs from '../components/home/FAQs';
import Footer from '../components/home/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] transition-colors duration-500 text-black dark:text-white">
      <Navbar />
      <Hero />
      <StatsSection />
      <WorkflowSection />
      <FeatureShowcase />
      <ToolsGrid />
      <Testimonials />
      <CTABanner />
      <FAQs />
      <Footer />
    </div>
  );
}