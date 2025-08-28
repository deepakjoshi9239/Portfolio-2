import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';

import AiCareerGuideImg from '../assets/AiCareerGuide.png';
import FinanceImg from '../assets/Finance.png';
import Portfolio1Img from '../assets/portfolio1.png';
import Portfolio2Img from '../assets/portfolio2.png';
import BlogImg from '../assets/Blog.png';
import TicGameImg from '../assets/Tic_game.png';

const ALL_PROJECTS = [
  {
    title: 'AI Career Guide',
    about: 'An intelligent career assistance platform that provides personalized roadmaps, interview preparation, skill assessment, and mentorship guidance for students and professionals.',
    tech: ['React', 'Tailwind', 'Node.js','MongoDB','Express'],
    category: 'Web App',
    links: { github: 'https://github.com/deepakjoshi9239/Ai-Career-Guide', demo: 'https://ai-career-guide-frontend.netlify.app/' },
    image: AiCareerGuideImg,
    status: 'Live',
    featured: true
  },
  {
    title: 'Finance-Tracker',
    about: 'Personal finance management tool with expense tracking, budgeting, and financial goal setting.',
    tech: ['React', 'Tailwind', 'Node.js','MongoDB','Express'],
    category: 'Web App',
    links: { github: 'https://github.com/deepakjoshi9239/finance-tracker', demo: 'https://finance-tracker-je8i.vercel.app/' },
    image: FinanceImg,
    status: 'Live',
    featured: true
  },
  {
    title: 'Portfolio v1',
    about: 'Modern personal portfolio showcasing projects with custom animations, responsive layouts, and interactive elements.',
    tech: ['React', 'Framer Motion', 'Tailwind','EmailJS'],
    category: 'UI',
    links: { github: '#', demo: '#' },
    image: Portfolio1Img,
    status: 'Live',
    featured: true
  },
  {
    title: 'Blog Website',
    about: 'Personal blog platform with user authentication, post creation, and comments.',
    tech: ['React', 'Node.js', 'MongoDB','Tailwind',],
    category: 'Web App',
    links: { github: '#', demo: '#' },
    image: BlogImg,
    status: 'In Progress',
    featured: false
  },
  {
    title: 'Tic-Tac-Toe',
    about: 'A classic Tic-Tac-Toe game built with React.',
    tech: ['React', 'CSS', 'JS'],
    category: 'Game',
    links: { github: 'https://github.com/deepakjoshi9239/Tic-Tac-Toe', demo: 'https://tic-tac-toe-tw.netlify.app/' },
    image: TicGameImg,
    status: 'Completed',
    featured: false
  },
  {
    title: 'Portfolio v2',
    about: 'Modern personal portfolio showcasing projects with custom animations, responsive layouts, and interactive elements.',
    tech: ['HTML','CSS','JavaScript'],
    category: 'UI',
    links: { github: 'https://github.com/deepakjoshi9239/Portfolio', demo: 'https://dancing-concha-ca700b.netlify.app/' },
    image: Portfolio2Img,
    status: 'Live',
    featured: true
  }
];

const FILTERS = ['All', 'Web App', 'UI', 'Game'];

