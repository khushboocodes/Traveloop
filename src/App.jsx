import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Layout from './components/Layout'
import AuthLayout from './components/AuthLayout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import CreateTrip from './pages/CreateTrip'
import ItineraryBuilder from './pages/ItineraryBuilder'
import MyTrips from './pages/MyTrips'
import Profile from './pages/Profile'
import CitySearch from './pages/CitySearch'
import ActivitySearch from './pages/ActivitySearch'
import Community from './pages/Community'
import PackingChecklist from './pages/PackingChecklist'
import AdminDashboard from './pages/AdminDashboard'
import Notes from './pages/Notes'
import Expense from './pages/Expense'
import PublicItinerary from './pages/PublicItinerary'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

function ProtectedRoute({ children }) {
  const { state } = useApp();

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Loader2 className="w-8 h-8 text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const { state } = useApp();

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Loader2 className="w-8 h-8 text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!state.user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { state } = useApp();

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Loader2 className="w-8 h-8 text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  if (state.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      </Route>

      {/* Main App Routes - For Regular Users */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="create-trip" element={<CreateTrip />} />
        <Route path="itinerary/:tripId" element={<ItineraryBuilder />} />
        <Route path="my-trips" element={<MyTrips />} />
        <Route path="profile" element={<Profile />} />
        <Route path="city-search" element={<CitySearch />} />
        <Route path="activity-search" element={<ActivitySearch />} />
        <Route path="community" element={<Community />} />
        <Route path="packing" element={<PackingChecklist />} />
        <Route path="notes" element={<Notes />} />
        <Route path="expense/:tripId" element={<Expense />} />
      </Route>

      {/* Admin Routes - Separate from regular user routes */}
      <Route path="/admin" element={<AdminRoute><Layout showAdminNav /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* Public Routes */}
      <Route path="/shared/:shareId" element={<PublicItinerary />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;