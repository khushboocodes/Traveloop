import { Outlet, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';

export default function Layout() {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <MobileMenu />
      <main className={`transition-all duration-300 pt-16 ${state.sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}>
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
