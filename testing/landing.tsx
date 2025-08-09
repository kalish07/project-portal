// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from "react-router-dom";

const Landing: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activePortal, setActivePortal] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const trustedRef = useRef<HTMLDivElement>(null);
  const choosePortalRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  

  const statsRef = useRef<HTMLDivElement>(null);
  

  
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        const opacity = 1 - Math.min(scrollPosition / 500, 1);
        const translateY = scrollPosition * 0.5;
        
        heroRef.current.style.opacity = opacity.toString();
        heroRef.current.style.transform = `translateY(${translateY}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  const animateCount = (
    setter: (v: number) => void,
    target: number,
    durationMs: number
  ) => {
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setter(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  
  
  const handlePortalHover = (portal: string) => {
    setActivePortal(portal);
  };
  
  const handlePortalLeave = () => {
    setActivePortal(null);
  };
  
  if (isLoading) {
    return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Ambient aurora */}
      <div className="pointer-events-none absolute -top-20 -left-24 h-80 w-80 bg-indigo-900/10 rounded-full blur-3xl animate-aurora1"></div>
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 bg-fuchsia-900/10 rounded-full blur-3xl animate-aurora2"></div>

      <div className="relative flex flex-col items-center gap-7">
        <div className="relative h-32 w-32">
          {/* Glow bloom */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-black/30 via-black/20 to-black/30 blur-2xl"></div>
          {/* Rotating gradient ring */}
          <div className="absolute inset-0 conic-ring-royal animate-rotate-slow opacity-40"></div>
          {/* Soft pulse rings */}
          <span className="pulse-ring-royal opacity-30"></span>
          <span className="pulse-ring-royal-2 opacity-30"></span>
          {/* Logo */}
          <img
            src="https://www.sathyabama.ac.in/sites/default/files/inline-images/NewRGB_0.jpg"
            alt="Sathyabama University Logo"
            className="relative z-10 h-32 w-32 rounded-full object-cover animate-breathe"
          />
          {/* Sparkles */}
          <span className="sparkle sparkle-1 opacity-30"></span>
          <span className="sparkle sparkle-2 opacity-30"></span>
          <span className="sparkle sparkle-3 opacity-30"></span>
          <span className="sparkle sparkle-4 opacity-30"></span>
          <span className="sparkle sparkle-5 opacity-30"></span>
        </div>
        <div className="loader-text-royal text-sm tracking-wider text-gray-300">Loading portal…</div>
      </div>

      <style>{`
        @keyframes breathe {
          0% { transform: scale(1); box-shadow: 0 0 0px 0 rgba(99,102,241,0.0); }
          50% { transform: scale(1.04); box-shadow: 0 0 40px 0 rgba(147,51,234,0.2); }
          100% { transform: scale(1); box-shadow: 0 0 0px 0 rgba(99,102,241,0.0); }
        }
        .animate-breathe { animation: breathe 2.4s ease-in-out infinite; }

        @keyframes pulseRing {
          0% { transform: scale(0.9); opacity: 0.4; }
          80% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .pulse-ring-royal {
          position: absolute; inset: 0;
          border: 3px solid rgba(99,102,241,0.15);
          border-radius: 9999px;
          animation: pulseRing 2.4s ease-out infinite;
        }
        .pulse-ring-royal-2 {
          position: absolute; inset: 0;
          border: 3px solid rgba(138,43,226,0.15);
          border-radius: 9999px;
          animation: pulseRing 2.4s ease-out infinite;
          animation-delay: 1.2s;
        }

        /* Rotating conic gradient ring */
        @keyframes rotate { to { transform: rotate(360deg); } }
        .animate-rotate-slow {
          animation: rotate 8s linear infinite;
          will-change: transform;
        }
        .conic-ring-royal {
          border: 6px solid transparent;
          border-radius: 9999px;
          border-image: conic-gradient(from 0deg, #4f46e5, #6d28d9, #8b5cf6, #4f46e5) 1;
        }

        /* Shimmering loader text */
        @keyframes shimmerText {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .loader-text-royal {
          background: linear-gradient(90deg, rgba(100,100,100,0.3), rgba(200,200,200,0.8), rgba(150,50,150,0.3));
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmerText 2.2s linear infinite;
        }

        /* Aurora motion */
        @keyframes aurora1 {
          0% { transform: translate(0,0); }
          50% { transform: translate(15px, 10px); }
          100% { transform: translate(0,0); }
        }
        @keyframes aurora2 {
          0% { transform: translate(0,0); }
          50% { transform: translate(-15px, -10px); }
          100% { transform: translate(0,0); }
        }
        .animate-aurora1 { animation: aurora1 8s ease-in-out infinite; }
        .animate-aurora2 { animation: aurora2 9s ease-in-out infinite; }

        /* Sparkles */
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.6); }
          50% { opacity: 0.5; transform: scale(1); }
        }
        .sparkle {
          position: absolute;
          width: 7px;
          height: 7px;
          background: radial-gradient(circle, rgba(255,255,255,0.65), rgba(255,255,255,0) 70%);
          border-radius: 9999px;
          animation: twinkle 1.8s ease-in-out infinite;
          filter: drop-shadow(0 0 3px rgba(255,255,255,0.3));
        }
        .sparkle-1 { top: -6px; left: 18px; animation-delay: 0.0s; }
        .sparkle-2 { bottom: 10px; right: -6px; animation-delay: 0.3s; }
        .sparkle-3 { top: 22px; right: 12px; animation-delay: 0.6s; }
        .sparkle-4 { bottom: -4px; left: 8px; animation-delay: 0.9s; }
        .sparkle-5 { top: -10px; right: -8px; animation-delay: 1.2s; }
      `}</style>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-blue-900 text-white overflow-hidden">
      {/* Particle Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-blue-500"
            style={{
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
              animation: `float ${Math.random() * 15 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Grid Background */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0, 100, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 100, 255, 0.2) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          perspective: '1000px',
          transform: 'rotateX(60deg) scale(2)',
          transformOrigin: 'center center',
        }}></div>
      </div>
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 px-8 py-4 md:py-6 flex justify-between items-center bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center space-x-2">
          <img
            src="https://www.sathyabama.ac.in/sites/default/files/inline-images/NewRGB_0.jpg"
            alt="Sathyabama University Logo"
            className="h-10 w-10 object-cover rounded-full"
          />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            SATHYABAMA UNIVERSITY
          </span>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">Home</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">About</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">Projects</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">Resources</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">Contact</a>
        </div>
        
        <button className="md:hidden text-white">
          <i className="fas fa-bars text-xl"></i>
        </button>
      </nav>
      
      {/* Hero Section */}
      <div 
        ref={heroRef}
        className="relative z-10 min-h-[90vh] flex items-center justify-center px-8"
        style={{
          backgroundImage: `url(https://www.sathyabama.ac.in/sites/default/files/2020-01/DJI_0221.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-blue-400 text-xl font-semibold tracking-wider">School of Computing</h2>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Project Submission
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                  Portal
                </span>
              </h1>
            </div>
            
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
              Where technology meets seamless educational experience. Discover a new dimension of academic collaboration and innovation.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 !rounded-button whitespace-nowrap cursor-pointer"
                onClick={() => {
                  try {
                    const trustedTop = trustedRef.current?.getBoundingClientRect().top ?? 0;
                    const portalTop = choosePortalRef.current?.getBoundingClientRect().top ?? trustedTop;
                    const pageOffset = window.scrollY || window.pageYOffset;
                    const absTrustedTop = pageOffset + trustedTop;
                    const absPortalTop = pageOffset + portalTop;
                    const viewportHeight = window.innerHeight;
                    // Target a position that tries to include both sections
                    let targetTop = absTrustedTop;
                    const distance = absPortalTop - absTrustedTop;
                    if (distance > viewportHeight * 0.85) {
                      targetTop = Math.max(0, absPortalTop - Math.floor(viewportHeight * 0.85));
                    }
                    window.scrollTo({ top: targetTop, behavior: 'smooth' });
                  } catch {
                    trustedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                Get Started
              </button>
              <button
                className="px-8 py-3 bg-transparent border border-blue-500 rounded-full text-blue-400 font-medium hover:bg-blue-500/10 transition-all duration-300 !rounded-button whitespace-nowrap cursor-pointer"
                onClick={() => footerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Learn More
              </button>
            </div>
          </div>
          
          <div className="hidden md:block">
            {/* This space is intentionally left empty as the background image serves as the right side visual */}
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
          <div className="mx-auto w-8 h-12 rounded-full border border-gray-500/40 flex items-start justify-center p-1 text-gray-300/80">
            <div className="w-1 h-2 bg-gray-300 rounded-full animate-shimmer"></div>
          </div>
          <div className="text-[10px] mt-3 tracking-[0.3em] uppercase text-gray-400">Scroll</div>
        </div>
      </div>

      {/* Department Specializations & Courses */}
      <div ref={trustedRef} className="relative z-20 py-10 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 text-center text-gray-400 text-xs md:text-sm uppercase tracking-[0.3em]"> Department Specializations and Courses</div>
          <div className="relative overflow-hidden">
            <div className="flex items-center gap-12 whitespace-nowrap opacity-70 hover:opacity-90 transition-opacity duration-300 animate-marquee">
              <span className="px-4 py-2 rounded-full border border-gray-700 bg-white/5 text-gray-300">AI</span>
              <span className="px-4 py-2 rounded-full border border-gray-700 bg-white/5 text-gray-300">Data Science</span>
              <span className="px-4 py-2 rounded-full border border-gray-700 bg-white/5 text-gray-300">Cyber Security</span>
              <span className="px-4 py-2 rounded-full border border-gray-700 bg-white/5 text-gray-300">AI & Robotics</span>
              <span className="px-4 py-2 rounded-full border border-gray-700 bg-white/5 text-gray-300">Blockchain</span>
              <span className="px-4 py-2 rounded-full border border-gray-700 bg-white/5 text-gray-300">IoT</span>
              <span className="px-4 py-2 rounded-full border border-gray-700 bg-white/5 text-gray-300">AI & ML</span>
              <span className="px-4 py-2 rounded-full border border-gray-700 bg-white/5 text-gray-300">AI</span>
              <span className="px-4 py-2 rounded-full border border-gray-700 bg-white/5 text-gray-300">Data Science</span>
              <span className="px-4 py-2 rounded-full border border-gray-700 bg-white/5 text-gray-300">Cyber Security</span>
              <span className="px-4 py-2 rounded-full border border-gray-700 bg-white/5 text-gray-300">AI & Robotics</span>
              <span className="px-4 py-2 rounded-full border border-gray-700 bg-white/5 text-gray-300">Blockchain</span>
              <span className="px-4 py-2 rounded-full border border-gray-700 bg-white/5 text-gray-300">IoT</span>
              <span className="px-4 py-2 rounded-full border border-gray-700 bg-white/5 text-gray-300">AI & ML</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Portal Section */}
      <div ref={choosePortalRef} className="relative z-20 py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Choose Your Portal
              </span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Select your role to access the specialized features and tools designed for your unique academic journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Student Portal */}
            <div 
              className={`relative group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/20 cursor-pointer ${activePortal === 'student' ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/30' : ''}`}
              onMouseEnter={() => handlePortalHover('student')}
              onMouseLeave={handlePortalLeave}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors duration-300">
                  <i className="fas fa-pencil-alt text-blue-400 text-2xl group-hover:text-blue-300 transition-colors duration-300"></i>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors duration-300">Student Portal</h3>
                
                <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors duration-300">
                  Submit your academic projects, track progress, and collaborate with mentors to refine your work.
                </p>
                
                <button
                  className="px-6 py-2 bg-blue-600/30 rounded-full text-blue-300 font-medium group-hover:bg-blue-600/50 transition-all duration-300 !rounded-button whitespace-nowrap cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Enter Portal <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
              
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-tl-full transform translate-y-1/2 translate-x-1/2"></div>
            </div>
            
            {/* Mentor Portal */}
            <div 
              className={`relative group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer ${activePortal === 'mentor' ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/30' : ''}`}
              onMouseEnter={() => handlePortalHover('mentor')}
              onMouseLeave={handlePortalLeave}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors duration-300">
                  <i className="fas fa-stamp text-purple-400 text-2xl group-hover:text-purple-300 transition-colors duration-300"></i>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors duration-300">Mentor Portal</h3>
                
                <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors duration-300">
                  Review student submissions, provide feedback, and guide students through their academic journey.
                </p>
                
                <button
                  className="px-6 py-2 bg-purple-600/30 rounded-full text-purple-300 font-medium group-hover:bg-purple-600/50 transition-all duration-300 !rounded-button whitespace-nowrap cursor-pointer"
                  onClick={() => navigate("/mentor-login")}
                >
                  Enter Portal <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
              
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full transform translate-y-1/2 translate-x-1/2"></div>
            </div>
            
            {/* Admin Portal */}
            <div 
              className={`relative group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/20 cursor-pointer ${activePortal === 'admin' ? 'ring-2 ring-cyan-500 shadow-lg shadow-cyan-500/30' : ''}`}
              onMouseEnter={() => handlePortalHover('admin')}
              onMouseLeave={handlePortalLeave}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-6 group-hover:bg-cyan-500/30 transition-colors duration-300">
                  <i className="fas fa-shield-alt text-cyan-400 text-2xl group-hover:text-cyan-300 transition-colors duration-300"></i>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors duration-300">Admin Portal</h3>
                
                <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors duration-300">
                  Manage the entire submission system, oversee user accounts, and maintain academic standards.
                </p>
                
                <button
                  className="px-6 py-2 bg-cyan-600/30 rounded-full text-cyan-300 font-medium group-hover:bg-cyan-600/50 transition-all duration-300 !rounded-button whitespace-nowrap cursor-pointer"
                  onClick={() => navigate("/admin-login")}
                >
                  Enter Portal <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
              
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-tl-full transform translate-y-1/2 translate-x-1/2"></div>
            </div>
          </div>
        </div>
      </div>
      
      
      
      {/* Workflow Section */}
      <div className="relative z-20 py-20 px-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Submission Workflow
              </span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our streamlined process ensures efficient project submissions and reviews.
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 transform -translate-x-1/2 hidden md:block"></div>
            
            <div className="space-y-24 relative">
              {/* Step 1 */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right space-y-4">
                  <div className="inline-block px-4 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">Step 01</div>
                  <h3 className="text-2xl font-bold text-white">Select Teammate & Mentor</h3>
                  <p className="text-gray-400">Choose your teammate and preferred mentor, then wait for approval.</p>
                </div>
                
                <div className="relative">
                  {/* Timeline Node */}
                  <div className="absolute left-0 top-1/2 w-8 h-8 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-10">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-blue-500/30">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <i className="fas fa-users text-blue-400"></i>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">Team & Mentor Selection</h4>
                        <p className="text-gray-400 text-sm">Pending approval</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-300">Teammate chosen</span>
                      <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-300">Mentor requested</span>
                      <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-300">Awaiting</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:order-2 space-y-4">
                  <div className="inline-block px-4 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-medium">Step 02</div>
                  <h3 className="text-2xl font-bold text-white">Send Project Request with Abstract</h3>
                  <p className="text-gray-400">Submit your project title and abstract for mentor review.</p>
                </div>
                
                <div className="relative md:order-1">
                  {/* Timeline Node */}
                  <div className="absolute right-0 top-1/2 w-8 h-8 bg-indigo-500 rounded-full transform translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-10">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-indigo-500/30">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <i className="fas fa-paper-plane text-indigo-400"></i>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">Project Request</h4>
                        <p className="text-gray-400 text-sm">Include a clear abstract</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs text-gray-400">
                      <div className="flex items-center justify-between">
                        <span>Title</span>
                        <span className="text-gray-300">OK</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Abstract</span>
                        <span className="text-gray-300">300–500 words</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right space-y-4">
                  <div className="inline-block px-4 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium">Step 03</div>
                  <h3 className="text-2xl font-bold text-white">Mentor Approves or Denies</h3>
                  <p className="text-gray-400">Mentor reviews your request and decides. You’ll be notified instantly.</p>
                </div>
                
                <div className="relative">
                  {/* Timeline Node */}
                  <div className="absolute left-0 top-1/2 w-8 h-8 bg-amber-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-10">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-amber-500/30">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <i className="fas fa-thumbs-up text-amber-400"></i>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">Decision</h4>
                        <p className="text-gray-400 text-sm">Approval or changes requested</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-300"><i className="fas fa-check mr-1"></i>Approved</span>
                      <span className="px-2 py-1 rounded-full bg-rose-500/10 text-rose-300"><i className="fas fa-times mr-1"></i>Denied</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:order-2 space-y-4">
                  <div className="inline-block px-4 py-1 rounded-full bg-violet-500/20 text-violet-400 text-sm font-medium">Step 04</div>
                  <h3 className="text-2xl font-bold text-white">Submit PPT</h3>
                  <p className="text-gray-400">Upload your presentation for evaluation.</p>
                </div>
                
                <div className="relative md:order-1">
                  {/* Timeline Node */}
                  <div className="absolute right-0 top-1/2 w-8 h-8 bg-violet-500 rounded-full transform translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-10">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-violet-500/30">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                        <i className="fas fa-file text-violet-400"></i>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">PPT Upload</h4>
                        <p className="text-gray-400 text-sm">Accepted: .pptx, .pdf</p>
                      </div>
                    </div>
                    
                    <div className="border border-dashed border-gray-600 rounded-lg p-4 mt-3 text-center">
                      <i className="fas fa-cloud-upload-alt text-2xl text-gray-500 mb-2"></i>
                      <p className="text-sm text-gray-400">Drag and drop your PPT here</p>
                      <button className="mt-2 px-4 py-1 bg-violet-500/20 text-violet-400 text-sm rounded-full !rounded-button whitespace-nowrap cursor-pointer">Browse Files</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right space-y-4">
                  <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium">Step 05</div>
                  <h3 className="text-2xl font-bold text-white">Submit Report</h3>
                  <p className="text-gray-400">Upload your detailed project report for review.</p>
                </div>
                
                <div className="relative">
                  {/* Timeline Node */}
                  <div className="absolute left-0 top-1/2 w-8 h-8 bg-cyan-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-10">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-cyan-500/30">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <i className="fas fa-file-alt text-cyan-400"></i>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">Report Upload</h4>
                        <p className="text-gray-400 text-sm">Accepted: .pdf, .docx</p>
                      </div>
                    </div>
                    
                    <div className="border border-dashed border-gray-600 rounded-lg p-4 mt-3 text-center">
                      <i className="fas fa-cloud-upload-alt text-2xl text-gray-500 mb-2"></i>
                      <p className="text-sm text-gray-400">Drag and drop your report here</p>
                      <button className="mt-2 px-4 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded-full !rounded-button whitespace-nowrap cursor-pointer">Browse Files</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 6 */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:order-2 space-y-4">
                  <div className="inline-block px-4 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">Step 06</div>
                  <h3 className="text-2xl font-bold text-white">Final Approval</h3>
                  <p className="text-gray-400">Receive your final evaluation and approval from the mentor.</p>
                </div>
                
                <div className="relative md:order-1">
                  {/* Timeline Node */}
                  <div className="absolute right-0 top-1/2 w-8 h-8 bg-green-500 rounded-full transform translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-10">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-green-500/30">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        <i className="fas fa-check-circle text-green-400"></i>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">Approval Issued</h4>
                        <p className="text-gray-400 text-sm">Certificate unlocks after approval</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-green-300 text-sm">
                      <i className="fas fa-badge-check"></i>
                      <span>All requirements satisfied</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
      
      {/* Footer */}
      <footer ref={footerRef} className="relative z-20 bg-gray-900 pt-20 pb-10 px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-20">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <i className="fas fa-graduation-cap text-white"></i>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Quantum Academy
                </span>
              </div>
              
              <p className="text-gray-400 mb-6">
                Empowering the next generation of academic excellence through innovative project submission and collaboration.
              </p>
              
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-colors duration-300 cursor-pointer">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors duration-300 cursor-pointer">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-colors duration-300 cursor-pointer">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-colors duration-300 cursor-pointer">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-6">Resources</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer">Support Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-6">Subscribe</h3>
              <p className="text-gray-400 mb-4">Stay updated with our latest features and releases.</p>
              
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="email" 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" 
                    placeholder="Your email address" 
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-1.5 rounded-md hover:bg-blue-600 transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
                
                <p className="text-xs text-gray-500">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates.
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 Quantum Academy. All rights reserved.
            </p>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm cursor-pointer">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm cursor-pointer">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm cursor-pointer">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1 !rounded-button cursor-pointer">
        <i className="fas fa-headset text-xl"></i>
      </button>
      
      {/* Custom Styles */}
      <style>{`
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee { animation: marquee 25s linear infinite; }

  @keyframes shimmer {
    0% { opacity: 0; transform: translateY(0); }
    50% { opacity: 1; transform: translateY(8px); }
    100% { opacity: 0; transform: translateY(14px); }
  }
  .animate-shimmer { animation: shimmer 1.8s ease-in-out infinite; }

  @keyframes breathe {
    0% { transform: scale(1); box-shadow: 0 0 0px 0 rgba(99,102,241,0.0); }
    50% { transform: scale(1.04); box-shadow: 0 0 60px 0 rgba(147,51,234,0.35); }
    100% { transform: scale(1); box-shadow: 0 0 0px 0 rgba(99,102,241,0.0); }
  }
  .animate-breathe { animation: breathe 2.4s ease-in-out infinite; }

  @keyframes pulseRing {
    0% { transform: scale(0.9); opacity: 0.6; }
    80% { transform: scale(1.6); opacity: 0; }
    100% { transform: scale(1.6); opacity: 0; }
  }
  .pulse-ring { position: absolute; inset: 0; border: 3px solid rgba(59,130,246,0.5); border-radius: 9999px; animation: pulseRing 2.4s ease-out infinite; }
  .pulse-ring-2 { position: absolute; inset: 0; border: 3px solid rgba(168,85,247,0.45); border-radius: 9999px; animation: pulseRing 2.4s ease-out infinite; animation-delay: 1.2s; }
`}</style>
    </div>
  );
}

export default Landing;
