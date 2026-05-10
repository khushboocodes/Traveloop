import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, MapPin, Camera, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useApp();
  const fileInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '', city: '',
    password: '', password_confirm: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, avatarPreview: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const newErrors = {};

    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email required';
    if (!formData.password || formData.password.length < 8) newErrors.password = 'At least 8 characters required';
    if (formData.password !== formData.password_confirm) newErrors.password_confirm = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const username = formData.email.split('@')[0] + '_' + Date.now();
      await register({
        username,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.password_confirm,
        first_name: formData.first_name,
        last_name: formData.last_name,
        city: formData.city,
        phone: formData.phone,
      });
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = error.response?.data?.email?.[0] ||
                       error.response?.data?.username?.[0] ||
                       error.response?.data?.detail ||
                       'Registration failed. Please try again.';
      setApiError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8 w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500">Start planning your dream adventures</p>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-teal-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                {formData.avatarPreview ? <img src={formData.avatarPreview} alt="Preview" className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-indigo-400" />}
              </div>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full flex items-center justify-center text-white shadow-md">
                <Camera className="w-4 h-4" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Upload a profile photo</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
              <input type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${errors.first_name ? 'border-red-300' : ''}`} placeholder="John" />
              {errors.first_name && <p className="text-sm text-red-500 mt-1">{errors.first_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
              <input type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="Doe" />
              {errors.last_name && <p className="text-sm text-red-500 mt-1">{errors.last_name}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${errors.email ? 'border-red-300' : ''}`} placeholder="john@example.com" />
            </div>
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="+1 234 567 890" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="New York" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={`w-full px-4 py-3 pl-12 pr-12 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${errors.password ? 'border-red-300' : ''}`} placeholder="Create a password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="password" value={formData.password_confirm}
                onChange={(e) => setFormData({...formData, password_confirm: e.target.value})}
                className={`w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${errors.password_confirm ? 'border-red-300' : ''}`} placeholder="Confirm your password" />
            </div>
            {errors.password_confirm && <p className="text-sm text-red-500 mt-1">{errors.password_confirm}</p>}
          </div>

          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? (
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            ) : (
              <>Create Account <ArrowRight className="w-5 h-5" /></>
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">Already have an account? <Link to="/login" className="text-indigo-500 hover:text-indigo-600 font-semibold">Sign in</Link></p>
        </div>
      </motion.div>
    </div>
  );
}