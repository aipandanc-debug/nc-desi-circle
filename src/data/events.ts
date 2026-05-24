export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  expectedAttendance: number;
  category: 'Cultural Festival' | 'Religious' | 'Professional' | 'Food' | 'Youth' | 'Sports' | 'Charity' | 'Wedding';
  description: string;
  image: string;
  ticketPrice: string;
  organizer: string;
  featured: boolean;
  sponsorshipTiers?: string[];
}

export const events: Event[] = [
  { id: '1', name: 'Hum Sub Diwali Festival', date: '2026-10-24', time: '4:00 PM - 10:00 PM', venue: 'Koka Booth Amphitheatre', city: 'Cary', expectedAttendance: 30000, category: 'Cultural Festival', description: 'The largest Diwali celebration in the Southeast. 30,000+ attendees, fireworks, performances, food vendors, and cultural exhibits.', image: '/event-diwali.jpg', ticketPrice: 'Free', organizer: 'Hum Sub', featured: true, sponsorshipTiers: ['Title $25K', 'Platinum $10K', 'Gold $5K', 'Silver $2.5K'] },
  { id: '2', name: 'Festival of India Charlotte', date: '2026-09-19', time: '11:00 AM - 8:00 PM', venue: 'Uptown Charlotte / Tryon Street', city: 'Charlotte', expectedAttendance: 25000, category: 'Cultural Festival', description: 'Charlotte\'s premier Indian cultural festival. Parade, performances, food, arts & crafts. Mayor proclaims India Day.', image: '/event-festival.jpg', ticketPrice: 'Free', organizer: 'India Association of Charlotte', featured: true, sponsorshipTiers: ['Title $20K', 'Presenting $10K', 'Gold $5K'] },
  { id: '3', name: 'Nuv Yug India Fest', date: '2026-08-15', time: '10:00 AM - 6:00 PM', venue: 'Moore Square', city: 'Raleigh', expectedAttendance: 10000, category: 'Cultural Festival', description: 'Raleigh\'s vibrant celebration of Indian Independence Day. Music, dance, food vendors, and community booths.', image: '/event-festival.jpg', ticketPrice: 'Free', organizer: 'Nuv Yug Cultural Organization', featured: false },
  { id: '4', name: 'HSNC Navratri Garba', date: '2026-10-10', time: '7:00 PM - 11:00 PM', venue: 'Hindu Society of NC', city: 'Morrisville', expectedAttendance: 5000, category: 'Religious', description: '9 nights of Garba and Dandiya. Live music, traditional dance, prasad, and community celebration.', image: '/event-diwali.jpg', ticketPrice: '$75 suggested donation', organizer: 'Hindu Society of NC', featured: true },
  { id: '5', name: 'Morrisville Holi Festival', date: '2026-03-14', time: '11:00 AM - 3:00 PM', venue: 'Church Street Park', city: 'Morrisville', expectedAttendance: 4000, category: 'Cultural Festival', description: 'Town of Morrisville\'s official Holi celebration. Color throws, music, food trucks, family activities.', image: '/event-holi.jpg', ticketPrice: 'Free', organizer: 'Town of Morrisville', featured: true },
  { id: '6', name: 'TiE Carolinas Business Summit', date: '2026-11-06', time: '8:30 AM - 5:00 PM', venue: 'Raleigh Convention Center', city: 'Raleigh', expectedAttendance: 500, category: 'Professional', description: 'Premier entrepreneurship summit. Keynotes, workshops, networking, pitch competition.', image: '/featured-services.jpg', ticketPrice: '$150', organizer: 'TiE Carolinas', featured: false },
  { id: '7', name: 'Triangle Cricket League Finals', date: '2026-08-22', time: '9:00 AM - 5:00 PM', venue: 'Church Street Park', city: 'Morrisville', expectedAttendance: 800, category: 'Sports', description: 'Championship match of the Triangle Cricket League. Family-friendly atmosphere, food stalls.', image: '/city-morrisville.jpg', ticketPrice: 'Free', organizer: 'Triangle Cricket League', featured: false },
  { id: '8', name: 'Carolina Desi Wedding Expo', date: '2026-01-25', time: '12:00 PM - 6:00 PM', venue: 'Hilton Charlotte University Place', city: 'Charlotte', expectedAttendance: 1500, category: 'Wedding', description: 'The ultimate South Asian wedding expo. 50+ vendors, fashion shows, tastings, giveaways.', image: '/partner-wedding.jpg', ticketPrice: '$15', organizer: 'Sonaa Weddings', featured: false },
];
