export const packingCategories = [
  { id: 'documents', name: 'Documents', icon: 'FileText', items: [
    { id: 1, name: 'Passport', packed: true }, { id: 2, name: 'Travel Insurance', packed: true }, { id: 3, name: 'Flight Tickets', packed: false },
    { id: 4, name: 'Hotel Reservations', packed: true }, { id: 5, name: 'Visa Documents', packed: false }, { id: 6, name: "Driver's License", packed: true }, { id: 7, name: 'Emergency Contacts', packed: true }
  ]},
  { id: 'clothing', name: 'Clothing', icon: 'Shirt', items: [
    { id: 8, name: 'T-Shirts (5)', packed: false }, { id: 9, name: 'Pants/Jeans (3)', packed: false }, { id: 10, name: 'Underwear (7)', packed: false },
    { id: 11, name: 'Socks (7 pairs)', packed: false }, { id: 12, name: 'Sleepwear', packed: false }, { id: 13, name: 'Light Jacket', packed: false },
    { id: 14, name: 'Swimsuit', packed: false }, { id: 15, name: 'Walking Shoes', packed: false }, { id: 16, name: 'Sandals', packed: false }
  ]},
  { id: 'electronics', name: 'Electronics', icon: 'Laptop', items: [
    { id: 17, name: 'Phone Charger', packed: true }, { id: 18, name: 'Power Bank', packed: true }, { id: 19, name: 'Camera', packed: false },
    { id: 20, name: 'Universal Adapter', packed: true }, { id: 21, name: 'Headphones', packed: false }, { id: 22, name: 'Laptop', packed: false }
  ]},
  { id: 'toiletries', name: 'Toiletries & Essentials', icon: 'Sparkles', items: [
    { id: 24, name: 'Toothbrush & Toothpaste', packed: true }, { id: 25, name: 'Shampoo & Conditioner', packed: false }, { id: 26, name: 'Deodorant', packed: false },
    { id: 27, name: 'Sunscreen', packed: false }, { id: 28, name: 'Medications', packed: true }, { id: 29, name: 'First Aid Kit', packed: true }
  ]},
  { id: 'misc', name: 'Miscellaneous', icon: 'Package', items: [
    { id: 32, name: 'Day Backpack', packed: false }, { id: 33, name: 'Travel Pillow', packed: false }, { id: 34, name: 'Eye Mask', packed: false },
    { id: 35, name: 'Earplugs', packed: false }, { id: 36, name: 'Reusable Water Bottle', packed: false }
  ]}
];

export const notes = [
  { id: 1, title: 'Paris Restaurant Recommendations', content: 'Le Comptoir du Panthéon - amazing French cuisine near the Latin Quarter. Book ahead!', tags: ['food', 'paris', 'recommendations'], createdAt: '2026-05-05T10:30:00Z', location: 'Paris, France' },
  { id: 2, title: 'Tokyo Subway Tips', content: 'Get a Suica card at the airport. JR Pass is worth it if visiting multiple cities.', tags: ['transport', 'tokyo', 'tips'], createdAt: '2026-05-03T15:45:00Z', location: 'Tokyo, Japan' },
  { id: 3, title: 'Bali Packing Reminder', content: "Bring mosquito repellent! Also, cover shoulders when visiting temples. Rent a scooter.", tags: ['bali', 'packing', 'reminders'], createdAt: '2026-05-01T09:00:00Z', location: 'Bali, Indonesia' },
  { id: 4, title: 'Budget Tracking Template', content: 'Daily budget breakdown: Accommodation $50, Food $30, Activities $25, Transport $15, Misc $10 = Total $130/day', tags: ['budget', 'planning', 'template'], createdAt: '2026-04-28T14:20:00Z', location: null }
];

export const expenses = [
  { id: 1, category: 'flights', description: 'Round trip flights to Paris', amount: 850, date: '2026-04-15' },
  { id: 2, category: 'accommodation', description: 'Hotel Le Marais (5 nights)', amount: 720, date: '2026-04-15' },
  { id: 3, category: 'food', description: 'Welcome dinner at Le Comptoir', amount: 95, date: '2026-04-16' },
  { id: 4, category: 'activities', description: 'Eiffel Tower tickets (2)', amount: 90, date: '2026-04-17' },
  { id: 5, category: 'transport', description: 'Airport transfer', amount: 45, date: '2026-04-15' },
  { id: 6, category: 'food', description: 'Lunch at Café de Flore', amount: 65, date: '2026-04-18' },
  { id: 7, category: 'shopping', description: 'Souvenirs from Rue Cler', amount: 120, date: '2026-04-19' },
  { id: 8, category: 'activities', description: 'Louvre Museum tickets (2)', amount: 50, date: '2026-04-20' }
];

export const expenseCategories = [
  { id: 'flights', name: 'Flights', icon: 'Plane', color: 'sky' },
  { id: 'accommodation', name: 'Accommodation', icon: 'Hotel', color: 'teal' },
  { id: 'food', name: 'Food & Dining', icon: 'UtensilsCrossed', color: 'orange' },
  { id: 'activities', name: 'Activities', icon: 'Map', color: 'primary' },
  { id: 'transport', name: 'Transportation', icon: 'Car', color: 'gray' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: 'pink' }
];

export const adminStats = {
  totalUsers: 24853, totalTrips: 45231, totalBookings: 89456, revenue: 1234567,
  popularCities: [
    { name: 'Paris', bookings: 4521 }, { name: 'Tokyo', bookings: 3890 }, { name: 'New York', bookings: 3654 },
    { name: 'Barcelona', bookings: 2987 }, { name: 'Bali', bookings: 2654 }, { name: 'Dubai', bookings: 2345 }
  ],
  popularActivities: [
    { name: 'City Tours', count: 12500 }, { name: 'Food Tours', count: 9800 }, { name: 'Adventure', count: 8700 },
    { name: 'Museums', count: 7600 }, { name: 'Relaxation', count: 5400 }
  ],
  userGrowth: [
    { month: 'Jan', users: 1200 }, { month: 'Feb', users: 1450 }, { month: 'Mar', users: 1680 },
    { month: 'Apr', users: 1920 }, { month: 'May', users: 2150 }, { month: 'Jun', users: 2340 }
  ],
  revenueByMonth: [
    { month: 'Jan', revenue: 85000 }, { month: 'Feb', revenue: 92000 }, { month: 'Mar', revenue: 108000 },
    { month: 'Apr', revenue: 125000 }, { month: 'May', revenue: 142000 }, { month: 'Jun', revenue: 156000 }
  ]
};
