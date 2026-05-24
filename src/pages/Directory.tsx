import { useState, useMemo } from 'react';
import { Search, MapPin, Phone, CheckCircle, Sparkles, ExternalLink, Plus, Navigation } from 'lucide-react';
import { businesses, type Business } from '../data/businesses';

const categories = ['All', 'Restaurants', 'Grocery', 'Professional Services', 'Healthcare', 'Wedding', 'Education', 'Religious', 'Retail', 'Beauty', 'Home Services'];
const cities = ['All Cities', 'Cary', 'Morrisville', 'Raleigh', 'Durham', 'Charlotte', 'Apex', 'Chapel Hill', 'Holly Springs'];

function getGoogleMapsUrl(name: string, address: string): string {
  const query = encodeURIComponent(`${name}, ${address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function getDirectionsUrl(address: string): string {
  const query = encodeURIComponent(address);
  return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
}

function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export default function Directory() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeCity, setActiveCity] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return businesses.filter((b: Business) => {
      const matchCat = activeCategory === 'All' || b.category === activeCategory;
      const matchCity = activeCity === 'All Cities' || b.city === activeCity;
      const matchSearch = !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchCity && matchSearch;
    });
  }, [activeCategory, activeCity, searchQuery]);

  const featuredPartners = filtered.filter((b: Business) => b.sponsorshipTier === 'founding' || b.sponsorshipTier === 'premium' || b.sponsorshipTier === 'corridor');
  const regularListings = filtered.filter((b: Business) => !b.sponsorshipTier || b.sponsorshipTier === 'free' || b.sponsorshipTier === 'basic' || b.sponsorshipTier === 'professional');

  return (
    <div className="min-h-[100dvh] bg-[#FAF6F1]">
      {/* Hero */}
      <section className="relative bg-[#08574D] pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto relative">
          <p className="text-[#C8A84E] text-xs font-semibold uppercase tracking-[2px] mb-3">Discover</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Business Directory
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mb-8">
            Find trusted Indian and South Asian businesses across North Carolina. Click any address for directions or phone number to call.
          </p>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4621A]" />
            <input type="text" placeholder="Search businesses, categories, tags..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-14 pl-12 pr-4 rounded-xl bg-white/95 text-[#1E2328] placeholder-[#6B6865] focus:outline-none focus:ring-2 focus:ring-[#D4621A] text-base" />
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-[72px] z-30 bg-[#FAF6F1] border-b border-[#D4621A]/10 px-4 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-[#0A7B6D] text-white' : 'bg-white text-[#1E2328] border border-gray-200 hover:border-[#0A7B6D]'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {cities.map((city) => (
              <button key={city} onClick={() => setActiveCity(city)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeCity === city ? 'bg-[#D4621A] text-white' : 'bg-white/80 text-[#6B6865] border border-gray-200 hover:border-[#D4621A]'}`}>
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#6B6865]">{filtered.length} business{filtered.length !== 1 ? 'es' : ''} found</p>
          <a href="#/submit" className="px-4 py-2 bg-[#D4621A] text-white rounded-lg text-sm font-semibold hover:bg-[#b85214] transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Submit a Business
          </a>
        </div>

        {featuredPartners.length > 0 && (
          <div className="mb-10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C8A84E] mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Featured Partners
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredPartners.map((b) => <BusinessCard key={b.id} business={b} />)}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regularListings.map((b) => <BusinessCard key={b.id} business={b} />)}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-[#6B6865]">No businesses match your filters.</p>
            <button onClick={() => { setActiveCategory('All'); setActiveCity('All Cities'); setSearchQuery(''); }} className="mt-4 text-[#D4621A] font-medium hover:underline">Clear all filters</button>
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="bg-[#FFF3E8] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="w-10 h-10 text-[#D4621A] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-[#1E2328] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>List Your Business</h2>
          <p className="text-[#6B6865] mb-8 max-w-xl mx-auto">Join {businesses.length}+ South Asian businesses already connecting with NC's Indian community</p>
          <a href="#/submit" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D4621A] text-white rounded-lg font-semibold hover:bg-[#b85214] transition-colors">
            <Plus className="w-5 h-5" /> Add Your Business — Free
          </a>
        </div>
      </section>
    </div>
  );
}

function BusinessCard({ business }: { business: Business }) {
  const isPremium = business.sponsorshipTier === 'founding' || business.sponsorshipTier === 'premium' || business.sponsorshipTier === 'corridor';
  const mapsUrl = getGoogleMapsUrl(business.name, business.address);
  const directionsUrl = getDirectionsUrl(business.address);
  const telUrl = `tel:${cleanPhone(business.phone)}`;

  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${isPremium ? 'ring-2 ring-[#C8A84E]/40' : ''}`}>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 bg-[#0A7B6D]/10 text-[#0A7B6D] text-xs font-medium rounded-full">{business.category}</span>
          {business.verified && <span className="flex items-center gap-1 text-[#0A7B6D] text-xs font-medium"><CheckCircle className="w-3.5 h-3.5" /> Verified</span>}
        </div>

        <h3 className="text-lg font-bold text-[#1E2328] mb-1">{business.name}</h3>

        {/* Clickable address — Google Maps */}
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-1.5 text-sm text-[#0A7B6D] hover:text-[#D4621A] transition-colors mt-2">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="underline underline-offset-2 decoration-[#0A7B6D]/30 group-hover:decoration-[#D4621A]">{business.address}</span>
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
        </a>

        {/* Clickable phone — Call */}
        <a href={telUrl} className="group flex items-center gap-1 text-sm text-[#0A7B6D] hover:text-[#D4621A] transition-colors mt-2">
          <Phone className="w-3.5 h-3.5" />
          <span className="underline underline-offset-2 decoration-[#0A7B6D]/30 group-hover:decoration-[#D4621A]">{business.phone}</span>
        </a>

        <p className="text-[#6B6865] text-sm mt-3 line-clamp-2">{business.description}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {business.tags.slice(0, 3).map((tag) => <span key={tag} className="px-2 py-0.5 bg-[#FAF6F1] text-[#6B6865] text-xs rounded-full">{tag}</span>)}
        </div>

        <div className="flex gap-2 mt-4">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex-1 px-3 py-2 bg-[#0A7B6D] text-white rounded-lg text-xs font-semibold hover:bg-[#08574D] transition-colors flex items-center justify-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> View on Maps
          </a>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-[#D4621A] text-white rounded-lg text-xs font-semibold hover:bg-[#b85214] transition-colors flex items-center justify-center" title="Get Directions">
            <Navigation className="w-3.5 h-3.5" />
          </a>
          <a href={telUrl} className="px-3 py-2 border border-[#0A7B6D] text-[#0A7B6D] rounded-lg text-xs font-semibold hover:bg-[#0A7B6D] hover:text-white transition-colors flex items-center justify-center" title="Call Now">
            <Phone className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
