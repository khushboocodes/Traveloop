import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Map, DollarSign, Globe, Camera, Edit2, Save, X, MapPin, Star, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import { destinations } from '../data/destinations';

export default function Profile() {
  const { state, dispatch } = useApp();
  const fileInputRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: state.user.firstName, lastName: state.user.lastName, email: state.user.email,
    city: state.user.city, bio: state.user.bio
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => dispatch({ type: 'UPDATE_USER', payload: { avatar: reader.result } });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => { dispatch({ type: 'UPDATE_USER', payload: profileData }); setEditing(false); };
  const handleCancel = () => { setProfileData({ firstName: state.user.firstName, lastName: state.user.lastName, email: state.user.email, city: state.user.city, bio: state.user.bio }); setEditing(false); };

  const stats = [
    { title: 'Total Trips', value: state.user.stats.totalTrips, icon: Map, color: 'primary' },
    { title: 'Countries', value: state.user.stats.countriesVisited, icon: Globe, color: 'sky' },
    { title: 'Total Spent', value: `$${state.user.stats.totalSpent.toLocaleString()}`, icon: DollarSign, color: 'teal' },
    { title: 'Favorite', value: state.user.stats.favoriteDestination, icon: Star, color: 'violet' }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-500 via-primary-600 to-teal-500 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80')] bg-cover bg-center opacity-30" />
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
                <img src={state.user.avatar} alt={state.user.firstName} className="w-full h-full object-cover" />
              </div>
              {editing && <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white shadow-md"><Camera className="w-4 h-4" /></button>}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
            <div className="flex-1 pt-2 md:pb-2">
              {editing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label><input type="text" value={profileData.firstName} onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label><input type="text" value={profileData.lastName} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} className="input-field" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label><input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="input-field" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">City</label><input type="text" value={profileData.city} onChange={(e) => setProfileData({...profileData, city: e.target.value})} className="input-field" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label><textarea rows="3" value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} className="input-field resize-none" /></div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">{state.user.firstName} {state.user.lastName}</h1>
                  <p className="text-gray-500 flex items-center gap-2 mt-1"><MapPin className="w-4 h-4" />{state.user.city}</p>
                  <p className="text-gray-600 mt-2 max-w-xl">{state.user.bio}</p>
                </>
              )}
            </div>
            <div className="flex gap-2 md:pb-2">
              {editing ? (<><Button variant="secondary" icon={X} onClick={handleCancel}>Cancel</Button><Button icon={Save} onClick={handleSave}>Save</Button></>) : (<Button variant="secondary" icon={Edit2} onClick={() => setEditing(true)}>Edit Profile</Button>)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{stats.map((stat, i) => <StatCard key={stat.title} {...stat} index={i} />)}</div>

      {/* Saved Destinations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Saved Destinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {destinations.slice(0, 4).map((dest, i) => (
            <motion.div key={dest.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.05 }} className="card overflow-hidden group">
              <div className="relative h-32 overflow-hidden rounded-t-xl">
                <img src={dest.image} alt={dest.city} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-2 left-2"><h3 className="text-sm font-semibold text-white">{dest.city}</h3><p className="text-xs text-white/80">{dest.country}</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Account Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100"><div><p className="font-medium text-gray-900">Email</p><p className="text-sm text-gray-500">{state.user.email}</p></div><Button variant="ghost" size="sm">Change</Button></div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100"><div><p className="font-medium text-gray-900">Password</p><p className="text-sm text-gray-500">Last changed 3 months ago</p></div><Button variant="ghost" size="sm">Change</Button></div>
          <div className="flex items-center justify-between py-3"><div><p className="font-medium text-gray-900">Notifications</p><p className="text-sm text-gray-500">Manage your notification preferences</p></div><Button variant="ghost" size="sm">Manage</Button></div>
        </div>
      </motion.div>
    </div>
  );
}
