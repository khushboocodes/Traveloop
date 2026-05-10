import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Shirt, Laptop, Sparkles, Package, Plus, Trash2, RotateCcw, Check, ChevronDown, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import Modal from '../components/Modal';

const iconMap = { FileText, Shirt, Laptop, Sparkles, Package };

export default function PackingChecklist() {
  const { state, dispatch, getPackingProgress } = useApp();
  const [expandedCategories, setExpandedCategories] = useState({ 0: true, 1: true, 2: true, 3: true, 4: true });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('documents');
  const progress = getPackingProgress();

  const toggleCategory = (index) => setExpandedCategories(prev => ({ ...prev, [index]: !prev[index] }));
  const toggleItem = (itemId) => dispatch({ type: 'TOGGLE_PACKED_ITEM', payload: itemId });

  const addItem = () => {
    if (!newItemName.trim()) return;
    const newItem = { id: Date.now(), name: newItemName, packed: false };
    dispatch({ type: 'ADD_PACKING_ITEM', payload: { categoryId: selectedCategory, item: newItem } });
    setNewItemName('');
    setShowAddModal(false);
  };

  const removeItem = (itemId) => dispatch({ type: 'REMOVE_PACKING_ITEM', payload: itemId });
  const resetChecklist = () => { if (confirm('Reset all items to unpacked?')) dispatch({ type: 'RESET_PACKING_LIST' }); };
  const getCategoryProgress = (category) => {
    const total = category.items.length, packed = category.items.filter(item => item.packed).length;
    return total > 0 ? Math.round((packed / total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Packing Checklist</h1>
          <p className="text-gray-500">Make sure you don't forget anything</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon={RotateCcw} onClick={resetChecklist}>Reset</Button>
          <Button variant="secondary" icon={Share2}>Share</Button>
          <Button icon={Plus} onClick={() => setShowAddModal(true)}>Add Item</Button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Overall Progress</h2>
            <p className="text-sm text-gray-500">
              {state.packingList.reduce((acc, cat) => acc + cat.items.filter(i => i.packed).length, 0)} of{' '}
              {state.packingList.reduce((acc, cat) => acc + cat.items.length, 0)} items packed
            </p>
          </div>
          <span className="text-3xl font-bold text-primary-500">{progress}%</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-primary-500 to-teal-500 rounded-full" />
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {state.packingList.map((category, index) => {
          const IconComponent = iconMap[category.icon] || Package;
          const catProgress = getCategoryProgress(category);
          const packedCount = category.items.filter(i => i.packed).length;

          return (
            <motion.div key={category.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="card overflow-hidden">
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleCategory(index)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-teal-100 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{packedCount}/{category.items.length} items</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-teal-500 rounded-full transition-all" style={{ width: `${catProgress}%` }} />
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedCategories[index] ? 'rotate-180' : ''}`} />
                </div>
              </div>

              <AnimatePresence>
                {expandedCategories[index] && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-gray-100">
                    <div className="p-4 space-y-2">
                      {category.items.map((item) => (
                        <div key={item.id} className={`flex items-center justify-between p-3 rounded-xl transition-all ${item.packed ? 'bg-teal-50' : 'bg-gray-50'}`}>
                          <label className="flex items-center gap-3 cursor-pointer flex-1">
                            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${item.packed ? 'bg-gradient-primary border-primary-500' : 'border-gray-300'}`}>
                              {item.packed && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <input type="checkbox" checked={item.packed} onChange={() => toggleItem(item.id)} className="sr-only" />
                            <span className={`text-sm ${item.packed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>{item.name}</span>
                          </label>
                          <button onClick={() => removeItem(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Item" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="input-field">
              {state.packingList.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
            <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="input-field" placeholder="Enter item name" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={addItem} className="flex-1">Add Item</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
