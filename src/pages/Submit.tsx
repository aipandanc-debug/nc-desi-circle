import { useState } from 'react';
import {
  Link,
  MapPin,
  Star,
  Camera,
  Facebook,
  Globe,
  Building2,
  CalendarDays,
  Zap,
  Send,
  CheckCircle,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TabKey = 'quick' | 'business' | 'event';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const BUSINESS_CATEGORIES = [
  'Restaurants',
  'Grocery',
  'Professional Services',
  'Healthcare',
  'Wedding',
  'Education',
  'Religious',
  'Retail',
  'Beauty',
  'Home Services',
] as const;

const EVENT_CATEGORIES = [
  'Cultural Festival',
  'Religious',
  'Professional',
  'Food',
  'Youth',
  'Sports',
  'Charity',
  'Wedding',
] as const;

const CITIES = [
  'Cary',
  'Morrisville',
  'Raleigh',
  'Durham',
  'Chapel Hill',
  'Charlotte',
  'Apex',
  'Holly Springs',
] as const;

/* ------------------------------------------------------------------ */
/*  Utility helpers                                                    */
/* ------------------------------------------------------------------ */

function detectSource(url: string): { source: string; icon: string } {
  if (url.includes('google.com/maps') || url.includes('maps.app.goo.gl')) return { source: 'Google Maps', icon: 'map' };
  if (url.includes('yelp.com')) return { source: 'Yelp', icon: 'star' };
  if (url.includes('instagram.com')) return { source: 'Instagram', icon: 'camera' };
  if (url.includes('facebook.com')) return { source: 'Facebook', icon: 'facebook' };
  return { source: 'Website', icon: 'globe' };
}

function extractFromUrl(url: string): Record<string, string> {
  const extracted: Record<string, string> = {};
  try {
    const urlObj = new URL(url);
    if (url.includes('google.com/maps/place')) {
      const pathParts = urlObj.pathname.split('/');
      const placePart = pathParts.find((p) => p && !['', 'maps', 'place'].includes(p));
      if (placePart) {
        extracted.name = decodeURIComponent(placePart.replace(/\+/g, ' '));
      }
      const query = urlObj.searchParams.get('query');
      if (query) {
        const parts = query.split(',').map((s) => s.trim());
        if (parts.length > 1) {
          extracted.address = parts.slice(0, -1).join(', ');
          extracted.city = parts[parts.length - 1];
        }
      }
    }
  } catch { /* ignore */ }
  return extracted;
}

function guessCategory(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('restaurant') || lower.includes('biryani') || lower.includes('dosa') || lower.includes('chaat') || lower.includes('grill') || lower.includes('kitchen') || lower.includes('cafe')) return 'Restaurants';
  if (lower.includes('market') || lower.includes('grocery') || lower.includes('bazaar') || lower.includes('foods')) return 'Grocery';
  if (lower.includes('temple') || lower.includes('mandir') || lower.includes('mosque') || lower.includes('gurdwara')) return 'Religious';
  if (lower.includes('photo') || lower.includes('wedding') || lower.includes('bridal') || lower.includes('mehndi')) return 'Wedding';
  if (lower.includes('dental') || lower.includes('medical') || lower.includes('health') || lower.includes('clinic')) return 'Healthcare';
  if (lower.includes('tax') || lower.includes('law') || lower.includes('realty') || lower.includes('insurance') || lower.includes('advisor')) return 'Professional Services';
  return 'Retail';
}

/* ------------------------------------------------------------------ */
/*  Source icon renderer                                               */
/* ------------------------------------------------------------------ */

function SourceIcon({ icon, className = 'w-4 h-4' }: { icon: string; className?: string }) {
  switch (icon) {
    case 'map': return <MapPin className={className} />;
    case 'star': return <Star className={className} />;
    case 'camera': return <Camera className={className} />;
    case 'facebook': return <Facebook className={className} />;
    default: return <Globe className={className} />;
  }
}

