import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Share2, Copy, MapPin, Calendar, Search, Image } from 'lucide-react';
import { communityPosts, sharedItineraries } from '../data/community';

export default function Community() {
  const [activeTab, setActiveTab] = useState('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});

  const tabs = [
    { id: 'posts', label: 'Travel Posts', count: communityPosts.length },
    { id: 'itineraries', label: 'Shared Itineraries', count: sharedItineraries.length }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Community</h1>
        <p className="text-gray-500">Discover shared travel experiences and itineraries</p>
      </div>

      <div className="flex items-center gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'text-primary-500 border-primary-500' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
            {tab.label}<span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search posts or itineraries..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
      </div>

      {activeTab === 'posts' ? (
        <div className="grid md:grid-cols-2 gap-6">
          {communityPosts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card overflow-hidden">
              <div className="p-4 flex items-center gap-3">
                <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{post.user.name}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{post.destination}<span className="mx-2">•</span>{post.timestamp}</p>
                </div>
              </div>
              <div className="relative">
                <img src={post.images[0]} alt={post.destination} className="w-full h-64 object-cover" />
                {post.images.length > 1 && <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs"><Image className="w-3 h-3" />+{post.images.length - 1}</div>}
              </div>
              <div className="p-4">
                <p className="text-gray-700 mb-3">{post.caption}</p>
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>{post.tripName}</span></div>
                </div>
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  <button onClick={() => setLikedPosts(prev => ({...prev, [post.id]: !prev[post.id]}))} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${likedPosts[post.id] ? 'bg-red-50 text-red-500' : 'hover:bg-gray-50 text-gray-500'}`}>
                    <Heart className={`w-5 h-5 ${likedPosts[post.id] ? 'fill-current' : ''}`} /><span className="text-sm font-medium">{post.likes + (likedPosts[post.id] ? 1 : 0)}</span>
                  </button>
                  <button onClick={() => setSavedPosts(prev => ({...prev, [post.id]: !prev[post.id]}))} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${savedPosts[post.id] ? 'bg-primary-50 text-primary-500' : 'hover:bg-gray-50 text-gray-500'}`}>
                    <Bookmark className={`w-5 h-5 ${savedPosts[post.id] ? 'fill-current' : ''}`} /><span className="text-sm font-medium">{post.saves}</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors ml-auto"><Share2 className="w-5 h-5" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sharedItineraries.map((itinerary, i) => (
            <motion.div key={itinerary.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <img src={itinerary.coverImage} alt={itinerary.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold text-white">{itinerary.name}</h3>
                  <p className="text-white/80 text-sm flex items-center gap-1 mt-1"><MapPin className="w-4 h-4" />{itinerary.destination}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src={itinerary.authorAvatar} alt={itinerary.author} className="w-8 h-8 rounded-full object-cover" />
                  <div><p className="text-sm font-medium text-gray-900">{itinerary.author}</p></div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{itinerary.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>{itinerary.days} days</span></div>
                  <div className="flex items-center gap-1"><span>${itinerary.budget}</span></div>
                  <div className="ml-auto flex items-center gap-1"><Heart className="w-4 h-4" /><span>{itinerary.likes}</span></div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gradient-primary text-white rounded-lg text-sm font-medium hover:shadow-md transition-all">
                    <Copy className="w-4 h-4" />Use Itinerary
                  </button>
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><Bookmark className="w-5 h-5 text-gray-500" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
