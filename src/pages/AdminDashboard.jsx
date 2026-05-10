import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import {
  Users,
  Map,
  DollarSign,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

import StatCard from '../components/StatCard';
import { getAdminStats } from '../services/adminService';

const COLORS = [
  '#6366F1',
  '#0EA5E9',
  '#14B8A6',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6'
];

export default function AdminDashboard() {

  const [dateRange, setDateRange] = useState('30d');

  const [adminStats, setAdminStats] = useState(null);

  const [loading, setLoading] = useState(true);

  // FETCH ADMIN STATS
  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {

    try {

      const data = await getAdminStats();

      setAdminStats(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  // LOADING STATE
  if (loading || !adminStats) {

    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>

          <h1 className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="text-gray-500">
            Monitor your platform's performance
          </p>

        </div>

        <div className="flex gap-2">

          {['7d', '30d', '90d', '1y'].map((range) => (

            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                dateRange === range
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >

              {range}

            </button>

          ))}

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Total Users"
          value={adminStats.total_users?.toLocaleString() || 0}
          icon={Users}
          color="primary"
          trend={12}
          index={0}
        />

        <StatCard
          title="Total Trips"
          value={adminStats.total_trips?.toLocaleString() || 0}
          icon={Map}
          color="sky"
          trend={8}
          index={1}
        />

        <StatCard
          title="Total Bookings"
          value={adminStats.total_bookings?.toLocaleString() || 0}
          icon={DollarSign}
          color="teal"
          trend={15}
          index={2}
        />

        <StatCard
          title="Revenue"
          value={`$${adminStats.revenue || 0}`}
          icon={TrendingUp}
          color="violet"
          trend={18}
          index={3}
        />

      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* REVENUE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >

          <div className="flex items-center justify-between mb-6">

            <div>

              <h3 className="text-lg font-semibold text-gray-900">
                Revenue Overview
              </h3>

              <p className="text-sm text-gray-500">
                Monthly revenue performance
              </p>

            </div>

            <div className="flex items-center gap-2 text-teal-600">

              <ArrowUpRight className="w-4 h-4" />

              <span className="text-sm font-medium">
                +18%
              </span>

            </div>

          </div>

          <ResponsiveContainer width="100%" height={250}>

            <BarChart
              data={adminStats.revenueByMonth || []}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
              />

              <XAxis
                dataKey="month"
                stroke="#9CA3AF"
                fontSize={12}
              />

              <YAxis
                stroke="#9CA3AF"
                fontSize={12}
              />

              <Tooltip />

              <Bar
                dataKey="revenue"
                fill="#6366F1"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </motion.div>

        {/* USER GROWTH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >

          <div className="flex items-center justify-between mb-6">

            <div>

              <h3 className="text-lg font-semibold text-gray-900">
                User Growth
              </h3>

              <p className="text-sm text-gray-500">
                New users per month
              </p>

            </div>

          </div>

          <ResponsiveContainer width="100%" height={250}>

            <LineChart
              data={adminStats.userGrowth || []}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
              />

              <XAxis
                dataKey="month"
                stroke="#9CA3AF"
                fontSize={12}
              />

              <YAxis
                stroke="#9CA3AF"
                fontSize={12}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="users"
                stroke="#6366F1"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </motion.div>

      </div>

      {/* LOWER SECTION */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* POPULAR CITIES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >

          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Popular Cities
          </h3>

          <div className="space-y-4">

            {(adminStats.popularCities || []).map((city, index) => (

              <div
                key={city.name}
                className="flex items-center gap-4"
              >

                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      COLORS[index % COLORS.length]
                  }}
                />

                <span className="flex-1 text-sm text-gray-700">
                  {city.name}
                </span>

                <span className="text-sm font-medium text-gray-900">
                  {city.bookings}
                </span>

              </div>

            ))}

          </div>

        </motion.div>

        {/* POPULAR ACTIVITIES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >

          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Popular Activities
          </h3>

          <ResponsiveContainer width="100%" height={200}>

            <RechartsPie>

              <Pie
                data={adminStats.popularActivities || []}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="count"
                nameKey="name"
              >

                {(adminStats.popularActivities || []).map((entry, index) => (

                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />

                ))}

              </Pie>

              <Tooltip />

            </RechartsPie>

          </ResponsiveContainer>

        </motion.div>

        {/* QUICK INSIGHTS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >

          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Quick Insights
          </h3>

          <div className="space-y-4">

            <div className="p-4 bg-primary-50 rounded-xl">

              <p className="text-sm text-gray-500">
                Avg. Trip Cost
              </p>

              <p className="text-xl font-bold text-primary-600">
                $2,450
              </p>

            </div>

            <div className="p-4 bg-teal-50 rounded-xl">

              <p className="text-sm text-gray-500">
                Booking Rate
              </p>

              <p className="text-xl font-bold text-teal-600">
                78%
              </p>

            </div>

            <div className="p-4 bg-sky-50 rounded-xl">

              <p className="text-sm text-gray-500">
                Repeat Users
              </p>

              <p className="text-xl font-bold text-sky-600">
                45%
              </p>

            </div>

          </div>

        </motion.div>

      </div>

    </div>

  );
}