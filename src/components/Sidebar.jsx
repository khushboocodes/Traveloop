import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Map, CalendarDays, Users, Package, StickyNote, User, ChevronLeft, Globe, Shield, BarChart3, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/my-trips', icon: Map, label: 'My Trips' },
  { path: '/create-trip', icon: CalendarDays, label: 'Create Trip' },
  { path: '/community', icon: Users, label: 'Community' },
  { path: '/packing', icon: Package, label: 'Packing' },
  { path: '/notes', icon: StickyNote, label: 'Notes' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const adminNavItems = [
  { path: '/admin', icon: Shield, label: 'Admin Panel' },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const isAdmin = state.user?.is_admin;

  return (
    <>
      <aside className={`fixed top-16 left-0 bottom-0 bg-white border-r border-gray-100 z-40 transition-all duration-300 hidden lg:block ${state.sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          <button onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            className={`absolute -right-3 top-8 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors ${state.sidebarOpen ? '' : 'rotate-180'}`}>
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>

          <nav className="flex-1 py-4 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-md' : 'hover:bg-gray-50 text-gray-600'} ${state.sidebarOpen ? '' : 'justify-center'}`}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {state.sidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium whitespace-nowrap">{item.label}</motion.span>}
              </NavLink>
            ))}

            {/* Admin Section - Only visible to admins */}
            {isAdmin && (
              <>
                <div className={`py-2 ${state.sidebarOpen ? 'px-3' : 'px-2'}`}>
                  <div className={`text-xs font-semibold text-gray-400 uppercase tracking-wider ${state.sidebarOpen ? '' : 'text-center'}`}>
                    {state.sidebarOpen ? 'Admin' : '---'}
                  </div>
                </div>
                {adminNavItems.map((item) => (
                  <NavLink key={item.path} to={item.path}
                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md' : 'hover:bg-gray-50 text-gray-600'} ${state.sidebarOpen ? '' : 'justify-center'}`}>
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {state.sidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium whitespace-nowrap">{item.label}</motion.span>}
                  </NavLink>
                ))}
              </>
            )}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className={`p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-teal-50 ${state.sidebarOpen ? '' : 'p-2'}`}>
              {state.sidebarOpen ? (
                <>
                  <Globe className="w-6 h-6 text-indigo-500 mb-2" />
                  <p className="text-sm font-semibold text-gray-800">Explore the World</p>
                  <p className="text-xs text-gray-500 mt-1">Start planning your next adventure!</p>
                </>
              ) : (
                <Globe className="w-6 h-6 text-indigo-500" />
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}