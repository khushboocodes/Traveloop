import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Users, Share2, Copy, Heart, ArrowLeft, Clock, Globe, Check } from 'lucide-react';
import Button from '../components/Button';
import { trips } from '../data/trips';

export default function PublicItinerary() {
  const { shareId } = useParams();
  const trip = trips[0];
  const totalBudget = trip.itinerary.reduce((acc, stop) => acc + (stop.budget || 0), 0);
  const totalSpent = trip.itinerary.reduce((acc, stop) => acc + stop.activities.reduce((a, act) => a + (act.cost || 0), 0), 0);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:block">Traveloop</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" icon={Copy}>Copy to My Trips</Button>
            <Button size="sm" icon={Share2}>Share</Button>
          </div>
        </div>
      </header>

      <div className="relative h-80 md:h-96">
        <img src={trip.coverImage} alt={trip.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-end px-6 md:px-12 pb-8">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-3"><Globe className="w-4 h-4" /><span>Shared Itinerary</span></div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{trip.name}</h1>
          <p className="text-white/80 flex items-center gap-2"><MapPin className="w-5 h-5" />{trip.destination}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card p-4 text-center"><Calendar className="w-6 h-6 text-primary-500 mx-auto mb-2" /><p className="text-sm text-gray-500">Duration</p><p className="font-semibold text-gray-900">14 days</p></div>
              <div className="card p-4 text-center"><MapPin className="w-6 h-6 text-sky-500 mx-auto mb-2" /><p className="text-sm text-gray-500">Stops</p><p className="font-semibold text-gray-900">{trip.itinerary.length} cities</p></div>
              <div className="card p-4 text-center"><DollarSign className="w-6 h-6 text-teal-500 mx-auto mb-2" /><p className="text-sm text-gray-500">Est. Budget</p><p className="font-semibold text-gray-900">${totalBudget.toLocaleString()}</p></div>
              <div className="card p-4 text-center"><Users className="w-6 h-6 text-violet-500 mx-auto mb-2" /><p className="text-sm text-gray-500">Travelers</p><p className="font-semibold text-gray-900">{trip.travelers} people</p></div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About This Trip</h2>
              <p className="text-gray-600 leading-relaxed">{trip.description}</p>
            </motion.div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Day by Day Itinerary</h2>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-teal-500" />
                {trip.itinerary.map((stop, index) => (
                  <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.1 }} className="relative flex gap-6 mb-6">
                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">D{index + 1}</div>
                    <div className="flex-1 card overflow-hidden">
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div><h3 className="text-lg font-semibold text-gray-900">{stop.city}, {stop.country}</h3><p className="text-sm text-gray-500 flex items-center gap-1"><Calendar className="w-4 h-4" />{stop.startDate} - {stop.endDate}</p></div>
                          <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">${stop.budget}</span>
                        </div>
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Activities</h4>
                          <div className="space-y-2">
                            {stop.activities.map((activity, actIndex) => (
                              <div key={actIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-white flex items-center justify-center"><Check className="w-4 h-4 text-teal-500" /></div><span className="text-sm text-gray-700">{activity.name}</span></div>
                                <div className="flex items-center gap-2 text-sm text-gray-500"><Clock className="w-4 h-4" /><span>{activity.duration}</span><span className="mx-2">•</span><span className="font-medium text-gray-700">${activity.cost}</span></div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {stop.notes && <div className="p-3 bg-primary-50 rounded-xl"><p className="text-sm text-primary-700">{stop.notes}</p></div>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Planned</span><span className="font-medium">${totalBudget.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Activities</span><span className="font-medium">${totalSpent.toLocaleString()}</span></div>
                <div className="pt-3 border-t border-gray-100"><div className="flex justify-between"><span className="font-medium text-gray-900">Per Person</span><span className="font-bold text-primary-600">${Math.round(totalBudget / trip.travelers).toLocaleString()}</span></div></div>
              </div>
              <div className="mt-6 space-y-3">
                <Button className="w-full" icon={Copy}>Use This Itinerary</Button>
                <Button variant="secondary" className="w-full" icon={Heart}>Save to Favorites</Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <footer className="mt-12 py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">Created with <span className="text-primary-500">Traveloop</span> - Plan Your Perfect Journey</p>
        </div>
      </footer>
    </div>
  );
}
