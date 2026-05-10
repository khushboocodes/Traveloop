import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, DollarSign, X, SlidersHorizontal } from 'lucide-react';
import DestinationCard from '../components/DestinationCard';
import Button from '../components/Button';
import { destinations } from '../data/destinations';

export default function CitySearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ region: 'all', popularity: 'all', budget: 'all' });

  const regions = ['all', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania', 'Middle East'];
  const budgetRanges = [
    { value: 'all', label: 'Any Budget' }, { value: 'budget', label: 'Under $1500' },
    { value: 'moderate', label: '$1500 - $2500' }, { value: 'luxury', label: 'Over $2500' }
  ];

  const filteredDestinations = useMemo(() => {
    return destinations.filter(dest => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!dest.city.toLowerCase().includes(query) && !dest.country.toLowerCase().includes(query)) return false;
      }
      if (filters.region !== 'all' && dest.region !== filters.region) return false;
      if (filters.popularity !== 'all' && dest.popularity < parseInt(filters.popularity)) return false;
      if (filters.budget === 'budget' && dest.costEstimate >= 1500) return false;
      if (filters.budget === 'moderate' && (dest.costEstimate < 1500 || dest.costEstimate > 2500)) return false;
      if (filters.budget === 'luxury' && dest.costEstimate <= 2500) return false;
      return true;
    });
  }, [searchQuery, filters]);

  const handleSearch = (e) => { e.preventDefault(); setSearchParams(searchQuery ? { q: searchQuery } : {}); };
  const clearFilters = () => { setFilters({ region: 'all', popularity: 'all', budget: 'all' }); setSearchQuery(''); setSearchParams({}); };
  const hasActiveFilters = filters.region !== 'all' || filters.popularity !== 'all' || filters.budget !== 'all';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Discover Cities</h1>
        <p className="text-gray-500">Find your next perfect destination</p>
      </div>

      <div className="space-y-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search cities or countries..."
            className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-lg" />
          {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-400" /></button>}
        </form>

        <div className="flex items-center gap-3">
          <Button variant={showFilters ? 'primary' : 'secondary'} icon={SlidersHorizontal} onClick={() => setShowFilters(!showFilters)}>Filters</Button>
          {hasActiveFilters && <button onClick={clearFilters} className="text-sm text-primary-500 hover:text-primary-600 font-medium">Clear all filters</button>}
          <span className="text-sm text-gray-500 ml-auto">{filteredDestinations.length} destinations found</span>
        </div>

        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="card p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Region</label>
              <div className="flex flex-wrap gap-2">
                {regions.map(region => (
                  <button key={region} onClick={() => setFilters({...filters, region})} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filters.region === region ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {region === 'all' ? 'All Regions' : region}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Popularity</label>
              <div className="flex flex-wrap gap-2">
                {['90', '85', '80', 'all'].map(pop => (
                  <button key={pop} onClick={() => setFilters({...filters, popularity: pop})} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filters.popularity === pop ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {pop === 'all' ? 'Any' : `${pop}+ Popularity`}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Budget Level</label>
              <div className="flex flex-wrap gap-2">
                {budgetRanges.map(range => (
                  <button key={range.value} onClick={() => setFilters({...filters, budget: range.value})} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filters.budget === range.value ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDestinations.map((dest, i) => <DestinationCard key={dest.id} destination={dest} index={i} />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No destinations found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          <Button variant="secondary" onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
}
