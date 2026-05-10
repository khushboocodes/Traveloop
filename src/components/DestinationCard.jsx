import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Star, DollarSign, Plus } from 'lucide-react';

export default function DestinationCard({ destination, index = 0, onAddToTrip }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }} className="group">
      <Link to={`/city-search?q=${encodeURIComponent(destination.city)}`}>
        <div className="relative h-72 rounded-2xl overflow-hidden bg-white shadow-soft border border-gray-100">
          <img src={destination.image} alt={destination.city} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /><span className="text-xs font-medium text-gray-700">{destination.popularity}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white mb-1">{destination.city}</h3>
            <div className="flex items-center gap-2 text-white/80 text-sm mb-3"><MapPin className="w-4 h-4" /><span>{destination.country}</span></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-white/90 text-sm"><DollarSign className="w-4 h-4" /><span>from ${destination.costEstimate.toLocaleString()}</span></div>
              {onAddToTrip && (
                <button onClick={(e) => { e.preventDefault(); onAddToTrip(destination); }} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 flex items-center justify-center transition-colors">
                  <Plus className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
