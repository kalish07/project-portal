import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mentorLogin } from "../api/mentorApi";

const MentorLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await mentorLogin({ email, password });
      onLogin();
      navigate("/mentor");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div
        className="min-h-screen w-full flex flex-col justify-center md:grid md:grid-cols-2"
        style={{
          fontFamily: "'Inter', sans-serif",
          backgroundImage:
            'linear-gradient(0deg,rgba(34,34,34,0.7),rgba(34,34,34,0.7)),url("https://www.sathyabama.ac.in/sites/default/files/inline-images/DJI_0105-New-Low.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Desktop Branding/Description Section */}
        <div className="hidden md:flex flex-col justify-center items-start pl-20 pr-10 py-10 min-h-screen">
          <img
            src="https://www.sathyabama.ac.in/sites/default/files/inline-images/NewRGB_0.jpg"
            alt="Sathyabama University Logo"
            className="h-20 w-auto mb-6 drop-shadow-xl"
          />
          <h2 className="text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg">
            Sathyabama University
          </h2>
          <p className="text-2xl text-pink-200 font-bold mb-2 tracking-wide drop-shadow">
            School of Computing
          </p>
          <p className="text-xl text-pink-100 font-bold mb-4 tracking-wide drop-shadow">
            Mentor Portal
          </p>
          <p className="text-lg text-white/90 mb-6 leading-relaxed font-medium drop-shadow">
            Empowering mentors to{" "}
            <span className="text-pink-300 font-semibold">guide</span>,{" "}
            <span className="text-blue-300 font-semibold">manage</span>, and{" "}
            <span className="text-green-300 font-semibold">inspire</span> students.
            <br />
            Seamlessly track progress, collaborate with teams, and foster innovation in the{" "}
            <span className="text-pink-200 font-semibold">School of Computing</span>.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="bg-pink-600/90 text-white text-sm px-4 py-1 rounded-full font-semibold shadow-lg uppercase tracking-wide">
              Secure
            </span>
            <span className="bg-blue-600/90 text-white text-sm px-4 py-1 rounded-full font-semibold shadow-lg uppercase tracking-wide">
              Collaborative
            </span>
            <span className="bg-green-600/90 text-white text-sm px-4 py-1 rounded-full font-semibold shadow-lg uppercase tracking-wide">
              Efficient
            </span>
          </div>
        </div>

        {/* Mobile Branding */}
        <div className="md:hidden flex flex-col items-center pt-6 pb-0 px-4">
          <div className="relative">
            <div className="bg-gradient-to-br from-white/90 to-white/70 rounded-full p-3 shadow-xl mb-1 ring-2 ring-white/30">
              <img
                src="https://www.sathyabama.ac.in/sites/default/files/inline-images/NewRGB_0.jpg"
                alt="Sathyabama University Logo"
                className="h-14 w-14 object-contain"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full animate-pulse"></div>
          </div>
          <div className="text-center space-y-0.5">
            <h1 className="text-2xl font-black text-white drop-shadow-lg tracking-tight">
              Sathyabama University
            </h1>
            <div className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              <p className="font-bold text-lg">
                School of Computing
              </p>
            </div>
            <p className="text-sm text-white/90 font-medium tracking-wide">
              Mentor Portal
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg transform hover:scale-105 transition-transform">
              Secure
            </span>
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg transform hover:scale-105 transition-transform">
              Collaborative
            </span>
            <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg transform hover:scale-105 transition-transform">
              Efficient
            </span>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="flex flex-1 items-center justify-center px-4 -mt-2">
          <div
            className={`relative w-full max-w-sm mx-auto rounded-3xl shadow-2xl bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-3xl border border-white/30 px-6 py-8 md:px-8 md:py-10
              transition-all duration-700 hover:shadow-3xl hover:scale-[1.02]
              ${loaded ? "opacity-100 translate-y-0 animate-fadein" : "opacity-0 translate-y-8"}
              before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none
            `}
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {errorMsg && (
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 mb-4 rounded-xl text-center font-semibold shadow-lg border border-red-400/30 animate-shake">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-white font-semibold text-sm"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 py-3.5 px-4 font-medium focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white/30 focus:border-pink-400/50 transition-all duration-300 hover:bg-white/25"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400/10 to-purple-400/10 pointer-events-none"></div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-white font-semibold text-sm"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 py-3.5 px-4 pr-12 font-medium focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white/30 focus:border-pink-400/50 transition-all duration-300 hover:bg-white/25"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400/10 to-purple-400/10 pointer-events-none"></div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-pink-300 focus:outline-none transition-colors z-10"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19.5c-5.523 0-10-4.477-10-10a9.96 9.96 0 013.075-7.125M9.88 9.88a3 3 0 014.24 4.24M15 15l5.25 5.25M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-white font-medium cursor-pointer select-none group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="form-checkbox h-4 w-4 text-pink-500 transition mr-3 rounded focus:ring-2 focus:ring-pink-400"
                      aria-checked={rememberMe}
                    />

                  </div>
                  <span className="group-hover:text-pink-200 transition-colors">Remember Me</span>
                </label>
                <button
                  type="button"
                  className="text-pink-200 hover:text-pink-300 text-sm font-medium focus:outline-none transition-colors"
                  tabIndex={0}
                  onClick={() => alert("Password reset flow coming soon!")}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-pink-400/50"
                disabled={loading}
              >
                <div className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <span>Login to Portal</span>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>

        {/* Footer: below card on mobile, fixed bottom on desktop */}
        <div className="w-full md:hidden flex justify-center py-3">
          <footer className="text-center text-white/80 text-xs font-medium select-none drop-shadow-lg bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
            <div className="flex items-center justify-center gap-1">
              <span>© {new Date().getFullYear()}</span>
              <span className="text-pink-300">Sathyabama University</span>
              <span>•</span>
              <span className="text-purple-300">School of Computing</span>
            </div>
          </footer>
        </div>
        <footer className="hidden md:block absolute bottom-2 left-0 right-0 text-center text-gray-200 text-xs opacity-80 select-none drop-shadow">
          &copy; {new Date().getFullYear()} Sathyabama University Mentor Portal |{" "}
          <span className="text-pink-200">School of Computing</span>
        </footer>
        <style>{`
          @keyframes fadein {
            from { opacity: 0; transform: translateY(24px);}
            to { opacity: 1; transform: translateY(0);}
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
          }
          .animate-fadein {
            animation: fadein 0.8s cubic-bezier(.4,0,.2,1);
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .form-checkbox {
            appearance: none;
            background-color: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            position: relative;
          }
          .form-checkbox:checked {
            background-color: #ec4899;
            border-color: #ec4899;
          }
          .form-checkbox:checked::after {
            content: '';
            position: absolute;
            top: 1px;
            left: 3px;
            width: 6px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }
          .form-checkbox:focus {
            outline: 2px solid #ec4899;
            outline-offset: 2px;
          }
          ::selection {
            background: #f9a8d4;
            color: #232526;
          }
          .hover\\:scale-\\[1\\.02\\]:hover {
            transform: scale(1.02);
          }
          .active\\:scale-\\[0\\.98\\]:active {
            transform: scale(0.98);
          }
          .shadow-3xl {
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
          }
          @media (max-width: 767px) {
            .md\\:grid-cols-2 > *:not(:first-child) {
              margin-top: 0 !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default MentorLogin;