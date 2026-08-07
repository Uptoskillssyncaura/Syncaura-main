import React, { useEffect, useState } from 'react';
import { Sun, Moon, Home, Sparkles, CreditCard, Mail, LogIn, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDarkMode } from "../../hooks/useDarkMode";

const Navbar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useDarkMode();
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className="w-full sticky top-0 z-50"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Desktop/Tablet */}
      <div
        className="hidden md:flex max-w-7xl mx-auto px-6 h-20 items-center justify-between border-b"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="gap-20 flex items-center">
          <div
            className="text-2xl font-bold text-blue-600 dark:text-[#4FE6E6]"
          >
            FlowBit
          </div>

          <nav 
            className="flex items-center gap-1 p-1.5 rounded-2xl"
            style={{
              background: "linear-gradient(145deg, rgba(128, 128, 128, 0.05) 0%, rgba(128, 128, 128, 0.01) 100%)",
              border: "1px solid rgba(128, 128, 128, 0.15)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              backdropFilter: "blur(10px)"
            }}
          >
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, 'home')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 group hover:bg-black/5 dark:hover:bg-white/5"
              style={{
                backgroundColor: activeSection === 'home' ? 'rgba(51, 102, 255, 0.1)' : '',
                color: activeSection === 'home' ? 'var(--accent-color)' : 'var(--text-secondary)',
              }}
            >
              <Home className="w-4 h-4 transition-transform group-hover:scale-110" />
              {t("nav_home")}
            </a>

            <a
              href="#features"
              onClick={(e) => scrollToSection(e, 'features')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 group hover:bg-black/5 dark:hover:bg-white/5"
              style={{
                backgroundColor: activeSection === 'features' ? 'rgba(51, 102, 255, 0.1)' : '',
                color: activeSection === 'features' ? 'var(--accent-color)' : 'var(--text-secondary)',
              }}
            >
              <Sparkles className="w-4 h-4 transition-transform group-hover:scale-110" />
              {t("nav_features")}
            </a>

            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, 'contact')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 group hover:bg-black/5 dark:hover:bg-white/5"
              style={{
                backgroundColor: activeSection === 'contact' ? 'rgba(51, 102, 255, 0.1)' : '',
                color: activeSection === 'contact' ? 'var(--accent-color)' : 'var(--text-secondary)',
              }}
            >
              <Mail className="w-4 h-4 transition-transform group-hover:scale-110" />
              {t("nav_contact")}
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-md hover:opacity-70 btn-hover"
            aria-label={t("toggle_theme")}
          >
            {theme === 'light' ? (
              <Sun className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            ) : (
              <Moon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            )}
          </button>

          <button
            onClick={() => navigate("/sign-in")}
            className="flex items-center gap-2 text-sm font-semibold transition-all hover:opacity-70 text-blue-600 dark:text-[#4FE6E6]"
          >
            <LogIn className="w-4 h-4" />
            {t("nav_login")}
          </button>

          <button
            onClick={() => navigate("/sign-up")}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl hover:-translate-y-0.5 transition-all duration-300 bg-blue-600 dark:bg-[#4FE6E6] text-white dark:text-gray-900 shadow-[0_4px_14px_0_rgba(51,102,255,0.39)] hover:shadow-[0_6px_20px_rgba(51,102,255,0.23)] dark:shadow-[0_4px_14px_0_rgba(79,230,230,0.39)] dark:hover:shadow-[0_6px_20px_rgba(79,230,230,0.23)]"
          >
            Start Free
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-6 py-5">
          <div
            className="text-[23px] font-bold tracking-tight text-blue-600 dark:text-[#4FE6E6]"
          >
            FlowBit
          </div>

          <button
            onClick={() => navigate("/SignUp")}
            className="px-4 py-1.5 text-sm font-semibold rounded-[10px] bg-blue-600 dark:bg-[#4FE6E6] text-white dark:text-gray-900"
          >
            Start Free
          </button>
        </div>

        <div className="flex justify-center px-4 py-5 pb-3">
          <nav
            className="inline-flex items-center gap-5 px-6 py-2.5 rounded-[15px] border overflow-x-auto"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-primary)',
            }}
          >
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, 'home')}
              className="text-sm font-medium whitespace-nowrap border-b-2 pb-0.5 transition-all"
              style={{
                color:
                  activeSection === 'home'
                    ? 'var(--accent-color)'
                    : 'var(--text-secondary)',
                borderColor:
                  activeSection === 'home'
                    ? 'var(--accent-color)'
                    : 'transparent',
              }}
            >
              Home
            </a>

            <a
              href="#features"
              onClick={(e) => scrollToSection(e, 'features')}
              className="text-sm font-medium whitespace-nowrap"
              style={{
                color:
                  activeSection === 'features'
                    ? 'var(--accent-color)'
                    : 'var(--text-secondary)',
              }}
            >
              Features
            </a>

            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, 'contact')}
              className="text-sm font-medium whitespace-nowrap"
              style={{
                color:
                  activeSection === 'contact'
                    ? 'var(--accent-color)'
                    : 'var(--text-secondary)',
              }}
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
