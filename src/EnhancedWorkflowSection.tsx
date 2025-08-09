// Enhanced Workflow Section with Advanced Animations
import React, { useState, useEffect, useRef } from 'react';

const EnhancedWorkflowSection: React.FC = () => {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Intersection Observer for triggering animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Stagger the appearance of steps
          const steps = [0, 1, 2, 3, 4, 5];
          steps.forEach((step, index) => {
            setTimeout(() => {
              setVisibleSteps(prev => [...prev, step]);
            }, index * 300);
          });
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-play step highlighting
  useEffect(() => {
    if (visibleSteps.length === 6) {
      const interval = setInterval(() => {
        setActiveStep(prev => {
          const next = prev === null ? 0 : (prev + 1) % 6;
          return next;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [visibleSteps]);

  const steps = [
    {
      id: 1,
      color: 'blue',
      icon: 'fas fa-users',
      title: 'Select Teammate & Mentor',
      description: 'Choose your teammate and preferred mentor, then wait for approval.',
      detail: 'Team & Mentor Selection',
      status: 'Pending approval',
      tags: ['Teammate chosen', 'Mentor requested', 'Awaiting'],
      tagColors: ['blue', 'blue', 'amber']
    },
    {
      id: 2,
      color: 'indigo',
      icon: 'fas fa-paper-plane',
      title: 'Send Project Request with Abstract',
      description: 'Submit your project title and abstract for mentor review.',
      detail: 'Project Request',
      status: 'Include a clear abstract',
      requirements: [
        { label: 'Title', status: 'OK' },
        { label: 'Abstract', status: '300–500 words' }
      ]
    },
    {
      id: 3,
      color: 'amber',
      icon: 'fas fa-thumbs-up',
      title: 'Mentor Approves or Denies',
      description: 'Mentor reviews your request and decides. You\'ll be notified instantly.',
      detail: 'Decision',
      status: 'Approval or changes requested',
      decisions: [
        { label: 'Approved', icon: 'fas fa-check', color: 'green' },
        { label: 'Denied', icon: 'fas fa-times', color: 'rose' }
      ]
    },
    {
      id: 4,
      color: 'violet',
      icon: 'fas fa-file',
      title: 'Submit PPT',
      description: 'Upload your presentation for evaluation.',
      detail: 'PPT Upload',
      status: 'Accepted: .pptx, .pdf',
      uploadType: 'ppt'
    },
    {
      id: 5,
      color: 'cyan',
      icon: 'fas fa-file-alt',
      title: 'Submit Report',
      description: 'Upload your detailed project report for review.',
      detail: 'Report Upload',
      status: 'Accepted: .pdf, .docx',
      uploadType: 'report'
    },
    {
      id: 6,
      color: 'green',
      icon: 'fas fa-check-circle',
      title: 'Final Approval',
      description: 'Receive your final evaluation and approval from the mentor.',
      detail: 'Approval Issued',
      status: 'Certificate unlocks after approval',
      final: true
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: any } = {
      blue: {
        node: 'bg-blue-500',
        border: 'border-blue-500/30',
        gradient: 'from-blue-600/20 to-blue-600/20',
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        hover: 'group-hover:text-blue-300'
      },
      indigo: {
        node: 'bg-indigo-500',
        border: 'border-indigo-500/30',
        gradient: 'from-indigo-600/20 to-indigo-600/20',
        bg: 'bg-indigo-500/20',
        text: 'text-indigo-400',
        hover: 'group-hover:text-indigo-300'
      },
      amber: {
        node: 'bg-amber-500',
        border: 'border-amber-500/30',
        gradient: 'from-amber-600/20 to-amber-600/20',
        bg: 'bg-amber-500/20',
        text: 'text-amber-400',
        hover: 'group-hover:text-amber-300'
      },
      violet: {
        node: 'bg-violet-500',
        border: 'border-violet-500/30',
        gradient: 'from-violet-600/20 to-violet-600/20',
        bg: 'bg-violet-500/20',
        text: 'text-violet-400',
        hover: 'group-hover:text-violet-300'
      },
      cyan: {
        node: 'bg-cyan-500',
        border: 'border-cyan-500/30',
        gradient: 'from-cyan-600/20 to-cyan-600/20',
        bg: 'bg-cyan-500/20',
        text: 'text-cyan-400',
        hover: 'group-hover:text-cyan-300'
      },
      green: {
        node: 'bg-green-500',
        border: 'border-green-500/30',
        gradient: 'from-green-600/20 to-green-600/20',
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        hover: 'group-hover:text-green-300'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div ref={sectionRef} className="relative z-20 py-20 px-8 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute top-3/4 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-float-slower"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl animate-float-fast"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl md:text-5xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Submission Workflow
              </span>
            </h2>
          </div>
          <div className={`transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our streamlined process ensures efficient project submissions and reviews.
            </p>
          </div>
        </div>
        
        <div className="relative">
          {/* Animated Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-700 transform -translate-x-1/2 hidden md:block">
            <div 
              className="w-full bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 transition-all duration-2000 ease-out"
              style={{ height: visibleSteps.length > 0 ? `${(visibleSteps.length / 6) * 100}%` : '0%' }}
            ></div>
          </div>
          
          {/* Flowing particles on timeline */}
          {isInView && (
            <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 hidden md:block">
              <div className="particle-flow"></div>
              <div className="particle-flow particle-flow-2"></div>
              <div className="particle-flow particle-flow-3"></div>
            </div>
          )}

          <div className="space-y-24 relative">
            {steps.map((step, index) => {
              const colors = getColorClasses(step.color);
              const isVisible = visibleSteps.includes(index);
              const isActive = activeStep === index;
              const isLeft = index % 2 === 0;

              return (
                <div 
                  key={step.id}
                  ref={el => stepsRef.current[index] = el}
                  className={`relative grid md:grid-cols-2 gap-8 items-center transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Content */}
                  <div className={`space-y-4 ${isLeft ? 'md:text-right md:order-1' : 'md:order-2'}`}>
                    <div className={`inline-block px-4 py-1 rounded-full bg-${step.color}-500/20 text-${step.color}-400 text-sm font-medium transition-all duration-500 ${
                      isActive ? 'scale-110 shadow-lg' : ''
                    }`}>
                      Step {step.id.toString().padStart(2, '0')}
                    </div>
                    <h3 className={`text-2xl font-bold text-white transition-all duration-500 ${
                      isActive ? 'text-glow' : ''
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                  
                  {/* Card */}
                  <div className={`relative ${isLeft ? 'md:order-2' : 'md:order-1'}`}>
                    {/* Timeline Node */}
                    <div className={`absolute ${isLeft ? 'left-0' : 'right-0'} top-1/2 w-8 h-8 ${colors.node} rounded-full transform ${
                      isLeft ? '-translate-x-1/2' : 'translate-x-1/2'
                    } -translate-y-1/2 hidden md:flex items-center justify-center z-10 transition-all duration-500 ${
                      isActive ? 'scale-125 shadow-lg shadow-current animate-pulse-ring' : ''
                    }`}>
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                    
                    {/* Connecting pulse effect */}
                    {isActive && (
                      <div className={`absolute ${isLeft ? 'left-0' : 'right-0'} top-1/2 transform ${
                        isLeft ? '-translate-x-1/2' : 'translate-x-1/2'
                      } -translate-y-1/2 hidden md:block`}>
                        <div className="pulse-ring-workflow opacity-60"></div>
                        <div className="pulse-ring-workflow-2 opacity-40"></div>
                      </div>
                    )}
                    
                    <div className={`group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border ${colors.border} transition-all duration-500 hover:shadow-xl hover:shadow-current/20 ${
                      isActive ? `scale-105 shadow-lg shadow-current/30 bg-gradient-to-br from-gray-700 to-gray-800` : ''
                    }`}>
                      {/* Animated border glow */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-current to-transparent opacity-20 animate-border-glow"></div>
                      )}
                      
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center transition-all duration-300 ${
                          isActive ? 'animate-bounce-subtle' : ''
                        }`}>
                          <i className={`${step.icon} ${colors.text} transition-all duration-300 ${
                            isActive ? 'scale-110' : ''
                          }`}></i>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{step.detail}</h4>
                          <p className="text-gray-400 text-sm">{step.status}</p>
                        </div>
                      </div>
                      
                      {/* Step-specific content with animations */}
                      {step.tags && (
                        <div className="flex items-center gap-2 text-xs flex-wrap">
                          {step.tags.map((tag, tagIndex) => (
                            <span 
                              key={tag}
                              className={`px-2 py-1 rounded-full bg-${step.tagColors![tagIndex]}-500/10 text-${step.tagColors![tagIndex]}-300 transition-all duration-300 ${
                                isActive ? 'animate-tag-glow' : ''
                              }`}
                              style={{ animationDelay: `${tagIndex * 100}ms` }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {step.requirements && (
                        <div className="space-y-2 text-xs text-gray-400">
                          {step.requirements.map((req, reqIndex) => (
                            <div 
                              key={req.label}
                              className={`flex items-center justify-between transition-all duration-300 ${
                                isActive ? 'animate-slide-in-right' : ''
                              }`}
                              style={{ animationDelay: `${reqIndex * 150}ms` }}
                            >
                              <span>{req.label}</span>
                              <span className="text-gray-300">{req.status}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {step.decisions && (
                        <div className="flex gap-2 text-xs">
                          {step.decisions.map((decision, decIndex) => (
                            <span 
                              key={decision.label}
                              className={`px-2 py-1 rounded-full bg-${decision.color}-500/10 text-${decision.color}-300 transition-all duration-300 ${
                                isActive ? 'animate-decision-pulse' : ''
                              }`}
                              style={{ animationDelay: `${decIndex * 200}ms` }}
                            >
                              <i className={`${decision.icon} mr-1`}></i>
                              {decision.label}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {step.uploadType && (
                        <div className={`border border-dashed border-gray-600 rounded-lg p-4 mt-3 text-center transition-all duration-500 ${
                          isActive ? 'border-current/50 bg-current/5' : ''
                        }`}>
                          <i className={`fas fa-cloud-upload-alt text-2xl text-gray-500 mb-2 transition-all duration-300 ${
                            isActive ? 'animate-upload-bounce' : ''
                          }`}></i>
                          <p className="text-sm text-gray-400">
                            Drag and drop your {step.uploadType === 'ppt' ? 'PPT' : 'report'} here
                          </p>
                          <button className={`mt-2 px-4 py-1 bg-${step.color}-500/20 text-${step.color}-400 text-sm rounded-full transition-all duration-300 hover:bg-${step.color}-500/30 ${
                            isActive ? 'animate-button-pulse' : ''
                          }`}>
                            Browse Files
                          </button>
                        </div>
                      )}
                      
                      {step.final && (
                        <div className={`flex items-center gap-3 text-green-300 text-sm transition-all duration-500 ${
                          isActive ? 'animate-final-glow' : ''
                        }`}>
                          <i className="fas fa-badge-check"></i>
                          <span>All requirements satisfied</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(360deg); }
        }
        
        @keyframes pulse-ring-workflow {
          0% { transform: scale(0.8); opacity: 0.6; }
          80% { transform: scale(2); opacity: 0; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes border-glow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes tag-glow {
          0%, 100% { box-shadow: 0 0 5px currentColor; }
          50% { box-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
        }
        
        @keyframes slide-in-right {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes decision-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes upload-bounce {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-3px); }
          75% { transform: translateY(3px); }
        }
        
        @keyframes button-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(59, 130, 246, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
        }
        
        @keyframes final-glow {
          0%, 100% { filter: drop-shadow(0 0 5px currentColor); }
          50% { filter: drop-shadow(0 0 15px currentColor) drop-shadow(0 0 25px currentColor); }
        }
        
        @keyframes particle-flow {
          0% { transform: translateY(-20px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(calc(100vh + 20px)); opacity: 0; }
        }
        
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 8s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        .animate-pulse-ring { animation: pulse-ring-workflow 2s infinite; }
        .animate-border-glow { animation: border-glow 2s linear infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 2s infinite; }
        .animate-tag-glow { animation: tag-glow 2s infinite; }
        .animate-slide-in-right { animation: slide-in-right 0.5s ease-out forwards; }
        .animate-decision-pulse { animation: decision-pulse 2s infinite; }
        .animate-upload-bounce { animation: upload-bounce 2s infinite; }
        .animate-button-pulse { animation: button-pulse 2s infinite; }
        .animate-final-glow { animation: final-glow 3s infinite; }
        
        .pulse-ring-workflow {
          position: absolute;
          inset: 0;
          border: 2px solid currentColor;
          border-radius: 9999px;
          animation: pulse-ring-workflow 2s ease-out infinite;
        }
        
        .pulse-ring-workflow-2 {
          position: absolute;
          inset: 0;
          border: 2px solid currentColor;
          border-radius: 9999px;
          animation: pulse-ring-workflow 2s ease-out infinite;
          animation-delay: 1s;
        }
        
        .particle-flow {
          position: absolute;
          width: 4px;
          height: 4px;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #10b981);
          border-radius: 50%;
          left: -2px;
          animation: particle-flow 8s linear infinite;
        }
        
        .particle-flow-2 {
          animation-delay: -2s;
          background: linear-gradient(45deg, #8b5cf6, #10b981, #3b82f6);
        }
        
        .particle-flow-3 {
          animation-delay: -4s;
          background: linear-gradient(45deg, #10b981, #3b82f6, #8b5cf6);
        }
        
        .text-glow {
          text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
        }
      `}</style>
    </div>
  );
};

export default EnhancedWorkflowSection;