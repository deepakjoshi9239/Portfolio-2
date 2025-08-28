import React, { useEffect, useState, useRef } from 'react';

const About = ({ theme = 'dark' }) => {
  const [tab, setTab] = useState('Bio');
  const [startCounts, setStartCounts] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  // Enhanced counter hook with easing
  const useCounter = (to, start) => {
    const [val, setVal] = useState(0);
    useEffect(() => {
      if (!start) return;
      let raf;
      const t0 = performance.now();
      const dur = 1500;
      
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      
      const tick = (t) => {
        const elapsed = t - t0;
        const progress = Math.min(1, elapsed / dur);
        const easedProgress = easeOutCubic(progress);
        setVal(Math.round(easedProgress * to));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [to, start]);
    return val;
  };

  const projects = useCounter(15, startCounts);
  const hours = useCounter(800, startCounts);
  const skills = useCounter(12, startCounts);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setStartCounts(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
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

  const cardClasses = theme === 'dark'
    ? 'bg-gray-800/50 border-gray-700'
    : 'bg-white/70 border-gray-200';

  const tabClasses = theme === 'dark'
    ? 'text-gray-400 hover:text-white border-gray-700'
    : 'text-gray-600 hover:text-gray-900 border-gray-300';

  const activeTabClasses = theme === 'dark'
    ? 'text-white border-purple-500'
    : 'text-gray-900 border-purple-600';

  const skillTags = [
    { name: 'HTML5', level: 95, icon: '🏗️' },
    { name: 'CSS3', level: 90, icon: '🎨' },
    { name: 'JavaScript', level: 85, icon: '⚡' },
    { name: 'React', level: 80, icon: '⚛️' },
    { name: 'Node.js', level: 75, icon: '🚀' },
    { name: 'TypeScript', level: 70, icon: '📘' },
    { name: 'Git', level: 85, icon: '🌿' },
    { name: 'MongoDB', level: 65, icon: '🍃' }
  ];

  const timelineItems = [
    {
      title: "Bachelor's in Computer Science",
      subtitle: "College of Technology and Engineering, Udaipur",
      period: "2022 – Present",
      description: "Focusing on software development, algorithms, and system design",
      icon: "🎓",
      status: "current"
    },
    {
      title: "Full-Stack Development",
      subtitle: "Self-learning & Projects",
      period: "2022 – Present",
      description: "Building modern web applications with React, Node.js, and cloud technologies",
      icon: "💻",
      status: "ongoing"
    },
    {
      title: "Open for Opportunities",
      subtitle: "Internship & Junior Roles",
      period: "Available Now",
      description: "Looking for hands-on experience in a collaborative development environment",
      icon: "🚀",
      status: "available"
    }
  ];

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <section 
        id="about" 
        ref={sectionRef}
        className={`py-20 lg:py-32 relative overflow-hidden ${themeClasses}`}
        style={{
          background: theme === 'dark' 
            ? `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), linear-gradient(180deg, #0f172a 0%, #1e293b 100%)`
            : `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)`
        }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Shapes */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${
                theme === 'dark' ? 'bg-purple-500/5' : 'bg-purple-400/10'
              } animate-pulse`}
              style={{
                width: `${200 + Math.random() * 300}px`,
                height: `${200 + Math.random() * 300}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: `${4 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                Me
              </span>
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Passionate developer crafting digital experiences with modern technologies
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Left: Tabbed Content */}
            <div className={`${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <div className={`backdrop-blur-xl ${cardClasses} border rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500`}>
                
                {/* Tab Navigation */}
                <div className="flex space-x-1 mb-8 p-1 bg-gray-500/10 rounded-xl">
                  {['Bio', 'Skills', 'Education'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`relative flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                        tab === t 
                          ? theme === 'dark'
                            ? 'text-white bg-gray-700/50'
                            : 'text-gray-900 bg-white/80'
                          : tabClasses
                      }`}
                    >
                      <span className="relative z-10">{t}</span>
                      {tab === t && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-80">
                  {tab === 'Bio' && (
                    <div key="bio" className="space-y-6 animate-fade-in">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-2xl">
                          👨‍💻
                        </div>
                        <h3 className="text-2xl font-bold">Who I Am</h3>
                      </div>
                      <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        I'm a passionate college student and{' '}
                        <span className="font-semibold text-purple-400">full-stack developer</span>{' '}
                        who loves transforming innovative ideas into fast, responsive, and accessible web applications.
                      </p>
                      <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        My focus is on clean UI design, modern development practices, and creating meaningful user experiences. 
                        I believe in learning by building—every project teaches me something new.
                      </p>
                      
                      {/* Interests */}
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">What I Love:</h4>
                        <div className="flex flex-wrap gap-3">
                          {['🎨 UI/UX Design', '⚡ Performance', '♿ Accessibility', '📱 Responsive Design'].map((interest, i) => (
                            <span key={i} className={`px-3 py-1 rounded-full text-sm ${
                              theme === 'dark' ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                            }`}>
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {tab === 'Skills' && (
                    <div key="skills" className="space-y-6 animate-fade-in">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-2xl">
                          ⚡
                        </div>
                        <h3 className="text-2xl font-bold">Technical Skills</h3>
                      </div>
                      
                      <div className="space-y-4">
                        {skillTags.map((skill, i) => (
                          <div key={skill.name} className="group">
                            <div className="flex items-center justify-between mb-2">
                              <span className="flex items-center space-x-2">
                                <span className="text-lg">{skill.icon}</span>
                                <span className="font-medium">{skill.name}</span>
                              </span>
                              <span className={`text-sm font-bold ${
                                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                              }`}>
                                {skill.level}%
                              </span>
                            </div>
                            <div className={`h-2 rounded-full overflow-hidden ${
                              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                            }`}>
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                                style={{
                                  width: startCounts ? `${skill.level}%` : '0%',
                                  animationDelay: `${i * 100}ms`
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tab === 'Education' && (
                    <div key="education" className="space-y-6 animate-fade-in">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-2xl">
                          🎯
                        </div>
                        <h3 className="text-2xl font-bold">Journey & Goals</h3>
                      </div>
                      
                      <div className="space-y-6">
                        {timelineItems.map((item, i) => (
                          <div key={i} className="relative flex items-start space-x-4 group">
                            {/* Timeline Line */}
                            {i < timelineItems.length - 1 && (
                              <div className={`absolute left-6 top-12 w-px h-16 ${
                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                              }`} />
                            )}
                            
                            {/* Icon */}
                            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                              item.status === 'current' 
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                                : item.status === 'ongoing'
                                ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                                : 'bg-gradient-to-br from-purple-500 to-pink-600'
                            } shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              {item.icon}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-grow">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                <h4 className="font-bold text-lg">{item.title}</h4>
                                <span className={`text-sm px-3 py-1 rounded-full ${
                                  item.status === 'current' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : item.status === 'ongoing'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-purple-500/20 text-purple-400'
                                }`}>
                                  {item.period}
                                </span>
                              </div>
                              <p className="font-medium text-purple-400 mb-2">{item.subtitle}</p>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Stats & CTA */}
            <div className={`space-y-8 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
              
              {/* Stats Grid */}
              <div className={`backdrop-blur-xl ${cardClasses} border rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500`}>
                <h3 className="text-2xl font-bold mb-8 text-center">
                  By the{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                    Numbers
                  </span>
                </h3>
                
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { value: projects, label: 'Projects', suffix: '+', icon: '🚀', color: 'purple' },
                    { value: hours, label: 'Hours Coding', suffix: '+', icon: '⏰', color: 'blue' },
                    { value: skills, label: 'Technologies', suffix: '+', icon: '🛠️', color: 'cyan' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center group">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 ${
                        stat.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                        stat.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                        'bg-gradient-to-br from-cyan-500 to-cyan-600'
                      }`}>
                        {stat.icon}
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-2">
                        {stat.value}{stat.suffix}
                      </div>
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={(e) => handleClick(e, 'projects')}
                  className="group flex-1 relative px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>See My Work</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">💼</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700" />
                </button>
                
                <button
                  onClick={(e) => handleClick(e, 'contact')}
                  className={`group flex-1 px-6 py-4 border-2 font-semibold rounded-xl transition-all duration-300 hover:scale-105 ${
                    theme === 'dark' 
                      ? 'border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400' 
                      : 'border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-500'
                  }`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>Let's Connect</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">💬</span>
                  </span>
                </button>
              </div>

              {/* Quick Contact Info */}
              <div className={`backdrop-blur-xl ${cardClasses} border rounded-2xl p-6 shadow-2xl`}>
                <h4 className="font-bold mb-4 text-center">Quick Connect</h4>
                <div className="flex justify-center space-x-4">
                  {[
                    { icon: '📧', label: 'Email', href: 'mailto:your-email@example.com' },
                    { icon: '💼', label: 'LinkedIn', href: '#' },
                    { icon: '💻', label: 'GitHub', href: '#' }
                  ].map((contact, i) => (
                    <a
                      key={i}
                      href={contact.href}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 ${
                        theme === 'dark' 
                          ? 'bg-gray-700/50 hover:bg-purple-500/20' 
                          : 'bg-gray-100 hover:bg-purple-100'
                      }`}
                      title={contact.label}
                    >
                      {contact.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slide-in-left {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slide-in-right {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .animate-fade-in-up { animation: fade-in-up 0.8s ease-out both; }
          .animate-slide-in-left { animation: slide-in-left 0.8s ease-out 0.2s both; }
          .animate-slide-in-right { animation: slide-in-right 0.8s ease-out 0.4s both; }
          .animate-fade-in { animation: fade-in 0.5s ease-out both; }
        `}</style>
      </section>
    </div>
  );
};

export default About;