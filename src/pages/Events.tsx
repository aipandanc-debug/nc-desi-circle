import { useState, useMemo } from 'react';
import { Calendar, MapPin, Users, ChevronLeft, ChevronRight, Ticket, HeartHandshake, Church, Briefcase, UtensilsCrossed, Sparkles, Trophy } from 'lucide-react';
import { events, type Event } from '../data/events';

const categories = ['All', 'Cultural Festival', 'Religious', 'Professional', 'Food', 'Youth', 'Sports', 'Charity', 'Wedding'];
const cities = ['All Cities', 'Cary', 'Morrisville', 'Raleigh', 'Durham', 'Charlotte'];

const catIcons: Record<string, React.ReactNode> = {
  'Cultural Festival': <Sparkles className="w-5 h-5" />,
  'Religious': <Church className="w-5 h-5" />,
  'Professional': <Briefcase className="w-5 h-5" />,
  'Food': <UtensilsCrossed className="w-5 h-5" />,
  'Youth': <Users className="w-5 h-5" />,
  'Sports': <Trophy className="w-5 h-5" />,
  'Charity': <HeartHandshake className="w-5 h-5" />,
  'Wedding': <HeartHandshake className="w-5 h-5" />,
};

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Events() {
  const [currentMonth, setCurrentMonth] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeCity, setActiveCity] = useState('All Cities');

  const filtered = useMemo(() => {
    return events.filter((e: Event) => {
      const d = new Date(e.date);
      const matchMonth = currentMonth === null || d.getMonth() === currentMonth;
      const matchCat = activeCategory === 'All' || e.category === activeCategory;
      const matchCity = activeCity === 'All Cities' || e.city === activeCity;
      return matchMonth && matchCat && matchCity;
    });
  }, [currentMonth, activeCategory, activeCity]);

  const featured = filtered.filter((e: Event) => e.featured);
  const regular = filtered.filter((e: Event) => !e.featured);

  return (
    <div className="min-h-[100dvh] bg-[#FAF6F1]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#6B1A1A] to-[#1E2328] pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto relative z-10">
          <p className="text-[#C8A84E] text-xs font-semibold uppercase tracking-[2px] mb-3">Upcoming</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Events & Festivals</h1>
          <p className="text-white/70 text-lg max-w-2xl">Discover celebrations, performances, and gatherings across North Carolina's Indian community</p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-[72px] z-30 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 mr-4">
            <button onClick={() => { if (currentMonth === null) { setCurrentMonth(11); } else { setCurrentMonth((m) => (m === 0 ? 11 : (m ?? 0) - 1)); } }} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm font-semibold text-[#1E2328] w-32 text-center">{currentMonth === null ? 'All Months' : monthNames[currentMonth] + ' 2026'}</span>
            <button onClick={() => { if (currentMonth === null) { setCurrentMonth(0); } else { setCurrentMonth((m) => (m === 11 ? 0 : (m ?? 0) + 1)); } }} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
          <select value={activeCity} onChange={(e) => setActiveCity(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">{cities.map(c => <option key={c} value={c}>{c}</option>)}</select>
          {currentMonth !== null && <button onClick={() => setCurrentMonth(null)} className="text-xs text-[#D4621A] font-medium hover:underline">Clear month filter</button>}
          <a href="#/submit" className="ml-auto px-5 py-2 bg-[#D4621A] text-white rounded-lg text-sm font-semibold hover:bg-[#b85214] transition-colors">Submit an Event</a>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {featured.length > 0 && (
          <div className="mb-12">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C8A84E] mb-4">Featured</h3>
            {featured.map((event: Event) => (
              <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-lg md:flex hover:shadow-xl transition-shadow">
                <div className="md:w-3/5 h-64 md:h-auto relative overflow-hidden">
                  <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-[#C8A84E] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">Featured</div>
                </div>
                <div className="md:w-2/5 p-8 flex flex-col justify-center">
                  <span className="px-3 py-1 bg-[#6B1A1A]/10 text-[#6B1A1A] text-xs font-semibold rounded-full w-fit mb-3">{event.category}</span>
                  <h2 className="text-2xl font-bold text-[#1E2328] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{event.name}</h2>
                  <div className="space-y-2 text-sm text-[#6B6865] mb-4">
                    <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#D4621A]" /> {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {event.time}</p>
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#D4621A]" /> {event.venue}, {event.city}</p>
                    <p className="flex items-center gap-2"><Users className="w-4 h-4 text-[#D4621A]" /> {event.expectedAttendance.toLocaleString()}+ expected</p>
                    <p className="flex items-center gap-2"><Ticket className="w-4 h-4 text-[#D4621A]" /> {event.ticketPrice === 'Free' ? 'Free Admission' : event.ticketPrice}</p>
                  </div>
                  <p className="text-[#6B6865] text-sm mb-6">{event.description}</p>
                  <div className="flex gap-3">
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue + ' ' + event.city + ' NC')}`} target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-[#D4621A] text-white rounded-lg font-semibold text-sm hover:bg-[#b85214] transition-colors">Get Directions</a>
                    <a href="#/submit" className="px-6 py-2.5 border border-[#0A7B6D] text-[#0A7B6D] rounded-lg font-semibold text-sm hover:bg-[#0A7B6D] hover:text-white transition-colors">Learn More</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regular.map((event: Event) => {
              const d = new Date(event.date);
              const monthStr = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
              return (
                <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                  <div className="relative h-44 overflow-hidden">
                    <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-[#D4621A] text-white text-center px-3 py-2 rounded-lg min-w-[52px]">
                      <p className="text-xs font-bold uppercase">{monthStr}</p>
                      <p className="text-xl font-bold leading-tight">{d.getDate()}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="px-2.5 py-0.5 bg-[#6B1A1A]/10 text-[#6B1A1A] text-xs font-medium rounded-full">{event.category}</span>
                    <h3 className="text-lg font-bold text-[#1E2328] mt-2 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>{event.name}</h3>
                    <div className="space-y-1 text-sm text-[#6B6865]">
                      <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#D4621A]" /> {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {event.time}</p>
                      <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#D4621A]" /> {event.venue}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#0A7B6D]" /> {event.expectedAttendance.toLocaleString()}</span>
                        <span className="text-[#0A7B6D] font-semibold">{event.ticketPrice === 'Free' ? 'Free' : event.ticketPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 text-[#6B6865]/30 mx-auto mb-4" />
            <p className="text-xl text-[#6B6865]">{currentMonth === null ? 'No events match your filters.' : `No events found for ${monthNames[currentMonth]} 2026`}</p>
          </div>
        )}

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-[#1E2328] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Browse by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.filter(c => c !== 'All').map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className="p-5 bg-white rounded-xl text-left hover:shadow-md hover:-translate-y-0.5 transition-all border border-gray-100">
                <div className="w-10 h-10 bg-[#FFF3E8] rounded-lg flex items-center justify-center text-[#D4621A] mb-3">{catIcons[cat]}</div>
                <p className="font-semibold text-[#1E2328] text-sm">{cat}</p>
                <p className="text-xs text-[#6B6865] mt-1">{events.filter((e: Event) => e.category === cat).length} events</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sponsor CTA */}
      <section className="bg-[#08574D] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Become a Sponsor</h2>
          <p className="text-white/70 mb-8">Put your brand in front of North Carolina's most engaged South Asian community</p>
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="text-center"><p className="text-3xl font-bold text-[#C8A84E]">50K+</p><p className="text-sm text-white/60">Annual Attendees</p></div>
            <div className="text-center"><p className="text-3xl font-bold text-[#C8A84E]">98</p><p className="text-sm text-white/60">Events Per Year</p></div>
            <div className="text-center"><p className="text-3xl font-bold text-[#C8A84E]">8</p><p className="text-sm text-white/60">Categories</p></div>
          </div>
          <a href="#/submit" className="inline-block px-8 py-3.5 bg-[#C8A84E] text-[#1E2328] rounded-lg font-semibold hover:bg-[#b8983e] transition-colors">View Sponsorship Packages</a>
        </div>
      </section>
    </div>
  );
}