const Projects = ({ theme = 'dark' }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeTag, setActiveTag] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);

  const filteredProjects = useMemo(() => {
    let base = activeFilter === 'All' ? ALL_PROJECTS : ALL_PROJECTS.filter((p) => p.category === activeFilter);
    if (activeTag) base = base.filter((p) => p.tech.includes(activeTag));
    return base;
  }, [activeFilter, activeTag]);

  const filterCounts = useMemo(() => {
    const map = { All: ALL_PROJECTS.length };
    for (const f of FILTERS.filter(f => f !== 'All')) {
      map[f] = ALL_PROJECTS.filter(p => p.category === f).length;
    }
    return map;
  }, []);

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
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Close modal with ESC
  useEffect(() => {
    const onKey = (e) => { 
      if (e.key === 'Escape') setSelectedProject(null); 
    };
    if (selectedProject) {
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  const handleCardMouseMove = useCallback((e, projectTitle) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    el.style.setProperty('--rotateX', `${rotateX}deg`);
    el.style.setProperty('--rotateY', `${rotateY}deg`);
    el.style.setProperty('--mouseX', `${(x / rect.width) * 100}%`);
    el.style.setProperty('--mouseY', `${(y / rect.height) * 100}%`);
  }, []);

  const handleCardMouseLeave = useCallback((e) => {
    const el = e.currentTarget;
    el.style.setProperty('--rotateX', '0deg');
    el.style.setProperty('--rotateY', '0deg');
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Live': return theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700';
      case 'In Progress': return theme === 'dark' ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700';
      case 'Completed': return theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700';
      default: return theme === 'dark' ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-700';
    }
  };

  const themeClasses = theme === 'dark' 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  const cardClasses = theme === 'dark'
    ? 'bg-gray-800/50 border-gray-700'
    : 'bg-white/70 border-gray-200';

  const filterClasses = theme === 'dark'
    ? 'bg-gray-800/30 border-gray-700'
    : 'bg-white/30 border-gray-300';

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <section 
        id="projects" 
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
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${
                theme === 'dark' ? 'bg-purple-500/5' : 'bg-purple-400/10'
              } animate-pulse`}
              style={{
                width: `${150 + Math.random() * 250}px`,
                height: `${150 + Math.random() * 250}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${5 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              My{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              A collection of projects showcasing my journey in web development and problem-solving
            </p>
          </div>

          {/* Filter Section */}
          <div className={`mb-12 ${isVisible ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
            <div className={`backdrop-blur-xl ${filterClasses} border rounded-2xl p-6 shadow-xl max-w-4xl mx-auto`}>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {FILTERS.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                      activeFilter === filter
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : theme === 'dark'
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {filter}
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        activeFilter === filter 
                          ? 'bg-white/20' 
                          : theme === 'dark' 
                          ? 'bg-gray-600/50' 
                          : 'bg-gray-200'
                      }`}>
                        {filterCounts[filter]}
                      </span>
                    </span>
                    {activeFilter === filter && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl animate-pulse" />
                    )}
                  </button>
                ))}
              </div>

              {/* Active Tag Display */}
              {activeTag && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Filtering by technology:
                  </span>
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm rounded-full">
                    {activeTag}
                  </span>
                  <button
                    onClick={() => setActiveTag(null)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Projects Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
            {filteredProjects.map((project, index) => (
              <div
                key={project.title}
                className="project-card-wrapper animate-slide-in-up"
                style={{animationDelay: `${0.6 + index * 0.1}s`}}
                onMouseEnter={() => setHoveredCard(project.title)}
                onMouseMove={(e) => handleCardMouseMove(e, project.title)}
                onMouseLeave={(e) => {
                  handleCardMouseLeave(e);
                  setHoveredCard(null);
                }}
              >
                <div className={`relative backdrop-blur-xl ${cardClasses} border rounded-2xl overflow-hidden shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 h-full project-card`}>
                  
                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                        Featured
                      </div>
                    </div>
                  )}

                  {/* Project Header with Image */}
                  <div className="relative h-32 bg-gray-200 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="object-cover w-full h-full"
                        style={{ objectPosition: 'center' }}
                      />
                    )}
                    {/* Status Badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6 flex flex-col h-[calc(100%-8rem)]">
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className={`text-sm leading-relaxed mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {project.about}
                      </p>
                    </div>

                    {/* Technologies */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <button
                            key={tech}
                            onClick={() => setActiveTag(tech)}
                            className={`px-3 py-1 text-xs rounded-full transition-all duration-300 hover:scale-105 ${
                              activeTag === tech
                                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                                : theme === 'dark'
                                ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-auto">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:scale-105 transition-all duration-300 hover:shadow-lg"
                      >
                        Details
                      </button>
                      {project.links.demo && (
                        <a
                          href={project.links.demo}
                          target="_blank"
                          rel="noreferrer"
                          className={`px-4 py-2 border-2 text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105 ${
                            theme === 'dark'
                              ? 'border-purple-500/50 text-purple-300 hover:bg-purple-500/10'
                              : 'border-purple-300 text-purple-700 hover:bg-purple-50'
                          }`}
                        >
                          Demo
                        </a>
                      )}
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noreferrer"
                          className={`px-4 py-2 border-2 text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105 ${
                            theme === 'dark'
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-700/50'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className={`text-center py-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No projects found</h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Try adjusting your filters to see more projects
              </p>
            </div>
          )}

          {/* Project Stats */}
          <div className={`mt-16 ${isVisible ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.8s'}}>
            <div className={`backdrop-blur-xl ${cardClasses} border rounded-2xl p-8 shadow-2xl text-center`}>
              <h3 className="text-2xl font-bold mb-6">
                Project{' '}
                <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                  Statistics
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Projects', value: ALL_PROJECTS.length, icon: '🚀' },
                  { label: 'Live Projects', value: ALL_PROJECTS.filter(p => p.status === 'Live').length, icon: '🌐' },
                  { label: 'Technologies', value: [...new Set(ALL_PROJECTS.flatMap(p => p.tech))].length, icon: '⚡' },
                  { label: 'Featured', value: ALL_PROJECTS.filter(p => p.featured).length, icon: '⭐' }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            />
            <div className={`relative w-full max-w-2xl backdrop-blur-xl ${cardClasses} border rounded-2xl shadow-2xl animate-modal-in overflow-hidden`}>
              
              {/* Modal Header */}
              <div className={`relative h-40 bg-gradient-to-br ${selectedProject.color} overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  ✕
                </button>
                <div className="absolute bottom-4 left-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{selectedProject.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status}
                  </span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <p className={`text-lg leading-relaxed mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedProject.about}
                </p>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((tech) => (
                      <span 
                        key={tech} 
                        className="px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm rounded-lg font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  {selectedProject.links.demo && (
                    <a
                      href={selectedProject.links.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 text-center"
                    >
                      View Live Demo
                    </a>
                  )}
                  {selectedProject.links.github && (
                    <a
                      href={selectedProject.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex-1 px-6 py-3 border-2 font-semibold rounded-xl hover:scale-105 transition-all duration-300 text-center ${
                        theme === 'dark'
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700/50'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      View Source Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slide-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes modal-in {
            from { opacity: 0; transform: scale(0.9) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          
          .animate-fade-in-up { animation: fade-in-up 0.8s ease-out both; }
          .animate-slide-in-up { animation: slide-in-up 0.6s ease-out both; }
          .animate-fade-in { animation: fade-in 0.5s ease-out both; }
          .animate-modal-in { animation: modal-in 0.3s ease-out both; }
          
          .project-card {
            transform-style: preserve-3d;
            transform: perspective(1000px) rotateX(var(--rotateX, 0deg)) rotateY(var(--rotateY, 0deg));
            transition: transform 0.1s ease-out;
          }
          
          .project-card:hover {
            transform: perspective(1000px) rotateX(var(--rotateX, 0deg)) rotateY(var(--rotateY, 0deg)) translateZ(20px);
          }
          
          .project-card-wrapper {
            opacity: 0;
          }
        `}</style>
      </section>
    </div>
  );
};

export default Projects;