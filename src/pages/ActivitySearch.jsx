import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Mountain, UtensilsCrossed, Landmark, Flower, Music, X } from 'lucide-react';
import ActivityCard from '../components/ActivityCard';
import Button from '../components/Button';
import { activities } from '../data/destinations';

const categories = [
  { id: 'all', name: 'All Activities', icon: Sparkles },
  { id: 'adventure', name: 'Adventure', icon: Mountain },
  { id: 'food', name: 'Food & Drink', icon: UtensilsCrossed },
  { id: 'culture', name: 'Culture', icon: Landmark },
  { id: 'relaxation', name: 'Relaxation', icon: Flower },
  { id: 'nightlife', name: 'Nightlife', icon: Music }
];

export default function ActivitySearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ duration: 'all', maxCost: 500 });

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!activity.name.toLowerCase().includes(query) && !activity.city.toLowerCase().includes(query)) return false;
      }
      if (selectedCategory !== 'all' && activity.category.toLowerCase() !== selectedCategory) return false;
      if (activity.cost > filters.maxCost) return false;
      return true;
    });
  }, [searchQuery, selectedCategory, filters]);

  const clearFilters = () => { setFilters({ duration: 'all', maxCost: 500 }); setSearchQuery(''); setSelectedCategory('all'); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Discover Activities</h1>
        <p className="text-gray-500">Find amazing experiences for your trip</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-gradient-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
            <cat.icon className="w-4 h-4" />{cat.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search activities..."
            className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-lg" />
          {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-400" /></button>}
        </div>

        <div className="flex items-center gap-3">
          <Button variant={showFilters ? 'primary' : 'secondary'} onClick={() => setShowFilters(!showFilters)}>More Filters</Button>
          {(filters.maxCost < 500) && <button onClick={() => setFilters({...filters, maxCost: 500})} className="text-sm text-primary-500 hover:text-primary-600 font-medium">Clear filters</button>}
          <span className="text-sm text-gray-500 ml-auto">{filteredActivities.length} activities found</span>
        </div>

        {showFilters && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Max Cost: ${filters.maxCost}</label>
              <input type="range" min="0" max="500" step="10" value={filters.maxCost} onChange={(e) => setFilters({...filters, maxCost: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500" />
              <div className="flex justify-between text-xs text-gray-400 mt-2"><span>$0</span><span>$500+</span></div>
            </div>
          </motion.div>
        )}
      </div>

      {filteredActivities.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity, i) => <ActivityCard key={activity.id} activity={activity} index={i} />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No activities found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          <Button variant="secondary" onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
}
