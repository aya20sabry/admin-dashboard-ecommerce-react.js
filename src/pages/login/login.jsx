// src/pages/login/Login.jsx
import React from "react";
import { motion } from "framer-motion";
import { useLoginViewModel } from "../../viewmodels-state/useLoginViewModel";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";

const Login = () => {
  const { email, password, setEmail, setPassword, handleLogin, isLoading } =
    useLoginViewModel();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full max-w-[90%] xs:max-w-md sm:max-w-lg bg-gray-900/60 backdrop-blur-lg border border-gray-700 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 text-white"
      >
        {/* Logo Section */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Lock className="w-8 h-8 sm:w-10 sm:h-10" aria-hidden="true" />
          </div>
        </div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-center mb-2 sm:mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Welcome Back
        </motion.h1>
        <p className="text-center text-gray-400 text-sm sm:text-base mb-6 sm:mb-8">
          Sign in to access your dashboard
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
                aria-hidden="true"
              />
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-xl px-10 sm:px-12 py-3 sm:py-3.5 text-base sm:text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition tap-highlight-transparent touch-manipulation"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                aria-required="true"
                aria-label="Email address"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
                aria-hidden="true"
              />
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-xl px-10 sm:px-12 py-3 sm:py-3.5 text-base sm:text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition tap-highlight-transparent touch-manipulation pr-12 sm:pr-14"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                aria-required="true"
                aria-label="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded p-1 tap-highlight-transparent touch-manipulation min-h-touch min-w-touch flex items-center justify-center"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={20} aria-hidden="true" />
                ) : (
                  <Eye size={20} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-2">
            <label className="flex items-center gap-2 cursor-pointer tap-highlight-transparent">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 tap-highlight-transparent touch-manipulation"
                aria-label="Remember me"
              />
              <span className="text-sm text-gray-300">Remember me</span>
            </label>
            <a
              href="#"
              className="text-sm text-blue-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded tap-highlight-transparent touch-manipulation inline-flex items-center min-h-touch"
              onClick={(e) => e.preventDefault()}
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white text-base sm:text-lg font-semibold py-3 sm:py-3.5 rounded-xl shadow-lg transition min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900"
            aria-label="Sign in to your account"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Signing in...</span>
              </span>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="relative my-6 sm:my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-900/60 text-gray-400">
              Need help?
            </span>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded tap-highlight-transparent touch-manipulation inline-block"
              onClick={(e) => e.preventDefault()}
            >
              Contact Admin
            </a>
          </p>
          <p className="text-xs text-gray-500">
            Protected by enterprise-grade security
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
