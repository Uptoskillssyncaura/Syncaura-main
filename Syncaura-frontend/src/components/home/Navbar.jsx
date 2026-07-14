import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useNavigate, Link } from "react-router-dom";
import { useDarkMode } from "../../hooks/useDarkMode";

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useDarkMode();
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'pricing', 'contact'];
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
            className="text-2xl font-bold"
            style={{ color: 'var(--accent-color)' }}
          >
            FLOWBIT
          </div>

          <nav className="flex items-center gap-8">
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, 'home')}
              className="text-sm font-medium border-b-2 pb-1 transition-all"
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
              className="text-sm font-medium border-b-2 pb-1 transition-all"
              style={{
                color:
                  activeSection === 'features'
                    ? 'var(--accent-color)'
                    : 'var(--text-secondary)',
                borderColor:
                  activeSection === 'features'
                    ? 'var(--accent-color)'
                    : 'transparent',
              }}
            >
              Features
            </a>

            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, 'pricing')}
              className="text-sm font-medium border-b-2 pb-1 transition-all"
              style={{
                color:
                  activeSection === 'pricing'
                    ? 'var(--accent-color)'
                    : 'var(--text-secondary)',
                borderColor:
                  activeSection === 'pricing'
                    ? 'var(--accent-color)'
                    : 'transparent',
              }}
            >
              Pricing
            </a>

            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, 'contact')}
              className="text-sm font-medium border-b-2 pb-1 transition-all"
              style={{
                color:
                  activeSection === 'contact'
                    ? 'var(--accent-color)'
                    : 'var(--text-secondary)',
                borderColor:
                  activeSection === 'contact'
                    ? 'var(--accent-color)'
                    : 'transparent',
              }}
            >
              Contact
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-md hover:opacity-70 btn-hover"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Sun className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            ) : (
              <Moon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            )}
          </button>

          <button
            onClick={() => navigate("/sign-in")}
            className="text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent-color)' }}
          >
            Login
          </button>

          <button
            onClick={() => navigate("/sign-up")}
            className="px-6 py-2 text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: "var(--accent-color)",
              color: "var(--bg-primary)",
            }}
          >
            Start Free
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-6 py-5">
          <div
            className="text-[23px] font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            FLOWBIT
          </div>

          <button
            onClick={() => navigate("/sign-up")}
            className="px-4 py-1 text-sm font-medium rounded-[10px]"
            style={{
              backgroundColor: "var(--accent-color)",
              color: "var(--bg-primary)",
            }}
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
              href="#pricing"
              onClick={(e) => scrollToSection(e, 'pricing')}
              className="text-sm font-medium whitespace-nowrap"
              style={{
                color:
                  activeSection === 'pricing'
                    ? 'var(--accent-color)'
                    : 'var(--text-secondary)',
              }}
            >
              Pricing
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