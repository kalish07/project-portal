import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "./api/AdminApi"; // Adjust the import path as necessary

const backgroundImageUrl = "https://www.sathyabama.ac.in/sites/default/files/2020-01/ADMIN%20-%202.jpg";

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await adminLogin({ email, password });
      onLogin(); // call parent-level login handler
      navigate("/admin"); // navigate to admin dashboard
    } catch (err) {
      setErrorMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        aria-hidden="true"
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/70 via-black/60 to-emerald-900/50" aria-hidden="true"></div>
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center md:items-stretch min-h-[80vh] gap-10">
          {/* Branding/Logo for mobile */}
          <div className="md:hidden flex flex-col items-center mt-6 mb-2">
            <div className="bg-white/80 rounded-full p-3 shadow-lg mb-2">
              <img
                src="https://www.sathyabama.ac.in/sites/default/files/inline-images/NewRGB_0.jpg"
                alt="Sathyabama University Logo"
                className="h-14 w-14 object-contain"
              />
            </div>
            {/* Modern mobile header */}
            <span className="text-3xl font-extrabold text-white drop-shadow mb-1 tracking-tight">
              Sathyabama University
            </span>
            <span className="text-pink-200 font-semibold text-lg mb-1 tracking-wide">
              School of Computing
            </span>
            <span className="text-xs text-white/80 text-center px-4 mb-1 font-medium tracking-wide">
              Admin Portal
            </span>
            <div className="flex gap-2 mt-1">
              <span className="bg-pink-600/90 text-white text-xs px-3 py-1 rounded-full font-semibold shadow uppercase tracking-wide">
                Secure
              </span>
              <span className="bg-blue-600/90 text-white text-xs px-3 py-1 rounded-full font-semibold shadow uppercase tracking-wide">
                Fast
              </span>
              <span className="bg-green-600/90 text-white text-xs px-3 py-1 rounded-full font-semibold shadow uppercase tracking-wide">
                Reliable
              </span>
            </div>
          </div>
          {/* Branding/Logo for desktop */}
          <div className="hidden md:flex flex-col justify-center items-start px-12 w-1/2">
            <img
              src="https://www.sathyabama.ac.in/sites/default/files/inline-images/NewRGB_0.jpg"
              alt="Sathyabama University Logo"
              className="h-16 w-auto mb-4 drop-shadow-xl"
            />
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-2">
              Sathyabama Institute of Science and Technology
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-pink-200 mb-2 drop-shadow">
              School of Computing – Admin Portal
            </h2>
            <p className="text-white/80 text-base md:text-lg max-w-md mb-2">
              Manage all your School of Computing administrative tasks in one place. From user management to academic tracking, streamline your workflow with secure and efficient tools designed for administrators.
            </p>
            <p className="text-pink-300 text-sm md:text-base mt-2">
              Reliable. Secure. Made for the School of Computing.
            </p>
          </div>
          {/* Divider for desktop */}
          <div className="hidden md:block w-px bg-white/20 mx-2 my-10 rounded-full transition-colors"></div>
          {/* Right column: Card */}
          <div className="w-full md:w-1/2 flex items-center justify-center mt-2 md:mt-0">
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 md:p-10 max-w-md w-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.4)] transition-shadow duration-300
              -translate-y-4 md:translate-y-0">
              <div className="flex justify-center mb-6">
                <div className="bg-white w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-md border border-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 md:h-10 md:w-10 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 12c2.28 0 4.148-1.82 4.148-4.06 0-2.24-1.868-4.06-4.148-4.06S7.852 5.7 7.852 7.94C7.852 10.18 9.72 12 12 12z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 20v-1.4c0-2.24 3.2-4.06 8-4.06s8 1.82 8 4.06V20M16 8l2 2 4-4"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">Admin Login</h2>
              <p className="text-base text-purple-700 text-center mb-2 font-semibold hidden md:block">School of Computing</p>
              <p className="text-base text-gray-500 text-center mb-4 hidden md:block">Access the Academic Administration Portal</p>
              <p className="text-xs text-gray-400 text-center mb-8 hidden md:block">Secure, fast, and reliable access to your admin tools</p>
              {errorMsg && (
                <div
                  className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded-lg text-sm font-medium shadow-sm text-center mb-4"
                  aria-live="polite"
                >
                  {errorMsg}
                </div>
              )}
              <form onSubmit={handleSubmit} autoComplete="on">
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  type="email"
                  className="bg-white border border-gray-300 rounded-xl px-4 py-2.5 md:py-3 w-full mb-5 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email"
                  placeholder="Enter your email"
                  autoComplete="username"
                />
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative mb-5">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="bg-white border border-gray-300 rounded-xl px-4 py-2.5 md:py-3 w-full pr-12 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-label="Password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 focus:outline-none"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19.5c-5.523 0-10-4.477-10-10a9.96 9.96 0 013.075-7.125M9.88 9.88a3 3 0 014.24 4.24M15 15l5.25 5.25M3 3l18 18" />
                    </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between mb-5">
                  <button
                    type="button"
                    className="text-xs text-purple-600 hover:underline focus:outline-none"
                    onClick={() => alert("Password reset flow coming soon!")}
                  >
                    Forgot Password?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white w-full py-2.5 md:py-3 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Logging in...
                    </span>
                  ) : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <footer className="absolute bottom-2 left-0 right-0 text-center text-xs text-white/60 select-none">
        &copy; {new Date().getFullYear()} Sathyabama University  
      </footer>
    </div>
  );
};

export default AdminLogin;