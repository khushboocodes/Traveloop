import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon: Icon, trend, color = 'primary', index = 0 }) {
  const colors = { primary: 'from-primary-500 to-primary-600', sky: 'from-sky-500 to-sky-600', teal: 'from-teal-500 to-teal-600', violet: 'from-violet-500 to-violet-600' };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
      whileHover={{ y: -3 }} className="card p-5 hover:shadow-soft-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
          {trend && <p className={`text-xs mt-2 ${trend > 0 ? 'text-teal-600' : 'text-red-500'}`}>{trend > 0 ? '+' : ''}{trend}% from last month</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-md`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
