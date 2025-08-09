import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

interface StepType {
  step: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  tags?: string[];
  tagColors?: string[];
  upload?: { types: string };
  note?: string;
  details?: Array<{ label: string; value: string }>;
}

const StepComponent: React.FC<{ step: StepType; index: number }> = ({ step, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative grid md:grid-cols-2 gap-8 items-center`}
    >
      {/* Text */}
      <div
        className={`${
          index % 2 === 0 ? "md:text-right" : "md:order-2"
        } space-y-4`}
      >
        <div
          className={`inline-block px-4 py-1 rounded-full bg-${step.color}-500/20 text-${step.color}-400 text-sm font-medium`}
        >
          {step.step}
        </div>
        <h3 className="text-2xl font-bold text-white">{step.title}</h3>
        <p className="text-gray-400">{step.description}</p>
      </div>

      {/* Card */}
      <div className={`${index % 2 !== 0 ? "md:order-1" : ""}`}>
        <motion.div
          whileHover={{ y: -5 }}
          className={`bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-${step.color}-500/30 shadow-lg hover:shadow-${step.color}-500/20 transition-all`}
        >
          <div className="flex items-center space-x-4 mb-4">
            <div
              className={`w-12 h-12 rounded-full bg-${step.color}-500/20 flex items-center justify-center`}
            >
              <i className={`${step.icon} text-${step.color}-400`}></i>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">{step.title}</h4>
            </div>
          </div>


          {step.upload && (
            <div className="border border-dashed border-gray-600 rounded-lg p-4 mt-3 text-center hover:border-white/40 transition">
              <i className="fas fa-cloud-upload-alt text-2xl text-gray-500 mb-2"></i>
              <p className="text-sm text-gray-400">Drag and drop your file here</p>
              <p className="text-xs text-gray-500">
                Accepted: {step.upload.types}
              </p>
              <button
                className={`mt-2 px-4 py-1 bg-${step.color}-500/20 text-${step.color}-400 text-sm rounded-full`}
              >
                Browse Files
              </button>
            </div>
          )}

          {step.note && (
            <div className="flex items-center gap-3 text-green-300 text-sm mt-2">
              <i className="fas fa-badge-check"></i>
              <span>{step.note}</span>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

const Landing: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activePortal, setActivePortal] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const trustedRef = useRef<HTMLDivElement>(null);
  const choosePortalRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  const steps: StepType[] = [
    {
      step: "Step 01",
      title: "Select Teammate & Mentor",
      description: "Choose your teammate and preferred mentor, then wait for approval.",
      color: "blue",
      icon: "fas fa-users",
      tags: ["Teammate chosen", "Mentor requested", "Awaiting"],
      tagColors: ["blue", "blue", "amber"],
    },
    {
      step: "Step 02",
      title: "Send Project Request with Abstract",
      description: "Submit your project title and abstract for mentor review.",
      color: "indigo",
      icon: "fas fa-paper-plane",
      details: [
        { label: "Title", value: "OK" },
        { label: "Abstract", value: "300–500 words" },
      ],
    },
    {
      step: "Step 03",
      title: "Mentor Approves or Denies",
      description: "Mentor reviews your request and decides. You'll be notified instantly.",
      color: "amber",
      icon: "fas fa-thumbs-up",
      tags: ["Approved", "Denied"],
      tagColors: ["green", "rose"],
    },
    {
      step: "Step 04",
      title: "Submit PPT",
      description: "Upload your presentation for evaluation.",
      color: "violet",
      icon: "fas fa-file",
      upload: { types: ".pptx, .pdf" },
    },
    {
      step: "Step 05",
      title: "Submit Report",
      description: "Upload your detailed project report for review.",
      color: "cyan",
      icon: "fas fa-file-alt",
      upload: { types: ".pdf, .docx" },
    },
    {
      step: "Step 06",
      title: "Final Approval",
      description: "Receive your final evaluation and approval from the mentor.",
      color: "green",
      icon: "fas fa-check-circle",
      note: "All requirements satisfied",
    },
  ];

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

  const handlePortalHover = (portal: string) => {
    setActivePortal(portal);
  };
  
  const handlePortalLeave = () => {
    setActivePortal(null);
  };


  

  
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -left-24 h-80 w-80 bg-indigo-900/10 rounded-full blur-3xl animate-aurora1"></div>
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 bg-fuchsia-900/10 rounded-full blur-3xl animate-aurora2"></div>

        <div className="relative flex flex-col items-center gap-7">
          <div className="relative h-32 w-32">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-black/30 via-black/20 to-black/30 blur-2xl"></div>
            <div className="absolute inset-0 border-6 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-rotate-slow opacity-40"></div>
            <span className="absolute inset-0 border-3 border-blue-500/15 rounded-full animate-pulse-ring"></span>
            <span className="absolute inset-0 border-3 border-purple-500/15 rounded-full animate-pulse-ring-2"></span>
            <img
              src="https://www.sathyabama.ac.in/sites/default/files/inline-images/NewRGB_0.jpg"
              alt="Sathyabama University Logo"
              className="relative z-10 h-32 w-32 rounded-full object-cover animate-breathe"
            />
            <span className="absolute w-2 h-2 bg-white rounded-full top-0 left-1/4 opacity-30 animate-sparkle"></span>
            <span className="absolute w-2 h-2 bg-white rounded-full bottom-1/4 right-0 opacity-30 animate-sparkle-2"></span>
            <span className="absolute w-2 h-2 bg-white rounded-full top-1/3 right-1/4 opacity-30 animate-sparkle-3"></span>
            <span className="absolute w-2 h-2 bg-white rounded-full bottom-0 left-1/5 opacity-30 animate-sparkle-4"></span>
            <span className="absolute w-2 h-2 bg-white rounded-full top-0 right-0 opacity-30 animate-sparkle-5"></span>
          </div>
          <div className="loader-text-royal text-sm tracking-wider text-gray-300">Loading portal...</div>
        </div>

        <style>{`
          @keyframes breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.04); }
          }
          .animate-breathe { animation: breathe 2.4s ease-in-out infinite; }

          @keyframes pulseRing {
            0% { transform: scale(0.9); opacity: 0.4; }
            80% { transform: scale(1.6); opacity: 0; }
            100% { transform: scale(1.6); opacity: 0; }
          }
          .animate-pulse-ring { animation: pulseRing 2.4s ease-out infinite; }
          .animate-pulse-ring-2 { animation: pulseRing 2.4s ease-out infinite 1.2s; }

          @keyframes rotate { to { transform: rotate(360deg); } }
          .animate-rotate-slow { animation: rotate 8s linear infinite; }

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

          @keyframes aurora1 {
            0%, 100% { transform: translate(0,0); }
            50% { transform: translate(15px, 10px); }
          }
          @keyframes aurora2 {
            0%, 100% { transform: translate(0,0); }
            50% { transform: translate(-15px, -10px); }
          }
          .animate-aurora1 { animation: aurora1 8s ease-in-out infinite; }
          .animate-aurora2 { animation: aurora2 9s ease-in-out infinite; }

          @keyframes twinkle {
            0%, 100% { opacity: 0.1; transform: scale(0.6); }
            50% { opacity: 0.5; transform: scale(1); }
          }
          .animate-sparkle { animation: twinkle 1.8s ease-in-out infinite; }
          .animate-sparkle-2 { animation: twinkle 1.8s ease-in-out infinite 0.3s; }
          .animate-sparkle-3 { animation: twinkle 1.8s ease-in-out infinite 0.6s; }
          .animate-sparkle-4 { animation: twinkle 1.8s ease-in-out infinite 0.9s; }
          .animate-sparkle-5 { animation: twinkle 1.8s ease-in-out infinite 1.2s; }
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
      <nav className="sticky top-0 z-50 px-6 md:px-8 py-4 md:py-6 flex justify-between items-center bg-black/40 backdrop-blur-lg border-b border-transparent shadow-lg relative">
  <style>{`
    .nav-link {
      position: relative;
      font-weight: 600;
      letter-spacing: 0.02em;
      transition: color 0.3s ease;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -4px;
      height: 2px;
      width: 0%;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      border-radius: 9999px;
      transition: width 0.3s ease;
    }
    .nav-link:hover::after {
      width: 100%;
    }
  `}</style>

  <div className="flex items-center space-x-3">
    <img
      src="https://www.sathyabama.ac.in/sites/default/files/inline-images/NewRGB_0.jpg"
      alt="Sathyabama University Logo"
      className="h-12 w-12 object-cover rounded-lg shadow-md"
    />
    <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 select-none">
      SATHYABAMA UNIVERSITY
    </span>
  </div>

  <div className="hidden md:flex space-x-10">
    <a
      href="#"
      className="nav-link text-gray-300 hover:text-white"
      onClick={(e) => {
        e.preventDefault();
        window.location.href = "/";
      }}
    >
      Home
    </a>

    <a
      href="https://www.sathyabama.ac.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="nav-link text-gray-300 hover:text-white"
    >
      About
    </a>

    <a href="/login" className="nav-link text-gray-300 hover:text-white">
      Projects
    </a>

    <a
      href="#footer"
      className="nav-link text-gray-300 hover:text-white"
      onClick={(e) => {
        e.preventDefault();
        const footer = document.getElementById("footer");
        if (footer) footer.scrollIntoView({ behavior: "smooth" });
      }}
    >
      Resources
    </a>

    <a
      href="https://www.linkedin.com/school/sathyabama/posts/?feedView=all"
      target="_blank"
      rel="noopener noreferrer"
      className="nav-link text-gray-300 hover:text-white"
    >
      Contact
    </a>
  </div>

  <button
    aria-label="Toggle menu"
    className="md:hidden relative p-2 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition"
  >
    <i className="fas fa-bars text-white text-2xl"></i>
  </button>

  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-t-full"></div>
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
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                onClick={() => trustedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
              <motion.button
                className="px-8 py-3 bg-transparent border border-blue-500 rounded-full text-blue-400 font-medium hover:bg-blue-500/10 transition-all duration-300"
                onClick={() => footerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </div>
        
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
              {["AI", "Data Science", "Cyber Security", "AI & Robotics", "Blockchain", "IoT", "AI & ML"].map((item, i) => (
                <span key={i} className="px-4 py-2 rounded-full border border-gray-700 bg-white/5 text-gray-300">
                  {item}
                </span>
              ))}
              {["AI", "Data Science", "Cyber Security", "AI & Robotics", "Blockchain", "IoT", "AI & ML"].map((item, i) => (
                <span key={`dup-${i}`} className="px-4 py-2 rounded-full border border-gray-700 bg-white/5 text-gray-300">
                  {item}
                </span>
              ))}
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
            <motion.div 
              className={`relative group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/20 cursor-pointer ${activePortal === 'student' ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/30' : ''}`}
              onMouseEnter={() => handlePortalHover('student')}
              onMouseLeave={handlePortalLeave}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors duration-300">
                  <i className="fas fa-user-graduate text-blue-400 text-2xl group-hover:text-blue-300 transition-colors duration-300"></i>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors duration-300">Student Portal</h3>
                
                <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors duration-300">
                  Submit your academic projects, track progress, and collaborate with mentors to refine your work.
                </p>
                
                <motion.button
                  className="px-6 py-2 bg-blue-600/30 rounded-full text-blue-300 font-medium group-hover:bg-blue-600/50 transition-all duration-300"
                  onClick={() => navigate("/login")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Enter Portal <i className="fas fa-arrow-right ml-2"></i>
                </motion.button>
              </div>
              
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-tl-full transform translate-y-1/2 translate-x-1/2"></div>
            </motion.div>
            
            {/* Mentor Portal */}
            <motion.div 
              className={`relative group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer ${activePortal === 'mentor' ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/30' : ''}`}
              onMouseEnter={() => handlePortalHover('mentor')}
              onMouseLeave={handlePortalLeave}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors duration-300">
                  <i className="fas fa-chalkboard-teacher text-purple-400 text-2xl group-hover:text-purple-300 transition-colors duration-300"></i>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors duration-300">Mentor Portal</h3>
                
                <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors duration-300">
                  Review student submissions, provide feedback, and guide students through their academic journey.
                </p>
                
                <motion.button
                  className="px-6 py-2 bg-purple-600/30 rounded-full text-purple-300 font-medium group-hover:bg-purple-600/50 transition-all duration-300"
                  onClick={() => navigate("/mentor-login")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Enter Portal <i className="fas fa-arrow-right ml-2"></i>
                </motion.button>
              </div>
              
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full transform translate-y-1/2 translate-x-1/2"></div>
            </motion.div>
            
            {/* Admin Portal */}
            <motion.div 
              className={`relative group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/20 cursor-pointer ${activePortal === 'admin' ? 'ring-2 ring-cyan-500 shadow-lg shadow-cyan-500/30' : ''}`}
              onMouseEnter={() => handlePortalHover('admin')}
              onMouseLeave={handlePortalLeave}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-6 group-hover:bg-cyan-500/30 transition-colors duration-300">
                  <i className="fas fa-user-shield text-cyan-400 text-2xl group-hover:text-cyan-300 transition-colors duration-300"></i>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors duration-300">Admin Portal</h3>
                
                <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors duration-300">
                  Manage the entire submission system, oversee user accounts, and maintain academic standards.
                </p>
                
                <motion.button
                  className="px-6 py-2 bg-cyan-600/30 rounded-full text-cyan-300 font-medium group-hover:bg-cyan-600/50 transition-all duration-300"
                  onClick={() => navigate("/admin-login")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Enter Portal <i className="fas fa-arrow-right ml-2"></i>
                </motion.button>
              </div>
              
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-tl-full transform translate-y-1/2 translate-x-1/2"></div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Workflow Section */}
      <div className="relative z-20 py-20 px-8 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl bottom-10 right-10"></div>

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
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform -translate-x-1/2 hidden md:block"></div>

            <div className="space-y-24 relative">
              {steps.map((step, index) => (
                <StepComponent key={index} step={step} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer
  id="footer"
  ref={footerRef}
  className="relative z-20 bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 pt-20 pb-12 px-8 border-t border-gray-700 shadow-inner"
>
  <div className="max-w-7xl mx-auto">
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
      <div>
        <div className="flex items-center space-x-3 mb-8">
          <img
            src="https://sathyabama.cognibot.in/pluginfile.php/1/theme_klass/footerlogo/1746428725/Sathyabama%20Logo%20%281%29.jfif"
            alt="Sathyabama University Logo"
            className="h-24 object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
          />
        </div>

        <p className="text-gray-400 mb-8 leading-relaxed font-light">
          Empowering mentors and students to collaborate seamlessly on project submissions and reviews.
        </p>

        <div className="flex space-x-5">
          {[
            {
              href: "https://x.com/sathyabamaSIST",
              label: "Twitter",
              icon: "fab fa-twitter",
              hover: "hover:bg-pink-600 hover:text-white",
            },
            {
              href: "https://www.facebook.com/SathyabamaOfficial/",
              label: "Facebook",
              icon: "fab fa-facebook-f",
              hover: "hover:bg-blue-600 hover:text-white",
            },
            {
              href: "https://www.instagram.com/sathyabama.official/",
              label: "Instagram",
              icon: "fab fa-instagram",
              hover: "hover:bg-pink-500 hover:text-white",
            },
            {
              href: "https://www.linkedin.com/school/sathyabama/posts/?feedView=all",
              label: "LinkedIn",
              icon: "fab fa-linkedin-in",
              hover: "hover:bg-blue-700 hover:text-white",
            },
          ].map(({ href, label, icon, hover }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={`w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 transition-colors duration-300 cursor-pointer ${hover} shadow-lg hover:scale-110`}
            >
              <i className={`${icon} text-xl`}></i>
            </a>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold text-xl mb-8 border-b border-pink-600 pb-3 uppercase tracking-wide">
          Quick Links
        </h3>
        <ul className="space-y-5">
          {["Home", "About Us", "Features", "Projects", "Contact"].map((text) => (
            <li key={text}>
              <a
                href="https://www.sathyabama.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors duration-300 font-medium"
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-white font-semibold text-xl mb-8 border-b border-pink-600 pb-3 uppercase tracking-wide">
          Resources
        </h3>
        <ul className="space-y-5">
          {["Documentation", "Tutorials", "FAQ", "Support Center", "Blog"].map((text) => (
            <li key={text}>
              <a
                href="https://www.sathyabama.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors duration-300 font-medium"
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-pink-500 font-bold text-2xl mb-6 uppercase tracking-widest">
          Quote of the Day
        </h3>
        <blockquote className="text-gray-400 italic border-l-4 border-pink-600 pl-6 text-lg leading-relaxed drop-shadow-lg">
          “If you think you’re perfect already, then you never will be.”           ― Cristiano Ronaldo
        </blockquote>
        
      </div>
    </div>

    <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm font-light">
      <p className="mb-4 md:mb-0 select-none">
        © {new Date().getFullYear()} Sathyabama University. All rights reserved.
      </p>

      <div className="flex space-x-8">
        <a
          href="/privacy-policy"
          className="hover:text-pink-500 transition-colors duration-300 cursor-pointer"
        >
          Privacy Policy
        </a>
        <a
          href="/terms-of-service"
          className="hover:text-pink-500 transition-colors duration-300 cursor-pointer"
        >
          Terms of Service
        </a>
        <a
          href="/cookie-policy"
          className="hover:text-pink-500 transition-colors duration-300 cursor-pointer"
        >
          Cookie Policy
        </a>
      </div>
    </div>
  </div>
</footer>
      
      {/* Floating Action Button */}
      
      
      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
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
      `}</style>
    </div>
  );
}

export default Landing;