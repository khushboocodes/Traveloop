import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, ArrowLeft, Camera, X, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import api from '../services/api';

export default function CreateTrip() {
  const navigate = useNavigate();
  const { createTrip } = useApp();
  const [loading, setLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '', destination: '', start_date: '', end_date: '', description: '', budget: '', travelers: 1
  });
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.destination || !formData.start_date || !formData.end_date) {
      setError('Please fill in all required fields');
      return;
    }

    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);
    try {
      const tripData = {
        name: formData.name,
        destination: formData.destination,
        start_date: formData.start_date,
        end_date: formData.end_date,
        description: formData.description,
        budget: parseFloat(formData.budget) || 0,
        travelers: parseInt(formData.travelers) || 1,
        cover_image: coverPreview || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
        status: 'planning',
      };

      const newTrip = await createTrip(tripData);
      navigate(`/itinerary/${newTrip.id}`);
    } catch (err) {
      console.error('Failed to create trip:', err);
      setError(err.response?.data?.detail || 'Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Trip</h1>
          <p className="text-gray-500">Plan your next adventure</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
          {error}
        </div>
      )}

      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Cover Image</label>
          <div onClick={() => document.getElementById('cover-upload')?.click()}
            className="relative h-48 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden hover:border-indigo-400 transition-colors cursor-pointer">
            {coverPreview ? (
              <>
                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                <button type="button" onClick={(e) => { e.stopPropagation(); setCoverPreview(null); }}
                  className="absolute top-3 right-3 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <Camera className="w-10 h-10 mb-2" />
                <span className="text-sm font-medium">Click to upload</span>
              </div>
            )}
            <input id="cover-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Trip Name *</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="Summer in Europe" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Destination *</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})}
              className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="Paris, Barcelona, Rome" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date *</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date *</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="date" value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" required />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none" placeholder="Describe your trip plans..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="number" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})}
                className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="5000" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Travelers</label>
            <input type="number" value={formData.travelers} onChange={(e) => setFormData({...formData, travelers: parseInt(e.target.value) || 1})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" min="1" />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => navigate(-1)}
            className="flex-1 py-3 px-6 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Loader2 className="w-5 h-5" />
              </motion.div>
            ) : 'Create Trip'}
          </button>
        </div>
      </motion.form>
    </div>
  );
}