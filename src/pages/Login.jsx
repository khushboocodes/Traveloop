import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import logo from '../assets/logo.png';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useApp();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError('');

    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setApiError(
        error.response?.data?.detail ||
          'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8 w-full max-w-md mx-auto">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

        {/* LOGO */}
        <div className="text-center mb-8">

          <div className="flex items-center justify-center gap-3 mb-6">

            <img
              src={logo}
              alt="Traveloop"
              className="w-16 h-16 object-contain"
            />

            <h1 className="text-5xl font-bold text-cyan-500">
              Traveloop
            </h1>

          </div>

          

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>

          <p className="text-gray-500">
            Sign in to continue your travel journey
          </p>

        </div>

        {/* ERROR */}
        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {apiError}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>

            <div className="relative">

              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                placeholder="Enter your email"
                className={`w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-300' : ''
                }`}
              />

            </div>

            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email}
              </p>
            )}

          </div>

          {/* PASSWORD */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>

            <div className="relative">

              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                placeholder="Enter your password"
                className={`w-full px-4 py-3 pl-12 pr-12 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-300' : ''
                }`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>

            </div>

            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password}
              </p>
            )}

          </div>

          {/* OPTIONS */}
          <div className="flex items-center justify-between">

            <label className="flex items-center gap-2 cursor-pointer">

              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-cyan-500"
              />

              <span className="text-sm text-gray-600">
                Remember me
              </span>

            </label>

            <Link
              to="/forgot-password"
              className="text-sm text-cyan-500 hover:text-cyan-600 font-medium"
            >
              Forgot password?
            </Link>

          </div>

          {/* BUTTON */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-6 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >

            {loading ? (
              <svg
                className="animate-spin w-5 h-5"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />

                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5" />
              </>
            )}

          </motion.button>

        </form>

        {/* SIGNUP */}
        <div className="mt-8 text-center">

          <p className="text-gray-500 text-sm">

            Don't have an account?{' '}

            <Link
              to="/signup"
              className="text-cyan-500 hover:text-cyan-600 font-semibold"
            >
              Create one
            </Link>

          </p>

        </div>

      </motion.div>

    </div>
  );
}