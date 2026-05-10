import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map,
  Plus,
  Search,
  Grid,
  List,
  Eye,
  Edit2,
  Trash2
} from 'lucide-react';

import TripCard from '../components/TripCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import api from '../services/api';

export default function MyTrips() {

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    tripId: null
  });

  // FETCH TRIPS
  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await api.get('/trips/');
      setTrips(response.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  // DELETE TRIP
  const handleDelete = async () => {
    try {
      await api.delete(`/trips/${deleteModal.tripId}/`);

      setTrips(
        trips.filter((trip) => trip.id !== deleteModal.tripId)
      );

      setDeleteModal({
        open: false,
        tripId: null
      });

    } catch (error) {
      console.error(error);
    }
  };

  // STATS
  const tripStats = {
    upcoming: trips.filter(t => t.status === 'upcoming').length,
    ongoing: trips.filter(t => t.status === 'ongoing').length,
    completed: trips.filter(t => t.status === 'completed').length,
    planning: trips.filter(t => t.status === 'planning').length
  };

  // TABS
  const tabs = [
    { id: 'all', label: 'All Trips', count: trips.length },
    { id: 'upcoming', label: 'Upcoming', count: tripStats.upcoming },
    { id: 'ongoing', label: 'Ongoing', count: tripStats.ongoing },
    { id: 'completed', label: 'Completed', count: tripStats.completed },
    { id: 'planning', label: 'Planning', count: tripStats.planning }
  ];

  // FILTER
  const filteredTrips = trips.filter((trip) => {

    if (
      activeTab !== 'all' &&
      trip.status !== activeTab
    ) {
      return false;
    }

    if (
      searchQuery &&
      !trip.name.toLowerCase().includes(
        searchQuery.toLowerCase()
      )
    ) {
      return false;
    }

    return true;
  });

  // LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-gray-500">
          Loading trips...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Trips
          </h1>

          <p className="text-gray-500">
            Manage and plan your travel adventures
          </p>
        </div>

        <Link to="/create-trip">
          <Button icon={Plus}>
            Create New Trip
          </Button>
        </Link>

      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">

        {tabs.map((tab) => (

          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
            ${
              activeTab === tab.id
                ? 'bg-gradient-primary text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >

            {tab.label}

            <span className={`px-2 py-0.5 rounded-full text-xs
            ${
              activeTab === tab.id
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-500'
            }`}>

              {tab.count}

            </span>

          </button>

        ))}

      </div>

      {/* SEARCH + VIEW */}
      <div className="flex items-center gap-4">

        <div className="relative flex-1 max-w-md">

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trips..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl"
          />

        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl
            ${
              viewMode === 'grid'
                ? 'bg-primary-100 text-primary-600'
                : 'bg-white text-gray-500'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl
            ${
              viewMode === 'list'
                ? 'bg-primary-100 text-primary-600'
                : 'bg-white text-gray-500'
            }`}
          >
            <List className="w-5 h-5" />
          </button>

        </div>

      </div>

      {/* TRIPS */}
      <AnimatePresence mode="wait">

        {filteredTrips.length > 0 ? (

          <motion.div
            key={activeTab + viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}

            className={
              viewMode === 'grid'
                ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >

            {filteredTrips.map((trip, i) => (

              viewMode === 'grid' ? (

                <TripCard
                  key={trip.id}
                  trip={trip}
                  index={i}
                />

              ) : (

                <motion.div
                  key={trip.id}
                  className="card p-4 flex items-center gap-4"
                >

                  <img
                    src={trip.cover_image}
                    alt={trip.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />

                  <div className="flex-1">

                    <h3 className="font-semibold text-gray-900">
                      {trip.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {trip.destination}
                    </p>

                  </div>

                  <div className="flex items-center gap-2">

                    <Link to={`/itinerary/${trip.id}`}>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-5 h-5 text-gray-500" />
                      </button>
                    </Link>

                    <button
                      onClick={() =>
                        setDeleteModal({
                          open: true,
                          tripId: trip.id
                        })
                      }
                      className="p-2 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>

                  </div>

                </motion.div>

              )

            ))}

          </motion.div>

        ) : (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl border border-gray-100"
          >

            <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />

            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No trips found
            </h3>

            <Link to="/create-trip">
              <Button icon={Plus}>
                Create New Trip
              </Button>
            </Link>

          </motion.div>

        )}

      </AnimatePresence>

      {/* DELETE MODAL */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() =>
          setDeleteModal({
            open: false,
            tripId: null
          })
        }
        title="Delete Trip"
        size="sm"
      >

        <p className="text-gray-600 mb-4">
          Are you sure you want to delete this trip?
        </p>

        <div className="flex gap-3">

          <Button
            variant="secondary"
            onClick={() =>
              setDeleteModal({
                open: false,
                tripId: null
              })
            }
            className="flex-1"
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={handleDelete}
            className="flex-1"
          >
            Delete
          </Button>

        </div>

      </Modal>

    </div>
  );
}