import { useState } from 'react';
import { motion } from 'framer-motion';
import { StickyNote, Plus, Search, Edit2, Trash2, Tag, MapPin, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import Modal from '../components/Modal';

export default function Notes() {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', tags: '', location: '' });

  const filteredNotes = state.notes.filter(note => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query) || note.tags.some(tag => tag.toLowerCase().includes(query));
    }
    return true;
  });

  const openAddModal = () => { setFormData({ title: '', content: '', tags: '', location: '' }); setEditingNote(null); setShowAddModal(true); };
  const openEditModal = (note) => {
    setFormData({ title: note.title, content: note.content, tags: note.tags.join(', '), location: note.location || '' });
    setEditingNote(note); setShowAddModal(true);
  };

  const handleSubmit = () => {
    const noteData = {
      title: formData.title, content: formData.content,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      location: formData.location || null,
      createdAt: editingNote ? editingNote.createdAt : new Date().toISOString()
    };
    if (editingNote) dispatch({ type: 'UPDATE_NOTE', payload: { ...noteData, id: editingNote.id } });
    else dispatch({ type: 'ADD_NOTE', payload: { ...noteData, id: Date.now() } });
    setShowAddModal(false); setEditingNote(null);
  };

  const deleteNote = (noteId) => { if (confirm('Delete this note?')) dispatch({ type: 'DELETE_NOTE', payload: noteId }); };
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Travel Notes</h1>
          <p className="text-gray-500">Capture your travel memories and tips</p>
        </div>
        <Button icon={Plus} onClick={openAddModal}>Add Note</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search notes..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
      </div>

      {filteredNotes.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note, i) => (
            <motion.div key={note.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card p-5 group hover:shadow-soft-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-teal-100 flex items-center justify-center">
                  <StickyNote className="w-5 h-5 text-primary-500" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(note)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                  <button onClick={() => deleteNote(note.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{note.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">{note.content}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(note.createdAt)}</div>
                {note.location && <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{note.location}</div>}
              </div>
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs flex items-center gap-1">
                      <Tag className="w-3 h-3" />{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <StickyNote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No notes found</h3>
          <p className="text-gray-500 mb-4">{searchQuery ? 'Try adjusting your search' : 'Start capturing your travel memories'}</p>
          {searchQuery ? <Button variant="secondary" onClick={() => setSearchQuery('')}>Clear Search</Button> : <Button icon={Plus} onClick={openAddModal}>Create First Note</Button>}
        </div>
      )}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={editingNote ? 'Edit Note' : 'Add New Note'} size="md">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input-field" placeholder="Give your note a title" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label><textarea rows="5" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="input-field resize-none" placeholder="Write your note here..." /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (comma-separated)</label><div className="relative"><Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="input-field pl-12" placeholder="food, paris, recommendations" /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Location (optional)</label><div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="input-field pl-12" placeholder="Paris, France" /></div></div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSubmit} className="flex-1">{editingNote ? 'Update' : 'Create'} Note</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
