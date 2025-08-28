import React, { useEffect, useState, useCallback, useRef } from 'react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'about', label: 'About', icon: '👤' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'projects', label: 'Projects', icon: '💼' },
  { id: 'contact', label: 'Contact', icon: '📧' },
];


const Header = ({ theme = 'dark', toggleTheme }) => {
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const headerRef = useRef(null);

  useEffect(() => {
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean);
    if (!sections.length) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.6 }
    );
    
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
      
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const pct = total > 0 ? (scrollY / total) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = useCallback((e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActive(id);
    setMenuOpen(false);
  }, []);



  const handleMouseMove = (e) => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  const themeClasses = theme === 'dark' 
    ? 'bg-gray-900/95 text-white border-gray-800' 
    : 'bg-white/95 text-gray-900 border-gray-200';

  const navLinkClasses = theme === 'dark'
    ? 'text-gray-300 hover:text-white'
    : 'text-gray-600 hover:text-gray-900';

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <header 
        ref={headerRef}
        onMouseMove={handleMouseMove}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${themeClasses} ${
          scrolled 
            ? 'backdrop-blur-xl border-b shadow-2xl shadow-purple-500/10' 
            : 'backdrop-blur-sm'
        }`}
        style={{
          background: scrolled 
            ? theme === 'dark' 
              ? `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), rgba(17, 24, 39, 0.95)`
              : `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), rgba(255, 255, 255, 0.95)`
            : theme === 'dark'
              ? `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), rgba(17, 24, 39, 0.8)`
              : `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), rgba(255, 255, 255, 0.8)`
        }}
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 opacity-0 transition-opacity duration-300"
             style={{ 
               opacity: scrolled ? 1 : 0,
               transform: `scaleX(${progress / 100})`,
               transformOrigin: 'left'
             }} 
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Brand */}
            <div 
              onClick={(e) => handleClick(e, 'home')}
              className="flex items-center space-x-3 cursor-pointer group transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:rotate-12">
                  DJ
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                  Deepak Joshi
                </h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                  Full Stack Developer
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {NAV_ITEMS.map((item, index) => (
                <div key={item.id} className="relative">
                  <button
                    onClick={(e) => handleClick(e, item.id)}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 group ${navLinkClasses} ${
                      active === item.id 
                        ? theme === 'dark' 
                          ? 'text-white' 
                          : 'text-gray-900'
                        : ''
                    }`}
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideDown 0.6s ease-out both'
                    }}
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </span>
                    
                    {/* Active indicator */}
                    {active === item.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm transition-all duration-300" />
                    )}
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100" />
                  </button>
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="relative w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-180 hover:border-purple-500/40 group"
              >
                <span className="text-lg transition-all duration-300 group-hover:scale-110">
                  {theme === 'dark' ? '🌙' : '☀️'}
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              {/* CTA Button */}
              <button
                onClick={(e) => handleClick(e, 'contact')}
                className="relative hidden sm:flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 group overflow-hidden"
              >
                <span className="relative z-10">Hire Me</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center space-y-1.5 transition-all duration-300 hover:scale-110 group"
              >
                <span className={`w-5 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-5 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-5 h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-full left-0 right-0 ${themeClasses} border-b transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="container mx-auto px-4 py-4 space-y-2">
            {NAV_ITEMS.map((item, index) => (
              <button
                key={item.id}
                onClick={(e) => handleClick(e, item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center space-x-3 ${navLinkClasses} ${
                  active === item.id ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20' : 'hover:bg-gray-500/5'
                }`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: menuOpen ? 'slideUp 0.4s ease-out both' : 'none'
                }}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            <button
              onClick={(e) => handleClick(e, 'contact')}
              className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Hire Me</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </header>

      {/* Add required CSS animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Header;