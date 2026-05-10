import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Plus, Trash2, ChevronDown, GripVertical, Save, Share2, ArrowLeft, Clock, Users, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import api from '../services/api';

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { state, updateTrip } = useApp();
  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [expandedSections, setExpandedSections] = useState({ 0: true });
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [newStop, setNewStop] = useState({ city: '', country: '', start_date: '', end_date: '', notes: '', budget: 0 });

  useEffect(() => {
    const tripData = state.trips.find(t => t.id === parseInt(tripId));
    if (tripData) {
      setTrip(tripData);
      fetchStops(tripData.id);
    }
  }, [tripId, state.trips]);

  const fetchStops = async (tripId) => {
    try {
      const response = await api.get(`/trips/${tripId}/stops/`);
      setStops(response.data);
    } catch (error) {
      console.log('No stops found or error fetching stops');
      setStops([]);
    }
  };

  if (!trip) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
    </div>
  );

  const toggleSection = (index) => setExpandedSections(prev => ({ ...prev, [index]: !prev[index] }));

  const addStop = async () => {
    if (!newStop.city) return;
    setLoading(true);
    try {
      await api.post(`/trips/${trip.id}/stops/`, {
        ...newStop,
        order: stops.length
      });
      await fetchStops(trip.id);
      setShowAddStopModal(false);
      setNewStop({ city: '', country: '', start_date: '', end_date: '', notes: '', budget: 0 });
    } catch (error) {
      console.error('Failed to add stop:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeStop = async (stopId) => {
    try {
      await api.delete(`/trips/${trip.id}/stops/${stopId}/`);
      await fetchStops(trip.id);
    } catch (error) {
      console.error('Failed to remove stop:', error);
    }
  };

  const addActivity = async (stopId) => {
    const name = prompt('Enter activity name:');
    const cost = prompt('Enter cost (optional):', '0');
    const duration = prompt('Enter duration:', '2 hours');

    if (name) {
      try {
        await api.post(`/stops/${stopId}/activities/`, {
          name,
          cost: parseFloat(cost) || 0,
          duration
        });
        await fetchStops(trip.id);
      } catch (error) {
        console.error('Failed to add activity:', error);
      }
    }
  };

  const removeActivity = async (stopId, activityId) => {
    try {
      await api.delete(`/stops/${stopId}/activities/${activityId}/`);
      await fetchStops(trip.id);
    } catch (error) {
      console.error('Failed to remove activity:', error);
    }
  };

  const totalSpent = stops.reduce((acc, stop) => acc + (stop.budget || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/my-trips')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{trip.name}</h1>
            <p className="text-gray-500">{trip.destination}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-medium rounded-xl hover:shadow-lg transition-all">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 shadow-soft p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center"><MapPin className="w-5 h-5 text-indigo-500" /></div>
            <div><p className="text-sm text-gray-500">Destination</p><p className="font-semibold text-gray-900 text-sm">{trip.destination}</p></div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-100 shadow-soft p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center"><Calendar className="w-5 h-5 text-sky-500" /></div>
            <div><p className="text-sm text-gray-500">Dates</p><p className="font-semibold text-gray-900 text-sm">{trip.start_date} - {trip.end_date}</p></div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-gray-100 shadow-soft p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center"><Users className="w-5 h-5 text-teal-500" /></div>
            <div><p className="text-sm text-gray-500">Travelers</p><p className="font-semibold text-gray-900">{trip.travelers}</p></div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-gray-100 shadow-soft p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center"><DollarSign className="w-5 h-5 text-violet-500" /></div>
            <div><p className="text-sm text-gray-500">Budget</p><p className="font-semibold text-gray-900">${parseFloat(trip.budget || 0).toLocaleString()}</p></div>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Itinerary</h2>
            <button onClick={() => setShowAddStopModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
              <Plus className="w-4 h-4" /> Add Stop
            </button>
          </div>

          {stops.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-soft p-8 text-center">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No stops added yet</h3>
              <p className="text-gray-500 mb-4">Start building your itinerary by adding stops</p>
              <button onClick={() => setShowAddStopModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-medium rounded-xl">
                <Plus className="w-4 h-4" /> Add First Stop
              </button>
            </div>
          ) : (
            stops.map((stop, index) => (
              <motion.div key={stop.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-100 shadow-soft overflow-hidden">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleSection(index)}>
                  <div className="flex items-center gap-4">
                    <GripVertical className="w-5 h-5 text-gray-300 cursor-grab" />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 flex items-center justify-center text-white font-bold">{index + 1}</div>
                    <div><h3 className="font-semibold text-gray-900">{stop.city}, {stop.country}</h3><p className="text-sm text-gray-500">{stop.start_date} - {stop.end_date}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); removeStop(stop.id); }} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections[index] ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                <AnimatePresence>
                  {expandedSections[index] && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-100">
                      <div className="p-4 space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-700">Activities</h4>
                            <button onClick={() => addActivity(stop.id)} className="text-sm text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1">
                              <Plus className="w-4 h-4" /> Add Activity
                            </button>
                          </div>
                          {(!stop.activities || stop.activities.length === 0) ? (
                            <p className="text-sm text-gray-400 italic">No activities added</p>
                          ) : (
                            <div className="space-y-2">
                              {stop.activities.map((activity, actIndex) => (
                                <div key={activity.id || actIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                  <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-700">{activity.name}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-700">${activity.cost || 0}</span>
                                    <button onClick={() => removeActivity(stop.id, activity.id)} className="p-1 hover:bg-red-50 rounded transition-colors">
                                      <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl">
                          <span className="text-sm font-medium text-gray-700">Estimated Budget</span>
                          <span className="text-lg font-bold text-indigo-600">${stop.budget || 0}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl border border-gray-100 shadow-soft p-5 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Budget Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Total Budget</span><span className="font-medium">${parseFloat(trip.budget || 0).toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Spent</span><span className="font-medium text-teal-600">${totalSpent.toLocaleString()}</span></div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between"><span className="font-medium text-gray-700">Remaining</span><span className="font-bold text-indigo-600">${(parseFloat(trip.budget || 0) - totalSpent).toLocaleString()}</span></div>
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full" style={{ width: `${trip.budget > 0 ? Math.min((totalSpent / parseFloat(trip.budget)) * 100, 100) : 0}%` }} />
            </div>
          </motion.div>
        </div>
      </div>

      <Modal isOpen={showAddStopModal} onClose={() => setShowAddStopModal(false)} title="Add New Stop" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
            <input type="text" value={newStop.city} onChange={(e) => setNewStop({...newStop, city: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="Paris" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
            <input type="text" value={newStop.country} onChange={(e) => setNewStop({...newStop, country: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="France" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date *</label>
              <input type="date" value={newStop.start_date} onChange={(e) => setNewStop({...newStop, start_date: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date *</label>
              <input type="date" value={newStop.end_date} onChange={(e) => setNewStop({...newStop, end_date: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget ($)</label>
            <input type="number" value={newStop.budget} onChange={(e) => setNewStop({...newStop, budget: parseFloat(e.target.value) || 0})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="0" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowAddStopModal(false)}
              className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={addStop} disabled={loading || !newStop.city}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add Stop'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}