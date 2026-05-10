import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Map, CalendarDays, Users, Package, StickyNote, User, Settings, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/my-trips', icon: Map, label: 'My Trips' },
  { path: '/create-trip', icon: CalendarDays, label: 'Create Trip' },
  { path: '/city-search', icon: Map, label: 'Discover Cities' },
  { path: '/activity-search', icon: CalendarDays, label: 'Discover Activities' },
  { path: '/community', icon: Users, label: 'Community' },
  { path: '/packing', icon: Package, label: 'Packing' },
  { path: '/notes', icon: StickyNote, label: 'Notes' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/admin', icon: Settings, label: 'Admin' }
];

export default function MobileMenu() {
  const { state, dispatch } = useApp();

  return (
    <AnimatePresence>
      {state.mobileMenuOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => dispatch({ type: 'CLOSE_MOBILE_MENU' })}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-72 bg-white shadow-soft-lg z-50 lg:hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
                <span className="text-xl font-bold text-gradient">Traveloop</span>
              </div>
              <button onClick={() => dispatch({ type: 'CLOSE_MOBILE_MENU' })} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <NavLink key={item.path} to={item.path} onClick={() => dispatch({ type: 'CLOSE_MOBILE_MENU' })}
                  className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-gradient-primary text-white' : 'hover:bg-gray-50 text-gray-700'}`}>
                  <item.icon className="w-5 h-5" /><span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
