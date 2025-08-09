    import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

// --- ENHANCEMENT: Added CSS for animations ---
const GlobalStyles = () => (
  <style>{`
    @keyframes animated-gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .gradient-animated {
      background-size: 200% 200%;
      animation: animated-gradient 3s ease infinite;
    }
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .fade-in-up-start {
      opacity: 0;
    }
    .fade-in-up-active {
      animation: fade-in-up 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
  `}</style>
);

function Login({ onLogin }) {
  const [registerNumber, setRegisterNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const navigate = useNavigate();
  const logoutTimerRef = useRef(null);
  const floatingElements = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, []);

  // Floating animation for background elements (desktop only)
  useEffect(() => {
    if (isMobile || !floatingElements.current) return;
    let animationId;
    const animateElements = () => {
      const elements = floatingElements.current.querySelectorAll('.floating');
      elements.forEach((el, index) => {
        const speed = 1 + (index * 0.2);
        const angle = (Date.now() * 0.0003 * speed) % (Math.PI * 2);
        const x = Math.sin(angle) * (10 + index * 0.5);
        const y = Math.cos(angle) * (5 + index * 0.5);
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      animationId = requestAnimationFrame(animateElements);
    };
    animationId = requestAnimationFrame(animateElements);
    return () => cancelAnimationFrame(animationId);
  }, [isMobile]);

  const handleAutoLogout = () => {
    Object.keys(Cookies.get()).forEach(cookieName => Cookies.remove(cookieName));
    navigate("/login");
    if (typeof onLogin === "function") onLogin(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!registerNumber || !password) {
      setError("Please enter both registration number and password");
      return;
    }

    setShowVerification(true);
    setVerificationProgress(0);
    setLoading(true);
    setError("");

    const verificationInterval = setInterval(() => {
      setVerificationProgress(prev => (prev >= 100 ? 100 : prev + 10));
    }, 100);

    try {
      const response = await fetch("http://localhost:3000/api/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          register_number: registerNumber,
          password: password,
        }),
      });

      clearInterval(verificationInterval);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");

      const cookieOptions = {
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: "Strict",
      };

      Cookies.set("token", data.token, cookieOptions);
      const decodedToken = jwtDecode(data.token);
      Cookies.set("studentId", decodedToken.userId, cookieOptions);
      Cookies.set("regNumber", registerNumber, cookieOptions);
      Cookies.set("studentName", decodedToken.name, cookieOptions);
      Cookies.set("role", decodedToken.role, cookieOptions);
      
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = setTimeout(handleAutoLogout, 24 * 60 * 60 * 1000); // 24-hour auto-logout

      setTimeout(() => {
        onLogin("student");
        navigate("/");
      }, 500);
    } catch (err) {
      setError(err.message);
      setShowVerification(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 overflow-hidden">
      <GlobalStyles />
      
      {!isMobile && (
        <div ref={floatingElements} className="absolute inset-0 overflow-hidden z-0">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="absolute floating" style={{
              background: `rgba(99, 102, 241, ${0.05 + Math.random() * 0.05})`,
              width: `${20 + (i * 3)}px`, height: `${20 + (i * 3)}px`,
              borderRadius: '50%', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              filter: 'blur(2px)',
            }} />
          ))}
        </div>
      )}

      {/* Branding Section */}
      <div className="md:w-1/2 bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden py-12 px-6 md:py-0">
        <div className={`relative z-10 text-white text-center max-w-md mx-auto ${isMounted ? 'fade-in-up-active' : 'fade-in-up-start'}`}>
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-white bg-opacity-10 rounded-full p-2 backdrop-blur-sm border border-white border-opacity-20 shadow-lg">
              <img
                src="https://www.sathyabama.ac.in/sites/default/files/inline-images/NewRGB_0.jpg"
                alt="Sathyabama Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3">Sathyabama</h1>
          <h2 className="text-2xl font-semibold mb-2">Institute of Science & Technology</h2>
          <p className="text-blue-200 mb-6">(Deemed to be University)</p>
          <div className="bg-white bg-opacity-10 p-4 rounded-xl backdrop-blur-sm border border-white border-opacity-20">
            <h3 className="text-xl font-medium mb-1">School of Computing</h3>
            <p className="text-blue-100">Student Portal</p>
          </div>
          {!isMobile && (
            <div className="mt-8 text-blue-200 text-sm">
              <p>Empowering through Education, Research & Innovation</p>
            </div>
          )}
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex-grow md:w-1/2 flex items-center justify-center p-6 relative">
        {/* --- ENHANCEMENT: Added animated aurora background for the card --- */}
        {!isMobile && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-0 -left-1/4 w-96 h-96 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-50 blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-tl from-purple-100 to-transparent rounded-full opacity-50 blur-3xl animate-pulse [animation-delay:-4s]" />
          </div>
        )}
        
        {/* --- ENHANCEMENT: Applied glassmorphism effect to the card --- */}
        <div className={`w-full max-w-md bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl p-8 z-10 ${isMounted ? 'fade-in-up-active delay-1' : 'fade-in-up-start'}`}>
          <div className="text-center md:text-left mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Student Login</h3>
            <p className="text-gray-500 mt-1">Enter your credentials to continue</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Register Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={registerNumber}
                  onChange={(e) => setRegisterNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/80 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  disabled={loading}
                  placeholder="e.g., 41110001"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/80 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  disabled={loading}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-blue-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zM14.58 14.58l-2.088-2.088a2.98 2.98 0 01-3.33-3.33L7.073 7.073A5.003 5.003 0 0110 5c4.478 0 8.268 2.943 9.542 5a10.014 10.014 0 01-4.962 4.58zM.458 10a10.014 10.014 0 014.962-4.58L3.707 2.293A1 1 0 002.293 3.707l1.473 1.473A9.958 9.958 0 00.458 10c1.274 4.057 5.022 7 9.542 7a9.958 9.958 0 003.512-1.074l1.78 1.781a1 1 0 101.414-1.414L5.42 5.42A5.003 5.003 0 0010 15c-4.478 0-8.268-2.943-9.542-5z" clipRule="evenodd" /></svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-100/50 border border-red-200 text-red-700 rounded-lg flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {error}
              </div>
            )}

            {showVerification && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Verifying credentials...</p>
                <div className="w-full bg-gray-200/70 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-300 gradient-animated" style={{ width: `${verificationProgress}%` }}></div>
                </div>
              </div>
            )}

            <button type="submit" className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"} shadow-md hover:shadow-lg active:scale-95`} disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center"><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Signing in...</span>
              ) : ( "Sign In" )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <a href="#forgot-password" className="text-blue-600 hover:text-blue-800 hover:underline">Forgot password?</a>
            <p className="text-gray-500 mt-4">© {new Date().getFullYear()} Sathyabama Institute of Science & Technology</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;