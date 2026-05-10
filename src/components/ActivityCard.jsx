import { motion } from 'framer-motion';
import { Star, Clock, DollarSign, Plus, MapPin } from 'lucide-react';

export default function ActivityCard({ activity, index = 0, onAdd }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -3 }} className="group">
      <div className="card-hover cursor-pointer">
        <div className="relative h-44 overflow-hidden rounded-t-2xl">
          <img src={activity.image} alt={activity.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">{activity.category}</span>
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /><span className="text-xs font-medium text-gray-700">{activity.rating}</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{activity.name}</h3>
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-3"><MapPin className="w-4 h-4" /><span>{activity.city}, {activity.country}</span></div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">{activity.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-600"><Clock className="w-4 h-4" /><span>{activity.duration}</span></div>
              <div className="flex items-center gap-1 text-gray-700 font-medium"><DollarSign className="w-4 h-4" /><span>${activity.cost}</span></div>
            </div>
            {onAdd && (
              <button onClick={() => onAdd(activity)} className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white hover:shadow-lg transition-all">
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
