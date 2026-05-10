import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Hotel, UtensilsCrossed, Map, Car, ShoppingBag, Download, Share2, DollarSign, TrendingUp, ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { expenses, expenseCategories } from '../data/content';
import { trips as allTrips } from '../data/trips';

const COLORS = ['#6366F1', '#0EA5E9', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Expense() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { state } = useApp();
  const trip = state.trips.find(t => t.id === parseInt(tripId)) || allTrips[0];
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredExpenses = filterCategory === 'all' ? expenses : expenses.filter(e => e.category === filterCategory);
  const totalExpenses = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  const taxRate = 0.08, tax = totalExpenses * taxRate, grandTotal = totalExpenses + tax;
  const budgetRemaining = trip.budget - grandTotal, budgetUsed = (grandTotal / trip.budget) * 100;

  const categoryTotals = expenseCategories.map(cat => ({
    name: cat.name,
    value: expenses.filter(e => e.category === cat.id).reduce((acc, e) => acc + e.amount, 0)
  })).filter(c => c.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trip Expenses</h1>
            <p className="text-gray-500">{trip.name} - {trip.destination}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Print</Button>
          <Button variant="secondary" icon={Download}>Export PDF</Button>
          <Button icon={Share2}>Share Invoice</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <p className="text-sm text-gray-500 mb-1">Total Budget</p><p className="text-2xl font-bold text-gray-900">${trip.budget.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <p className="text-sm text-gray-500 mb-1">Total Spent</p><p className="text-2xl font-bold text-primary-600">${grandTotal.toFixed(2)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
          <p className="text-sm text-gray-500 mb-1">Tax (8%)</p><p className="text-2xl font-bold text-gray-900">${tax.toFixed(2)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
          <p className="text-sm text-gray-500 mb-1">Remaining</p><p className={`text-2xl font-bold ${budgetRemaining >= 0 ? 'text-teal-600' : 'text-red-500'}`}>${budgetRemaining.toFixed(2)}</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Budget Usage</h3>
          <span className="text-sm text-gray-500">{budgetUsed.toFixed(1)}% used</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${budgetUsed > 100 ? 'bg-red-500' : budgetUsed > 80 ? 'bg-yellow-500' : 'bg-gradient-to-r from-primary-500 to-teal-500'}`} style={{ width: `${Math.min(budgetUsed, 100)}%` }} />
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Expense Details</h3>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option value="all">All Categories</option>
                {expenseCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Category</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Description</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Date</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense, index) => {
                    const category = expenseCategories.find(c => c.id === expense.category);
                    return (
                      <motion.tr key={expense.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * index }}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category?.color === 'sky' ? 'bg-sky-100' : category?.color === 'teal' ? 'bg-teal-100' : category?.color === 'orange' ? 'bg-orange-100' : category?.color === 'primary' ? 'bg-primary-100' : category?.color === 'pink' ? 'bg-pink-100' : 'bg-gray-100'}`}>
                              {expense.category === 'flights' && <Plane className="w-4 h-4 text-sky-500" />}
                              {expense.category === 'accommodation' && <Hotel className="w-4 h-4 text-teal-500" />}
                              {expense.category === 'food' && <UtensilsCrossed className="w-4 h-4 text-orange-500" />}
                              {expense.category === 'activities' && <Map className="w-4 h-4 text-primary-500" />}
                              {expense.category === 'transport' && <Car className="w-4 h-4 text-gray-500" />}
                              {expense.category === 'shopping' && <ShoppingBag className="w-4 h-4 text-pink-500" />}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{category?.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{expense.description}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{expense.date}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">${expense.amount}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-medium text-gray-900">${totalExpenses.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Tax (8%)</span><span className="font-medium text-gray-900">${tax.toFixed(2)}</span></div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Grand Total</span>
                  <span className="font-bold text-lg text-primary-600">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-6">Spending by Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryTotals} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                  {categoryTotals.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 mt-4">
              {categoryTotals.map((cat, index) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} /><span className="text-sm text-gray-600">{cat.name}</span></div>
                  <span className="text-sm font-medium text-gray-900">${cat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Budget Insights</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0"><TrendingUp className="w-4 h-4 text-teal-600" /></div>
                <div><p className="text-sm font-medium text-gray-900">On Track</p><p className="text-xs text-gray-500">You're within your planned budget</p></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0"><DollarSign className="w-4 h-4 text-primary-600" /></div>
                <div><p className="text-sm font-medium text-gray-900">Top Expense</p><p className="text-xs text-gray-500">Accommodation: $720</p></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
