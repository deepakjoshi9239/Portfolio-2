import React, { useEffect, useState, useRef } from 'react';

const Home = ({ theme = 'dark' }) => {
  const LEARNING = ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Git', 'Python', 'Express.js', 'Tailwind CSS'];
  const [idx, setIdx] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  // Rotating learning text
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % LEARNING.length), 2000);
    return () => clearInterval(t);
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const themeClasses = theme === 'dark' 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <section 
        id="home" 
        ref={heroRef}
        className={`relative min-h-screen flex items-center justify-center overflow-hidden pt-20 ${themeClasses}`}
        style={{
          background: theme === 'dark' 
            ? `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`
            : `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)`
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Orbs */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full mix-blend-multiply animate-pulse ${
                theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-400/20'
              }`}
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
          
          {/* Grid Pattern */}
          <div className={`absolute inset-0 opacity-5 ${theme === 'dark' ? 'bg-white' : 'bg-black'}`} 
               style={{
                 backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                 backgroundSize: '50px 50px'
               }} 
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Main Content */}
            <div className={`space-y-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              {/* Greeting */}
              <div className="space-y-4">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  theme === 'dark' 
                    ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' 
                    : 'bg-purple-100 text-purple-700 border border-purple-200'
                } animate-bounce-in`}
                      style={{ animationDelay: '0.2s' }}>
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
                  Available for opportunities
                </span>
                
                <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                    Hello, I'm
                  </p>
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                    Deepak{' '}
                    <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                      Joshi
                    </span>
                  </h1>
                </div>
              </div>

              {/* Description */}
              <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <p className={`text-xl leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-2xl`}>
                  College student and{' '}
                  <span className="font-semibold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                    full-stack developer
                  </span>{' '}
                  focused on building responsive, accessible, high‑performance applications. 
                  Open to internships and junior roles.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.8s' }}>
                <button
                  onClick={(e) => handleClick(e, 'contact')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>Let's Work Together</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700" />
                </button>
                
                <button
                  onClick={(e) => handleClick(e, 'projects')}
                  className={`group px-8 py-4 border-2 font-semibold rounded-xl transition-all duration-300 hover:scale-105 ${
                    theme === 'dark' 
                      ? 'border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400' 
                      : 'border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-500'
                  }`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>View Projects</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">📁</span>
                  </span>
                </button>
              </div>

              {/* Currently Learning */}
              <div className="animate-slide-up" style={{ animationDelay: '1s' }}>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Currently mastering:
                  </span>
                  <div className={`px-4 py-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
                  } backdrop-blur-sm border ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  } min-w-32 text-center`}>
                    <span key={idx} className="font-semibold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent animate-fade-in">
                      {LEARNING[idx]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: '1.2s' }}>
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  theme === 'dark' 
                    ? 'bg-green-500/10 text-green-300 border border-green-500/20' 
                    : 'bg-green-100 text-green-700 border border-green-200'
                }`}>
                  🎓 College Student
                </span>
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  theme === 'dark' 
                    ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' 
                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                  💼 Open to Opportunities
                </span>
              </div>

              {/* Quick Stats */}
              <div className={`grid grid-cols-3 gap-6 py-6 border-t ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              } animate-slide-up`} style={{ animationDelay: '1.4s' }}>
                {[
                  { number: '15+', label: 'Projects' },
                  { number: '3+', label: 'Years Learning' },
                  { number: '100%', label: 'Dedication' }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Avatar/Visual */}
            <div className={`flex justify-center lg:justify-end ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <div className="relative group">
                {/* Glowing Ring */}
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 animate-pulse transition-opacity duration-300" />
                
                {/* Avatar Container */}
                <div className={`relative w-64 h-64 sm:w-80 sm:h-80 rounded-full ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } border-4 border-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-all duration-500 overflow-hidden`}
                     style={{
                       borderImage: 'linear-gradient(45deg, #8b5cf6, #3b82f6) 1'
                     }}>
                  
                  {/* Inner Glow */}
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 animate-pulse" />
                  
                  {/* Avatar Content */}
                  <div className="relative z-10 text-center">
                    <div className="text-6xl sm:text-8xl font-bold bg-gradient-to-br from-purple-400 to-blue-500 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                      DJ
                    </div>
                    <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} tracking-wider`}>
                      WEB DEVELOPER
                    </div>
                  </div>
                  
                  {/* Floating Particles */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full opacity-60"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                        animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className={`w-6 h-10 border-2 ${
            theme === 'dark' ? 'border-gray-600' : 'border-gray-400'
          } rounded-full flex justify-center`}>
            <div className={`w-1 h-3 ${
              theme === 'dark' ? 'bg-gray-400' : 'bg-gray-600'
            } rounded-full mt-2 animate-pulse`} />
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fade-in-right {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bounce-in {
            from { opacity: 0; transform: scale(0.3); }
            50% { transform: scale(1.05); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes gradient-x {
            0%, 100% { background-size: 200% 200%; background-position: left center; }
            50% { background-size: 200% 200%; background-position: right center; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          .animate-fade-in-up { animation: fade-in-up 0.8s ease-out both; }
          .animate-fade-in-right { animation: fade-in-right 0.8s ease-out both; }
          .animate-slide-up { animation: slide-up 0.6s ease-out both; }
          .animate-bounce-in { animation: bounce-in 0.6s ease-out both; }
          .animate-fade-in { animation: fade-in 0.5s ease-out both; }
          .animate-gradient-x { animation: gradient-x 3s ease infinite; }
        `}</style>
      </section>
    </div>
  );
};

export default Home;