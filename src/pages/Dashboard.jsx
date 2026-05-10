import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Plane, Map, Compass, DollarSign, TrendingUp, ChevronRight, Search, Filter, ArrowRight, Users, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import DestinationCard from '../components/DestinationCard';
import TripCard from '../components/TripCard';
import StatCard from '../components/StatCard';
import api from '../services/api';
import { destinations as staticDestinations } from '../data/destinations';

export default function Dashboard() {
  const { state, getTripStats } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [destinations, setDestinations] = useState(staticDestinations);
  const tripStats = getTripStats();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await api.get('/destinations/');
        if (response.data.length > 0) {
          setDestinations(response.data.map(d => ({
            id: d.id,
            city: d.city,
            country: d.country,
            image: d.image,
            popularity: d.popularity,
            costEstimate: d.cost_estimate,
            description: d.description
          })));
        }
      } catch (error) {
        console.log('Using static destinations');
      }
    };
    fetchDestinations();
  }, []);

  const stats = [
    { title: 'Total Trips', value: tripStats.total || 0, icon: Map, color: 'primary' },
    { title: 'Countries', value: state.user?.stats?.countriesVisited || 0, icon: Compass, color: 'sky' },
    { title: 'Upcoming', value: tripStats.upcoming + tripStats.ongoing, icon: Calendar, color: 'teal' },
    { title: 'Budget Spent', value: `$${(state.user?.stats?.totalSpent || 0).toLocaleString()}`, icon: DollarSign, color: 'violet' }
  ];

  const activeTrips = state.trips.filter(t => t.status === 'upcoming' || t.status === 'ongoing');

  if (state.loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Loader2 className="w-8 h-8 text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative h-80 md:h-96 rounded-3xl overflow-hidden">
        <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80" alt="Travel" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-teal-900/60" />
        <div className="relative h-full flex flex-col justify-center px-8 md:px-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white font-medium mb-4">
              Welcome back, {state.user?.firstName || 'Traveler'}!
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Where will your next <span className="text-teal-300">adventure</span> take you?
            </h1>
            <p className="text-white/80 text-lg mb-6 max-w-lg">
              Discover amazing destinations, plan perfect itineraries, and share your travel stories.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/create-trip" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-xl text-white font-semibold hover:shadow-lg transition-all">
                <Plane className="w-5 h-5" /> Plan a Trip
              </Link>
              <Link to="/city-search" className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium hover:bg-white/30 transition-all">
                <Compass className="w-5 h-5" /> Explore
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery.trim()) navigate(`/city-search?q=${encodeURIComponent(searchQuery)}`); }}
            placeholder="Search destinations, activities..." className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-500" /> <span className="text-sm font-medium text-gray-700">Filters</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <TrendingUp className="w-5 h-5 text-gray-500" /> <span className="text-sm font-medium text-gray-700">Sort</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => <StatCard key={stat.title} {...stat} index={i} />)}
      </div>

      {/* Top Destinations */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Top Destinations</h2>
            <p className="text-gray-500 text-sm mt-1">Discover trending places around the world</p>
          </div>
          <Link to="/city-search" className="flex items-center gap-1 text-indigo-500 hover:text-indigo-600 font-medium text-sm">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {destinations.slice(0, 5).map((dest, i) => (
            <DestinationCard key={dest.id || i} destination={dest} index={i} />
          ))}
        </div>
      </section>

      {/* Your Trips */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Trips</h2>
            <p className="text-gray-500 text-sm mt-1">Manage and plan your travel adventures</p>
          </div>
          <div className="flex gap-3">
            <Link to="/my-trips" className="flex items-center gap-1 text-indigo-500 hover:text-indigo-600 font-medium text-sm">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/create-trip" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-lg text-white text-sm font-medium hover:shadow-md transition-all">
              <Calendar className="w-4 h-4" /> New Trip
            </Link>
          </div>
        </div>
        {activeTrips.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTrips.slice(0, 3).map((trip, i) => <TripCard key={trip.id || i} trip={trip} index={i} />)}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <Map className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No trips yet</h3>
            <p className="text-gray-500 mb-4">Start planning your next adventure today!</p>
            <Link to="/create-trip" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-xl text-white font-semibold hover:shadow-lg transition-all">
              <Plane className="w-5 h-5" /> Plan a Trip
            </Link>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { icon: Map, label: 'Find Cities', path: '/city-search', color: 'from-indigo-500 to-indigo-600' },
            { icon: Calendar, label: 'Discover Activities', path: '/activity-search', color: 'from-sky-500 to-sky-600' },
            { icon: Users, label: 'Community', path: '/community', color: 'from-teal-500 to-teal-600' },
            { icon: Plane, label: 'Plan New Trip', path: '/create-trip', color: 'from-violet-500 to-violet-600' }
          ].map((action, i) => (
            <motion.div key={action.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
              <Link to={action.path}
                className="flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition-shadow`}>
                  <action.icon className="w-7 h-7 text-white" />
                </div>
                <span className="font-medium text-gray-900">{action.label}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 mt-2 group-hover:translate-x-1 group-hover:text-indigo-500 transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}