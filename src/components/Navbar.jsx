import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Menu, X, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { state, dispatch, getUnreadNotifications } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const unreadCount = getUnreadNotifications();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/city-search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 bg-gradient-primary rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          </div>
          <span className="text-xl font-bold text-gradient hidden sm:block">Traveloop</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search destinations, activities..."
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm" />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/city-search')} className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          <div className="relative">
            <button onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }} className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">{unreadCount}</span>}
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-soft-lg border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Notifications</h3></div>
                  <div className="max-h-80 overflow-y-auto">
                    {state.notifications.map(notif => (
                      <div key={notif.id} onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notif.id })}
                        className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 ${!notif.read ? 'bg-primary-50/30' : ''}`}>
                        <p className="text-sm text-gray-700">{notif.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }} className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl transition-colors">
              <img src={state.user.avatar} alt={state.user.firstName} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" />
              <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
            </button>
            <AnimatePresence>
              {showProfile && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{state.user.firstName} {state.user.lastName}</p>
                    <p className="text-sm text-gray-500">{state.user.email}</p>
                  </div>
                  <div className="p-2">
                    <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors"><User className="w-4 h-4 text-gray-500" /><span className="text-sm text-gray-700">Profile</span></Link>
                    <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors"><Settings className="w-4 h-4 text-gray-500" /><span className="text-sm text-gray-700">Admin</span></Link>
                    <button onClick={() => navigate('/login')} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-xl transition-colors text-left">
                      <LogOut className="w-4 h-4 text-red-500" /><span className="text-sm text-red-600">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors">
            {state.mobileMenuOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
