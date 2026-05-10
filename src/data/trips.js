export const trips = [
  {
    id: 1, name: 'European Summer Adventure', destination: 'Paris, Barcelona, Rome',
    coverImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
    startDate: '2026-07-15', endDate: '2026-07-28', budget: 5500, spent: 4200, travelers: 2, status: 'upcoming',
    description: 'A two-week journey through the most iconic European cities, experiencing art, culture, and gastronomy.',
    itinerary: [
      { city: 'Paris', country: 'France', startDate: '2026-07-15', endDate: '2026-07-20', activities: [{ name: 'Eiffel Tower Visit', cost: 45, duration: '3 hours' }, { name: 'Louvre Museum Tour', cost: 25, duration: '4 hours' }], budget: 1500, notes: 'Morning visits to avoid crowds.' },
      { city: 'Barcelona', country: 'Spain', startDate: '2026-07-21', endDate: '2026-07-24', activities: [{ name: 'Sagrada Familia Tour', cost: 35, duration: '2 hours' }, { name: 'Park Güell Visit', cost: 10, duration: '3 hours' }], budget: 1200, notes: 'Tapas crawl on Las Ramblas at night.' },
      { city: 'Rome', country: 'Italy', startDate: '2026-07-25', endDate: '2026-07-28', activities: [{ name: 'Colosseum Skip-the-Line', cost: 60, duration: '3 hours' }, { name: 'Trastevere Food Walk', cost: 40, duration: '3 hours' }], budget: 1300, notes: 'Free walking tours available daily.' }
    ]
  },
  {
    id: 2, name: 'Tokyo Cherry Blossom', destination: 'Tokyo, Kyoto, Osaka',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    startDate: '2026-03-20', endDate: '2026-04-03', budget: 4800, spent: 4650, travelers: 2, status: 'completed',
    description: "Experience the magic of sakura season in Japan, from bustling Tokyo to ancient Kyoto.",
    itinerary: [
      { city: 'Tokyo', country: 'Japan', startDate: '2026-03-20', endDate: '2026-03-26', activities: [{ name: 'Senso-ji Temple Visit', cost: 0, duration: '2 hours' }, { name: 'Tsukiji Fish Market', cost: 60, duration: '3 hours' }], budget: 1800, notes: 'Best cherry blossom spots: Ueno Park, Meguro River.' },
      { city: 'Kyoto', country: 'Japan', startDate: '2026-03-27', endDate: '2026-03-31', activities: [{ name: 'Fushimi Inari Shrine', cost: 0, duration: '3 hours' }, { name: 'Tea Ceremony Experience', cost: 40, duration: '1.5 hours' }], budget: 1200, notes: 'Rent kimono for photos in Gion district.' },
      { city: 'Osaka', country: 'Japan', startDate: '2026-04-01', endDate: '2026-04-03', activities: [{ name: 'Osaka Castle Visit', cost: 15, duration: '2 hours' }, { name: 'Dotonbori Food Tour', cost: 50, duration: '3 hours' }], budget: 1400, notes: 'Try takoyaki and okonomiyaki at Dotonbori.' }
    ]
  },
  {
    id: 3, name: 'Bali Wellness Retreat', destination: 'Bali',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    startDate: '2026-05-01', endDate: '2026-05-10', budget: 2200, spent: 2100, travelers: 1, status: 'ongoing',
    description: "A healing journey through Bali's temples, rice terraces, and pristine beaches.",
    itinerary: [
      { city: 'Ubud', country: 'Indonesia', startDate: '2026-05-01', endDate: '2026-05-05', activities: [{ name: 'Yoga Retreat Session', cost: 30, duration: '2 hours' }, { name: 'Tegallalang Rice Terraces', cost: 10, duration: '3 hours' }], budget: 800, notes: 'Book spa treatments in advance.' },
      { city: 'Seminyak', country: 'Indonesia', startDate: '2026-05-06', endDate: '2026-05-10', activities: [{ name: 'Beach Club Day Pass', cost: 50, duration: '6 hours' }, { name: 'Surfing Lesson', cost: 45, duration: '2 hours' }], budget: 900, notes: 'Best sunset spots at Potato Head Beach Club.' }
    ]
  },
  {
    id: 4, name: 'New York City Explorer', destination: 'New York',
    coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
    startDate: '2025-12-20', endDate: '2025-12-28', budget: 4000, spent: 3850, travelers: 3, status: 'completed',
    description: 'A magical Christmas in NYC - Times Square, Central Park, Broadway shows, and more.',
    itinerary: [{ city: 'New York', country: 'United States', startDate: '2025-12-20', endDate: '2025-12-28', activities: [{ name: 'Statue of Liberty Tour', cost: 25, duration: '4 hours' }, { name: 'Broadway Show', cost: 150, duration: '3 hours' }], budget: 3500, notes: 'Ice skating at Rockefeller Center.' }]
  },
  { id: 5, name: 'Dubai Luxury Getaway', destination: 'Dubai',
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    startDate: '2026-08-10', endDate: '2026-08-17', budget: 6000, spent: 0, travelers: 2, status: 'planning',
    description: 'Experience the opulence of Dubai - from Burj Khalifa to desert safaris.', itinerary: []
  },
  {
    id: 6, name: 'Iceland Northern Lights', destination: 'Reykjavik, Vik',
    coverImage: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80',
    startDate: '2026-09-15', endDate: '2026-09-22', budget: 4500, spent: 0, travelers: 2, status: 'planning',
    description: "Hunt for the Northern Lights and explore Iceland's dramatic landscapes.", itinerary: []
  }
];

export const getTripById = (id) => trips.find(trip => trip.id === parseInt(id));
export const getTripsByStatus = (status) => trips.filter(trip => trip.status === status);
