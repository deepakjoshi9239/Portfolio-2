
import React, { useState, useEffect, useRef, useMemo } from 'react';
import emailjs from 'emailjs-com';

const Contact = ({ theme = 'dark' }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: 'Website',
    subject: '',
    message: '',
  });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success
  const [openType, setOpenType] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const typeRef = useRef(null);
  const sectionRef = useRef(null);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
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

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const onDoc = (e) => {
      if (!typeRef.current) return;
      if (!typeRef.current.contains(e.target)) setOpenType(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = useMemo(() => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (form.message.trim().length < 10) errs.message = 'Message should be at least 10 characters';
    return errs;
  }, [form]);

  const onBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(validate).length) return;
    setStatus('submitting');
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: form.name,
          from_email: form.email,
          project_type: form.type,
          subject: form.subject,
          message: form.message,
        },
        publicKey
      );
      setStatus('success');
      setForm({ name: '', email: '', type: 'Website', subject: '', message: '' });
      setTouched({});
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setStatus('idle');
      alert('Failed to send message. Please try again later.');
    }
  };

  const messageLimit = 500;
  const messageLen = form.message.length;

  const themeClasses = theme === 'dark' 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <section 
        id="contact" 
        ref={sectionRef}
        className={`relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden ${themeClasses}`}
        style={{
          background: theme === 'dark' 
            ? `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`
            : `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)`
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Orbs */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full mix-blend-multiply animate-pulse ${
                theme === 'dark' ? 'bg-purple-500/5' : 'bg-purple-400/10'
              }`}
              style={{
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${4 + Math.random() * 2}s`
              }}
            />
          ))}
          
          {/* Grid Pattern */}
          <div className={`absolute inset-0 opacity-5 ${theme === 'dark' ? 'bg-white' : 'bg-black'}`} 
               style={{
                 backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                 backgroundSize: '40px 40px'
               }} 
          />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          {/* Header */}
          <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Let's{' '}
              <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                Connect
              </span>
            </h2>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto leading-relaxed`}>
              Have an opportunity, question, or just want to say hello? I'd love to hear from you and discuss how we can work together.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div className={`space-y-8 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <div className={`p-8 rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/70'
              } backdrop-blur-sm border ${
                theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
              } shadow-2xl hover:scale-105 transition-all duration-500 group`}>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 group-hover:translate-x-2 transition-transform duration-300">
                    <div className={`w-12 h-12 rounded-full ${
                      theme === 'dark' ? 'bg-purple-600/20' : 'bg-purple-100'
                    } flex items-center justify-center`}>
                      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Email</h3>
                      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                       joshideepak5455@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 group-hover:translate-x-2 transition-transform duration-300 delay-100">
                    <div className={`w-12 h-12 rounded-full ${
                      theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-100'
                    } flex items-center justify-center`}>
                      <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">LinkedIn</h3>
                      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        https://www.linkedin.com/in/deepak-joshi-50466b265/
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 group-hover:translate-x-2 transition-transform duration-300 delay-200">
                    <div className={`w-12 h-12 rounded-full ${
                      theme === 'dark' ? 'bg-green-600/20' : 'bg-green-100'
                    } flex items-center justify-center`}>
                      <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">GitHub</h3>
                      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        https://github.com/deepakjoshi9239
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-8 pt-6 border-t border-gray-700/30">
                  <div className="flex space-x-4">
                    <a href="mailto:joshideepak5455@gmail.com" className="group relative p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
                    </a>
                    <a href="https://github.com/deepakjoshi9239" target="_blank" rel="noopener noreferrer" className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 border-2 ${
                      theme === 'dark' 
                        ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white hover:bg-gray-700/50' 
                        : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/deepak-joshi-50466b265/" target="_blank" rel="noopener noreferrer" className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 border-2 ${
                      theme === 'dark' 
                        ? 'border-gray-600 hover:border-blue-500 text-gray-300 hover:text-blue-400 hover:bg-blue-500/10' 
                        : 'border-gray-300 hover:border-blue-400 text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className={`p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800/30' : 'bg-white/50'
              } backdrop-blur-sm border ${
                theme === 'dark' ? 'border-gray-700/30' : 'border-gray-200/30'
              } hover:scale-105 transition-all duration-500`}>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="group">
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                      &lt;24h
                    </div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Response Time
                    </div>
                  </div>
                  <div className="group">
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                      100%
                    </div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Satisfaction
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={`${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              <div className={`p-8 rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/70'
              } backdrop-blur-sm border ${
                theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
              } shadow-2xl hover:shadow-3xl transition-all duration-500`}>
                
                {/* Success Alert */}
                {status === 'success' && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl text-green-400 animate-bounce-in">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Thanks! Your message has been sent successfully.</span>
                    </div>
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                  {/* Name and Email Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <label className={`absolute -top-2.5 left-3 px-2 text-sm font-medium transition-all duration-300 ${
                        form.name || touched.name
                          ? theme === 'dark' 
                            ? 'text-purple-400 bg-gray-800' 
                            : 'text-purple-600 bg-white'
                          : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      } group-focus-within:text-purple-400 group-focus-within:${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        onBlur={onBlur}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 ${
                          touched.name && validate.name
                            ? 'border-red-500 focus:border-red-400'
                            : theme === 'dark'
                              ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:bg-gray-900/70'
                              : 'bg-gray-50/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:bg-white/70'
                        } hover:scale-102 focus:scale-102`}
                        placeholder="Enter your full name"
                      />
                      {touched.name && validate.name && (
                        <p className="mt-1 text-sm text-red-400 animate-fade-in">{validate.name}</p>
                      )}
                    </div>

                    <div className="relative group">
                      <label className={`absolute -top-2.5 left-3 px-2 text-sm font-medium transition-all duration-300 ${
                        form.email || touched.email
                          ? theme === 'dark' 
                            ? 'text-purple-400 bg-gray-800' 
                            : 'text-purple-600 bg-white'
                          : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      } group-focus-within:text-purple-400 group-focus-within:${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        onBlur={onBlur}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 ${
                          touched.email && validate.email
                            ? 'border-red-500 focus:border-red-400'
                            : theme === 'dark'
                              ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:bg-gray-900/70'
                              : 'bg-gray-50/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:bg-white/70'
                        } hover:scale-102 focus:scale-102`}
                        placeholder="your.email@example.com"
                      />
                      {touched.email && validate.email && (
                        <p className="mt-1 text-sm text-red-400 animate-fade-in">{validate.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Project Type and Subject Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative" ref={typeRef}>
                      <label className={`absolute -top-2.5 left-3 px-2 text-sm font-medium ${
                        theme === 'dark' ? 'text-purple-400 bg-gray-800' : 'text-purple-600 bg-white'
                      }`}>
                        Project Type
                      </label>
                      <button
                        type="button"
                        onClick={() => setOpenType(!openType)}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none text-left flex items-center justify-between ${
                          theme === 'dark'
                            ? 'bg-gray-900/50 border-gray-600 text-white focus:border-purple-400 hover:bg-gray-900/70'
                            : 'bg-gray-50/50 border-gray-300 text-gray-900 focus:border-purple-500 hover:bg-white/70'
                        } hover:scale-102`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            form.type === 'Website' ? 'bg-blue-500' :
                            form.type === 'UI/UX' ? 'bg-purple-500' :
                            form.type === 'API' ? 'bg-green-500' : 'bg-gray-500'
                          }`} />
                          <span>{form.type}</span>
                        </div>
                        <svg className={`w-5 h-5 transition-transform duration-200 ${openType ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {openType && (
                        <div className={`absolute top-full left-0 w-full mt-1 ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        } border ${
                          theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                        } rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-down`}>
                          {['Website', 'UI/UX', 'API', 'Other'].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                setForm(f => ({ ...f, type: option }));
                                setOpenType(false);
                              }}
                              className={`w-full px-4 py-3 text-left hover:${
                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                              } transition-colors duration-200 flex items-center space-x-2 ${
                                form.type === option ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100') : ''
                              }`}
                            >
                              <div className={`w-3 h-3 rounded-full ${
                                option === 'Website' ? 'bg-blue-500' :
                                option === 'UI/UX' ? 'bg-purple-500' :
                                option === 'API' ? 'bg-green-500' : 'bg-gray-500'
                              }`} />
                              <span>{option}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative group">
                      <label className={`absolute -top-2.5 left-3 px-2 text-sm font-medium transition-all duration-300 ${
                        form.subject || touched.subject
                          ? theme === 'dark' 
                            ? 'text-purple-400 bg-gray-800' 
                            : 'text-purple-600 bg-white'
                          : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      } group-focus-within:text-purple-400 group-focus-within:${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={onChange}
                        onBlur={onBlur}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 ${
                          touched.subject && validate.subject
                            ? 'border-red-500 focus:border-red-400'
                            : theme === 'dark'
                              ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:bg-gray-900/70'
                              : 'bg-gray-50/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:bg-white/70'
                        } hover:scale-102 focus:scale-102`}
                        placeholder="What's this about?"
                      />
                      {touched.subject && validate.subject && (
                        <p className="mt-1 text-sm text-red-400 animate-fade-in">{validate.subject}</p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="relative group">
                    <label className={`absolute -top-2.5 left-3 px-2 text-sm font-medium transition-all duration-300 ${
                      form.message || touched.message
                        ? theme === 'dark' 
                          ? 'text-purple-400 bg-gray-800' 
                          : 'text-purple-600 bg-white'
                        : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    } group-focus-within:text-purple-400 group-focus-within:${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={onChange}
                      onBlur={onBlur}
                      maxLength={messageLimit}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 resize-none ${
                        touched.message && validate.message
                          ? 'border-red-500 focus:border-red-400'
                          : theme === 'dark'
                            ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:bg-gray-900/70'
                            : 'bg-gray-50/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:bg-white/70'
                      } hover:scale-102 focus:scale-102`}
                      placeholder="Tell me about your project, timeline, budget, or anything else you'd like to discuss..."
                    />
                    
                    {/* Character Counter */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {messageLen}/{messageLimit} characters
                      </div>
                      <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 rounded-full"
                          style={{ width: `${Math.min(100, (messageLen / messageLimit) * 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    {touched.message && validate.message && (
                      <p className="mt-1 text-sm text-red-400 animate-fade-in">{validate.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'submitting' || Object.keys(validate).length > 0}
                    className={`group relative w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 overflow-hidden ${
                      status === 'submitting' || Object.keys(validate).length > 0
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transform-gpu'
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-3">
                      {status === 'success' ? (
                        <>
                          <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Message Sent!</span>
                        </>
                      ) : status === 'submitting' ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          <span>Send Message</span>
                          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </>
                      )}
                    </span>
                    
                    {/* Button Effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Custom CSS for animations */}
  <style>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fade-in-left {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes fade-in-right {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slide-down {
            from { opacity: 0; transform: translateY(-10px); }
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
          
          .animate-fade-in-up { animation: fade-in-up 0.8s ease-out both; }
          .animate-fade-in-left { animation: fade-in-left 0.8s ease-out both; }
          .animate-fade-in-right { animation: fade-in-right 0.8s ease-out both; }
          .animate-slide-down { animation: slide-down 0.3s ease-out both; }
          .animate-bounce-in { animation: bounce-in 0.6s ease-out both; }
          .animate-fade-in { animation: fade-in 0.5s ease-out both; }
          .animate-gradient-x { animation: gradient-x 3s ease infinite; }
          .hover\\:scale-102:hover { transform: scale(1.02); }
          .focus\\:scale-102:focus { transform: scale(1.02); }
        `}</style>
      </section>
    </div>
  );
};

export default Contact;