/* ------------------------------------------------------------------ */
/*  Shared input style                                                 */
/* ------------------------------------------------------------------ */

const inputCls =
  'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#1E2328] placeholder-[#6B6865]/60 focus:outline-none focus:ring-2 focus:ring-[#D4621A] focus:border-transparent transition-all text-sm';

const labelCls = 'block text-sm font-semibold text-[#1E2328] mb-1.5';

const selectCls =
  'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#1E2328] focus:outline-none focus:ring-2 focus:ring-[#D4621A] focus:border-transparent transition-all text-sm appearance-none cursor-pointer';

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export default function Submit() {
  const [activeTab, setActiveTab] = useState<TabKey>('quick');
  const [submitted, setSubmitted] = useState(false);

  /* ---- Quick Submit state ---- */
  const [url, setUrl] = useState('');
  const [sourceInfo, setSourceInfo] = useState<{ source: string; icon: string } | null>(null);
  const [fetching, setFetching] = useState(false);
  const [quickData, setQuickData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    category: '',
    website: '',
  });

  /* ---- Business state ---- */
  const [bizData, setBizData] = useState({
    name: '',
    category: '',
    city: '',
    phone: '',
    address: '',
    description: '',
    website: '',
    tags: '',
  });

  /* ---- Event state ---- */
  const [eventData, setEventData] = useState({
    name: '',
    category: '',
    date: '',
    time: '',
    venue: '',
    city: '',
    description: '',
    expectedAttendance: '',
    ticketPrice: '',
    organizer: '',
    website: '',
  });

  /* ---------------------------------------------------------------- */
  /*  Handlers                                                         */
  /* ---------------------------------------------------------------- */

  const handleUrlChange = (val: string) => {
    setUrl(val);
    setSourceInfo(val ? detectSource(val) : null);
    const extracted = extractFromUrl(val);
    if (extracted.name || extracted.address) {
      setQuickData((prev) => ({
        ...prev,
        name: extracted.name || prev.name,
        address: extracted.address || prev.address,
        city: extracted.city || prev.city,
        category: extracted.name ? guessCategory(extracted.name) : prev.category,
        website: val,
      }));
    }
  };

  const handleFetchDetails = () => {
    if (!url) return;
    setFetching(true);
    setTimeout(() => {
      const extracted = extractFromUrl(url);
      const detected = detectSource(url);
      setSourceInfo(detected);
      setQuickData((prev) => ({
        ...prev,
        name: extracted.name || prev.name || 'Sample Business Name',
        address: extracted.address || prev.address || '',
        city: extracted.city || prev.city || '',
        category: extracted.name ? guessCategory(extracted.name) : prev.category || 'Retail',
        website: url,
      }));
      setFetching(false);
    }, 800);
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleBizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizData.name) return;
    setSubmitted(true);
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventData.name) return;
    setSubmitted(true);
  };

  /* ---------------------------------------------------------------- */
  /*  Tabs config                                                      */
  /* ---------------------------------------------------------------- */

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'quick', label: 'Quick Submit via Link', icon: <Zap className="w-4 h-4" /> },
    { key: 'business', label: 'Submit Business', icon: <Building2 className="w-4 h-4" /> },
    { key: 'event', label: 'Submit Event', icon: <CalendarDays className="w-4 h-4" /> },
  ];

  /* ================================================================= */
  /*  RENDER                                                            */
  /* ================================================================= */

  if (submitted) {
    return (
      <div className="min-h-[100dvh] bg-[#FAF6F1] flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-10 text-center">
          <div className="w-16 h-16 bg-[#0A7B6D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-[#0A7B6D]" />
          </div>
          <h2
            className="text-2xl font-bold text-[#1E2328] mb-3"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Thank You!
          </h2>
          <p className="text-[#6B6865] mb-8">
            Your submission has been received and will be reviewed. We will get back to you soon!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#/directory"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0A7B6D] text-white rounded-lg font-semibold hover:bg-[#08574D] transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse Directory
            </a>
            <button
              onClick={() => {
                setSubmitted(false);
                setUrl('');
                setSourceInfo(null);
                setQuickData({ name: '', address: '', city: '', phone: '', category: '', website: '' });
                setBizData({ name: '', category: '', city: '', phone: '', address: '', description: '', website: '', tags: '' });
                setEventData({ name: '', category: '', date: '', time: '', venue: '', city: '', description: '', expectedAttendance: '', ticketPrice: '', organizer: '', website: '' });
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#D4621A] text-[#D4621A] rounded-lg font-semibold hover:bg-[#D4621A] hover:text-white transition-colors text-sm"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#FAF6F1]">
      {/* ========================== HERO ========================== */}
      <section className="relative bg-gradient-to-br from-[#08574D] to-[#1E2328] pt-28 pb-14 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#C8A84E] text-xs font-semibold uppercase tracking-[2px] mb-3">
            Contribute
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Submit to NC Desi Circle
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Help grow our community directory. Submit a business, event, or paste a link and we'll handle the rest.
          </p>
        </div>
      </section>

      {/* ========================== TABS ========================== */}
      <div className="sticky top-[72px] z-30 bg-white border-b border-gray-200 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === t.key
                  ? 'border-[#D4621A] text-[#D4621A]'
                  : 'border-transparent text-[#6B6865] hover:text-[#1E2328] hover:border-[#0A7B6D]/30'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================== CONTENT ========================== */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* -------------------- QUICK SUBMIT -------------------- */}
        {activeTab === 'quick' && (
          <form onSubmit={handleQuickSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2
                className="text-xl font-bold text-[#1E2328] mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Quick Submit via Link
              </h2>
              <p className="text-sm text-[#6B6865] mb-6">
                Paste a Google Maps, Yelp, Instagram, Facebook, or website link and we'll try to auto-fill the details.
              </p>

              {/* URL Input */}
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>
                    Paste URL <span className="text-[#D4621A]">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6865]" />
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        placeholder="https://..."
                        required
                        className={`${inputCls} pl-10`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleFetchDetails}
                      disabled={!url || fetching}
                      className="px-5 py-3 bg-[#0A7B6D] text-white rounded-xl text-sm font-semibold hover:bg-[#08574D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                    >
                      {fetching ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Fetching...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          Fetch Details
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Detected source */}
                {sourceInfo && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0A7B6D]/5 rounded-xl border border-[#0A7B6D]/10">
                    <div className="w-8 h-8 bg-[#0A7B6D]/10 rounded-lg flex items-center justify-center text-[#0A7B6D]">
                      <SourceIcon icon={sourceInfo.icon} />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B6865]">Detected source</p>
                      <p className="text-sm font-semibold text-[#0A7B6D]">{sourceInfo.source}</p>
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-[#6B6865] font-medium">Auto-filled Details</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Auto-filled fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Business Name</label>
                    <input
                      type="text"
                      value={quickData.name}
                      onChange={(e) => setQuickData({ ...quickData, name: e.target.value })}
                      className={inputCls}
                      placeholder="Business name"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Category</label>
                    <select
                      value={quickData.category}
                      onChange={(e) => setQuickData({ ...quickData, category: e.target.value })}
                      className={selectCls}
                    >
                      <option value="">Select category</option>
                      {BUSINESS_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Address</label>
                    <input
                      type="text"
                      value={quickData.address}
                      onChange={(e) => setQuickData({ ...quickData, address: e.target.value })}
                      className={inputCls}
                      placeholder="Street address"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>City</label>
                    <select
                      value={quickData.city}
                      onChange={(e) => setQuickData({ ...quickData, city: e.target.value })}
                      className={selectCls}
                    >
                      <option value="">Select city</option>
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <input
                      type="tel"
                      value={quickData.phone}
                      onChange={(e) => setQuickData({ ...quickData, phone: e.target.value })}
                      className={inputCls}
                      placeholder="(919) 000-0000"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Website</label>
                    <input
                      type="url"
                      value={quickData.website}
                      onChange={(e) => setQuickData({ ...quickData, website: e.target.value })}
                      className={inputCls}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#D4621A] text-white rounded-xl font-semibold hover:bg-[#b85214] transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  Submit for Review
                </button>
              </div>
            </div>
          </form>
        )}

        {/* -------------------- BUSINESS FORM -------------------- */}
        {activeTab === 'business' && (
          <form onSubmit={handleBizSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2
                className="text-xl font-bold text-[#1E2328] mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Submit a Business
              </h2>
              <p className="text-sm text-[#6B6865] mb-6">
                List your business in the NC Desi Circle directory. All submissions are reviewed before publishing.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelCls}>
                    Business Name <span className="text-[#D4621A]">*</span>
                  </label>
                  <input
                    type="text"
                    value={bizData.name}
                    onChange={(e) => setBizData({ ...bizData, name: e.target.value })}
                    required
                    className={inputCls}
                    placeholder="Enter business name"
                  />
                </div>

                <div>
                  <label className={labelCls}>Category</label>
                  <select
                    value={bizData.category}
                    onChange={(e) => setBizData({ ...bizData, category: e.target.value })}
                    className={selectCls}
                  >
                    <option value="">Select category</option>
                    {BUSINESS_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>City</label>
                  <select
                    value={bizData.city}
                    onChange={(e) => setBizData({ ...bizData, city: e.target.value })}
                    className={selectCls}
                  >
                    <option value="">Select city</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input
                    type="tel"
                    value={bizData.phone}
                    onChange={(e) => setBizData({ ...bizData, phone: e.target.value })}
                    className={inputCls}
                    placeholder="(919) 000-0000"
                  />
                </div>

                <div>
                  <label className={labelCls}>Website URL</label>
                  <input
                    type="url"
                    value={bizData.website}
                    onChange={(e) => setBizData({ ...bizData, website: e.target.value })}
                    className={inputCls}
                    placeholder="https://..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelCls}>Address</label>
                  <input
                    type="text"
                    value={bizData.address}
                    onChange={(e) => setBizData({ ...bizData, address: e.target.value })}
                    className={inputCls}
                    placeholder="Full street address"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelCls}>Description</label>
                  <textarea
                    value={bizData.description}
                    onChange={(e) => setBizData({ ...bizData, description: e.target.value })}
                    rows={4}
                    className={inputCls}
                    placeholder="Tell us about your business, services, and what makes it special..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelCls}>Tags</label>
                  <input
                    type="text"
                    value={bizData.tags}
                    onChange={(e) => setBizData({ ...bizData, tags: e.target.value })}
                    className={inputCls}
                    placeholder="e.g. South Indian, Vegetarian, Family Friendly (comma-separated)"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#D4621A] text-white rounded-xl font-semibold hover:bg-[#b85214] transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  Submit Business
                </button>
              </div>
            </div>
          </form>
        )}

        {/* -------------------- EVENT FORM -------------------- */}
        {activeTab === 'event' && (
          <form onSubmit={handleEventSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2
                className="text-xl font-bold text-[#1E2328] mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Submit an Event
              </h2>
              <p className="text-sm text-[#6B6865] mb-6">
                Share your event with the NC Desi community. All events are reviewed before publishing.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelCls}>
                    Event Name <span className="text-[#D4621A]">*</span>
                  </label>
                  <input
                    type="text"
                    value={eventData.name}
                    onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
                    required
                    className={inputCls}
                    placeholder="Enter event name"
                  />
                </div>

                <div>
                  <label className={labelCls}>Category</label>
                  <select
                    value={eventData.category}
                    onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                    className={selectCls}
                  >
                    <option value="">Select category</option>
                    {EVENT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>City</label>
                  <select
                    value={eventData.city}
                    onChange={(e) => setEventData({ ...eventData, city: e.target.value })}
                    className={selectCls}
                  >
                    <option value="">Select city</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Date</label>
                  <input
                    type="date"
                    value={eventData.date}
                    onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Time</label>
                  <input
                    type="text"
                    value={eventData.time}
                    onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                    className={inputCls}
                    placeholder="e.g. 4:00 PM - 10:00 PM"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelCls}>Venue</label>
                  <input
                    type="text"
                    value={eventData.venue}
                    onChange={(e) => setEventData({ ...eventData, venue: e.target.value })}
                    className={inputCls}
                    placeholder="Venue name and address"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelCls}>Description</label>
                  <textarea
                    value={eventData.description}
                    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                    rows={4}
                    className={inputCls}
                    placeholder="Describe your event, activities, and what attendees can expect..."
                  />
                </div>

                <div>
                  <label className={labelCls}>Expected Attendance</label>
                  <input
                    type="number"
                    value={eventData.expectedAttendance}
                    onChange={(e) => setEventData({ ...eventData, expectedAttendance: e.target.value })}
                    className={inputCls}
                    placeholder="e.g. 500"
                    min="0"
                  />
                </div>

                <div>
                  <label className={labelCls}>Ticket Price</label>
                  <input
                    type="text"
                    value={eventData.ticketPrice}
                    onChange={(e) => setEventData({ ...eventData, ticketPrice: e.target.value })}
                    className={inputCls}
                    placeholder="e.g. Free, $15, $50"
                  />
                </div>

                <div>
                  <label className={labelCls}>Organizer</label>
                  <input
                    type="text"
                    value={eventData.organizer}
                    onChange={(e) => setEventData({ ...eventData, organizer: e.target.value })}
                    className={inputCls}
                    placeholder="Organization or person name"
                  />
                </div>

                <div>
                  <label className={labelCls}>Website URL</label>
                  <input
                    type="url"
                    value={eventData.website}
                    onChange={(e) => setEventData({ ...eventData, website: e.target.value })}
                    className={inputCls}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#D4621A] text-white rounded-xl font-semibold hover:bg-[#b85214] transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  Submit Event
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* ========================== SIMPLE FORM OPTION ========================== */}
      <section className="bg-white py-12 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFF3E8] rounded-full mb-4">
            <Zap className="w-4 h-4 text-[#D4621A]" />
            <span className="text-sm text-[#6B6865] font-medium">Quick Option</span>
          </div>
          <h2
            className="text-xl font-bold text-[#1E2328] mb-2"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Prefer a Simple Form?
          </h2>
          <p className="text-[#6B6865] mb-6 max-w-lg mx-auto text-sm">
            If the forms above feel complicated, use our simple Google Form instead. Same result, just simpler!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfSubmitBusiness/createform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4285F4] text-white rounded-lg font-semibold hover:bg-[#3367D6] transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
              Submit via Google Form
            </a>
            <a
              href="mailto:submissions@ncdesicircle.com"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-[#6B6865] rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <Send className="w-4 h-4" />
              Email Us Instead
            </a>
          </div>
          <p className="text-xs text-[#6B6865]/60 mt-4">
            Note: Replace the Google Form link above with your own form. Create one free at{' '}
            <a href="https://forms.new" target="_blank" rel="noopener noreferrer" className="text-[#0A7B6D] hover:underline">
              forms.new
            </a>
          </p>
        </div>
      </section>

      {/* ========================== CTA FOOTER ========================== */}
      <section className="bg-[#FFF3E8] py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Building2 className="w-10 h-10 text-[#D4621A] mx-auto mb-4" />
          <h2
            className="text-2xl font-bold text-[#1E2328] mb-3"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Have questions?
          </h2>
          <p className="text-[#6B6865] mb-6 max-w-lg mx-auto">
            Not sure which category fits best? Reach out and our team will help you get listed.
          </p>
          <a
            href="#/directory"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#0A7B6D] text-white rounded-lg font-semibold hover:bg-[#08574D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </a>
        </div>
      </section>
    </div>
  );
}
