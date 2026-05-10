import { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const AppContext = createContext();

const initialState = {
  user: null,
  trips: [],
  packingList: [],
  notes: [],
  destinations: [],
  activities: [],
  expenses: [],
  communityPosts: [],
  notifications: [],
  sidebarOpen: true,
  mobileMenuOpen: false,
  loading: false,
  isAuthenticated: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload, loading: false };
    case 'SET_TRIPS':
      return { ...state, trips: action.payload };
    case 'ADD_TRIP':
      return { ...state, trips: [...state.trips, action.payload] };
    case 'UPDATE_TRIP':
      return { ...state, trips: state.trips.map(trip => trip.id === action.payload.id ? { ...trip, ...action.payload } : trip) };
    case 'DELETE_TRIP':
      return { ...state, trips: state.trips.filter(trip => trip.id !== action.payload) };
    case 'SET_PACKING_LIST':
      return { ...state, packingList: action.payload };
    case 'TOGGLE_PACKED_ITEM':
      return {
        ...state,
        packingList: state.packingList.map(category => ({
          ...category,
          items: category.items.map(item =>
            item.id === action.payload ? { ...item, packed: !item.is_packed } : item
          )
        }))
      };
    case 'ADD_PACKING_ITEM':
      return {
        ...state,
        packingList: state.packingList.map(category =>
          category.id === action.payload.categoryId
            ? { ...category, items: [...category.items, action.payload.item] }
            : category
        )
      };
    case 'REMOVE_PACKING_ITEM':
      return {
        ...state,
        packingList: state.packingList.map(category => ({
          ...category,
          items: category.items.filter(item => item.id !== action.payload)
        }))
      };
    case 'RESET_PACKING_LIST':
      return {
        ...state,
        packingList: state.packingList.map(category => ({
          ...category,
          items: category.items.map(item => ({ ...item, packed: false }))
        }))
      };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };
    case 'UPDATE_NOTE':
      return { ...state, notes: state.notes.map(note => note.id === action.payload.id ? { ...note, ...action.payload } : note) };
    case 'DELETE_NOTE':
      return { ...state, notes: state.notes.filter(note => note.id !== action.payload) };
    case 'SET_DESTINATIONS':
      return { ...state, destinations: action.payload };
    case 'SET_ACTIVITIES':
      return { ...state, activities: action.payload };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'SET_COMMUNITY_POSTS':
      return { ...state, communityPosts: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'MARK_NOTIFICATION_READ':
      return { ...state, notifications: state.notifications.map(notif => notif.id === action.payload ? { ...notif, read: true } : notif) };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'TOGGLE_MOBILE_MENU':
      return { ...state, mobileMenuOpen: !state.mobileMenuOpen };
    case 'CLOSE_MOBILE_MENU':
      return { ...state, mobileMenuOpen: false };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const response = await api.get('/auth/profile/');
          dispatch({ type: 'SET_USER', payload: response.data });
          fetchUserData();
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };
    initAuth();
  }, []);

  const fetchUserData = async () => {
    try {
      const [tripsRes, packingRes, notesRes, expensesRes] = await Promise.all([
        api.get('/trips/'),
        api.get('/packing/'),
        api.get('/notes/'),
        api.get('/expenses/'),
      ]);
      dispatch({ type: 'SET_TRIPS', payload: tripsRes.data });
      dispatch({ type: 'SET_PACKING_LIST', payload: transformPackingData(packingRes.data) });
      dispatch({ type: 'SET_NOTES', payload: notesRes.data });
      dispatch({ type: 'SET_EXPENSES', payload: expensesRes.data });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const transformPackingData = (items) => {
    const categories = ['documents', 'clothing', 'electronics', 'toiletries', 'misc'];
    return categories.map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      icon: cat === 'documents' ? 'FileText' : cat === 'clothing' ? 'Shirt' : cat === 'electronics' ? 'Laptop' : cat === 'toiletries' ? 'Sparkles' : 'Package',
      items: items.filter(i => i.category === cat)
    }));
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login/', { email, password });
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    const userResponse = await api.get('/auth/profile/');
    dispatch({ type: 'SET_USER', payload: userResponse.data });
    await fetchUserData();
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register/', userData);
    if (response.data) {
      await login(userData.email, userData.password);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    dispatch({ type: 'LOGOUT' });
  };

  const createTrip = async (tripData) => {
    const response = await api.post('/trips/', tripData);
    dispatch({ type: 'ADD_TRIP', payload: response.data });
    return response.data;
  };

  const updateTrip = async (id, tripData) => {
    const response = await api.put(`/trips/${id}/`, tripData);
    dispatch({ type: 'UPDATE_TRIP', payload: response.data });
    return response.data;
  };

  const deleteTrip = async (id) => {
    await api.delete(`/trips/${id}/`);
    dispatch({ type: 'DELETE_TRIP', payload: id });
  };

  const togglePackedItem = async (id) => {
    const item = state.packingList.flatMap(c => c.items).find(i => i.id === id);
    if (item) {
      await api.patch(`/packing/${id}/`, { is_packed: !item.is_packed });
      dispatch({ type: 'TOGGLE_PACKED_ITEM', payload: id });
    }
  };

  const addNote = async (noteData) => {
    const response = await api.post('/notes/', noteData);
    dispatch({ type: 'ADD_NOTE', payload: response.data });
    return response.data;
  };

  const updateNote = async (id, noteData) => {
    const response = await api.put(`/notes/${id}/`, noteData);
    dispatch({ type: 'UPDATE_NOTE', payload: response.data });
    return response.data;
  };

  const deleteNote = async (id) => {
    await api.delete(`/notes/${id}/`);
    dispatch({ type: 'DELETE_NOTE', payload: id });
  };

  const addExpense = async (expenseData) => {
    const response = await api.post('/expenses/', expenseData);
    dispatch({ type: 'ADD_EXPENSE', payload: response.data });
    return response.data;
  };

  const getPackingProgress = () => {
    const allItems = state.packingList.flatMap(c => c.items);
    const totalItems = allItems.length;
    const packedItems = allItems.filter(item => item.is_packed).length;
    return totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;
  };

  const getTripStats = () => ({
    total: state.trips.length,
    upcoming: state.trips.filter(t => t.status === 'upcoming').length,
    ongoing: state.trips.filter(t => t.status === 'ongoing').length,
    completed: state.trips.filter(t => t.status === 'completed').length,
    planning: state.trips.filter(t => t.status === 'planning').length
  });

  const getUnreadNotifications = () => state.notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      login,
      register,
      logout,
      createTrip,
      updateTrip,
      deleteTrip,
      togglePackedItem,
      addNote,
      updateNote,
      deleteNote,
      addExpense,
      getPackingProgress,
      getTripStats,
      getUnreadNotifications,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}