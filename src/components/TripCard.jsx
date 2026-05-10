import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign } from 'lucide-react';

const statusColors = { upcoming: 'bg-sky-100 text-sky-700', ongoing: 'bg-teal-100 text-teal-700', completed: 'bg-gray-100 text-gray-600', planning: 'bg-primary-100 text-primary-700' };

export default function TripCard({ trip, index = 0 }) {
  const status = trip.status.charAt(0).toUpperCase() + trip.status.slice(1);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
      <Link to={`/itinerary/${trip.id}`}>
        <div className="card-hover cursor-pointer group">
          <div className="relative h-48 overflow-hidden">
            <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${statusColors[trip.status]}`}>{status}</span>
            <h3 className="absolute bottom-4 left-4 right-4 text-lg font-bold text-white">{trip.name}</h3>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-3"><MapPin className="w-4 h-4" /><span>{trip.destination}</span></div>
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-3"><Calendar className="w-4 h-4" /><span>{trip.startDate} - {trip.endDate}</span></div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-gray-700"><DollarSign className="w-4 h-4" /><span className="font-semibold">${trip.budget.toLocaleString()}</span></div>
              <div className="flex -space-x-2">
                {[...Array(Math.min(trip.travelers, 3))].map((_, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-gradient-primary border-2 border-white flex items-center justify-center">
                    <span className="text-[10px] text-white font-medium">{String.fromCharCode(65 + i)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
