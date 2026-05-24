import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, Calendar, Phone, CheckCircle, Users,
  ChevronRight, ChevronDown, UtensilsCrossed, ShoppingBasket,
  Briefcase, HeartPulse, BookOpen, Sparkles, Church, Dumbbell,
  Check, ArrowRight
} from 'lucide-react';
import { businesses } from '../data/businesses';
import { events } from '../data/events';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Hero Section ─── */
function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState({ pop: 0, biz: 0, evt: 0, grp: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo('.hero-caption', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
        .fromTo('.hero-line1', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.3')
        .fromTo('.hero-line2', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.65')
        .fromTo('.hero-tagline', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .fromTo('.hero-desc', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.45')
        .fromTo('.hero-search', { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.3')
        .fromTo('.hero-cta', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.2');

      // Animate stat counters
      const targets = [
        { key: 'pop', val: 130 },
        { key: 'biz', val: 108 },
        { key: 'evt', val: 98 },
        { key: 'grp', val: 80 },
      ];
      targets.forEach((t, i) => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: t.val,
          duration: 2,
          delay: 1.2 + i * 0.15,
          ease: 'power2.out',
          onUpdate: () => {
            setCounts((prev) => ({ ...prev, [t.key]: Math.round(obj.v) }));
          },
        });
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(30,35,40,0.78)] to-[rgba(10,123,109,0.65)]" />

      {/* Content */}
      <div className="relative z-10 max-w-[960px] mx-auto px-4 sm:px-6 text-center pt-[72px]">
        <p className="hero-caption text-gold text-[13px] font-medium uppercase tracking-[3px] mb-6">
          North Carolina&apos;s South Asian Community
        </p>
        <h1 className="font-display text-[56px] sm:text-[72px] lg:text-[96px] font-extrabold text-white leading-[1.05] tracking-[-2.5px] mb-4">
          <span className="hero-line1 block">Your Community,</span>
          <span className="hero-line2 block">Your Circle</span>
        </h1>
        <p className="hero-tagline font-accent italic text-gold text-[20px] md:text-[22px] opacity-90 mb-4">
          Where Tradition Meets Tar Heel Spirit
        </p>
        <p className="hero-desc text-white/85 text-[16px] md:text-[18px] max-w-[560px] mx-auto mb-8 leading-relaxed">
          Discover 130,000+ Indian Americans across the Triangle and Charlotte. Find trusted businesses, connect with your community, and make NC feel like home.
        </p>

        {/* Search bar */}
        <div className="hero-search max-w-[640px] mx-auto mb-8">
          <div className="flex items-center bg-white/[0.12] backdrop-blur-md border border-white rounded-xl overflow-hidden">
            <Search className="w-5 h-5 text-saffron ml-4 shrink-0" />
            <input
              type="text"
              placeholder="Search businesses, events, temples, services..."
              className="flex-1 bg-transparent text-white placeholder-white/60 px-3 py-4 text-[15px] outline-none"
            />
            <button className="hidden sm:block px-5 py-2.5 bg-saffron text-white text-[14px] font-semibold rounded-lg mr-1.5 hover:brightness-110 transition-all duration-200">
              Search
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="hero-cta flex items-center justify-center gap-4 sm:gap-8 mb-10">
          {[
            { value: counts.pop, label: 'Indian Americans', suffix: 'K+' },
            { value: counts.biz, label: 'Businesses Listed', suffix: '+' },
            { value: counts.evt, label: 'Annual Events', suffix: '+' },
            { value: counts.grp, label: 'Community Groups', suffix: '+' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-mono text-white text-[24px] sm:text-[36px] font-bold tracking-[-1px]">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-white/60 text-[11px] sm:text-[13px] font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/directory"
            className="px-8 py-3 rounded-full bg-saffron text-white font-body text-[14px] font-semibold hover:scale-[1.02] hover:brightness-110 transition-all duration-200"
          >
            Explore Directory
          </Link>
          <Link
            to="/events"
            className="px-8 py-3 rounded-full border border-white text-white font-body text-[14px] font-semibold hover:bg-white/10 transition-all duration-200"
          >
            View Events
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-down">
        <ChevronDown className="w-6 h-6 text-white/60" />
      </div>
    </section>
  );
}

/* ─── Stats Section ─── */
function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animatedCounts, setAnimatedCounts] = useState([0, 0, 0, 0, 0, 0]);

  const stats = [
    { value: 130646, label: 'Indian Americans in NC', desc: 'Largest Asian group, 63% growth since 2010', prefix: '' },
    { value: 36, label: 'Morrisville Indian Population', desc: 'Highest density in the Southeast', prefix: '', suffix: '%' },
    { value: 15, label: 'Business Categories', desc: 'From restaurants to wedding vendors', prefix: '', suffix: '+' },
    { value: 98, label: 'Annual Events Mapped', desc: 'Festivals, concerts, and gatherings', prefix: '', suffix: '+' },
    { value: 80, label: 'Community Organizations', desc: 'Temples, associations, and groups', prefix: '', suffix: '+' },
    { value: 50, label: 'Combined Event Attendance', desc: 'Hum Sub Diwali, Festival of India & more', prefix: '', suffix: 'K+' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.stats-header', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });

      stats.forEach((stat, i) => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: stat.value,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
          delay: i * 0.12,
          onUpdate: () => {
            setAnimatedCounts((prev) => {
              const next = [...prev];
              next[i] = Math.round(obj.v);
              return next;
            });
          },
        });
      });

      gsap.fromTo('.stat-card', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <section ref={sectionRef} className="bg-light-saffron py-20 lg:py-[100px]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="stats-header text-center mb-12">
          <p className="text-teal text-[13px] font-medium uppercase tracking-[1.5px] mb-3">A Thriving Community</p>
          <h2 className="font-display text-[32px] sm:text-[40px] font-bold text-charcoal leading-tight tracking-[-1px]">
            North Carolina&apos;s Indian-American Story
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card text-center sm:text-left">
              <div className="font-mono text-[40px] sm:text-[56px] font-bold text-charcoal tracking-[-1px] leading-tight">
                {stat.prefix}{i === 0 ? formatNumber(animatedCounts[i]) : animatedCounts[i]}{stat.suffix}
              </div>
              <div className="text-charcoal text-[16px] font-semibold mt-1">{stat.label}</div>
              <p className="text-warm-gray text-[14px] mt-1">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Categories Section ─── */
const categories = [
  { name: 'Restaurants', icon: UtensilsCrossed, image: '/featured-restaurants.jpg', count: '48+ places' },
  { name: 'Grocery & Markets', icon: ShoppingBasket, image: '/featured-grocery.jpg', count: '12+ stores' },
  { name: 'Professional Services', icon: Briefcase, image: '/featured-services.jpg', count: '25+ professionals' },
  { name: 'Healthcare', icon: HeartPulse, image: '/featured-healthcare.jpg', count: '18+ providers' },
  { name: 'Education', icon: BookOpen, image: '/stat-community.jpg', count: 'Schools & Classes' },
  { name: 'Wedding & Events', icon: Sparkles, image: '/partner-wedding.jpg', count: 'Vendors & Venues' },
  { name: 'Religious & Cultural', icon: Church, image: '/partner-temple.jpg', count: 'Temples & Centers' },
  { name: 'Fitness & Sports', icon: Dumbbell, image: '/city-cary.jpg', count: 'Cricket, Yoga & More' },
];

function CategoriesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cat-header', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
      gsap.fromTo('.cat-card', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.cat-grid', start: 'top 85%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-warm-cream py-20 lg:py-[100px]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cat-header text-center mb-12">
          <p className="text-teal text-[13px] font-medium uppercase tracking-[1.5px] mb-3">Discover</p>
          <h2 className="font-display text-[32px] sm:text-[40px] font-bold text-charcoal leading-tight tracking-[-1px] mb-4">
            Everything Your Community Offers
          </h2>
          <p className="text-warm-gray text-[16px] md:text-[18px] max-w-[560px] mx-auto">
            From your favorite biryani spot to the perfect wedding vendor — find it all in one place.
          </p>
        </div>
        <div className="cat-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              to="/directory"
              key={cat.name}
              className="cat-card group relative aspect-square rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(30,35,40,0.85)] via-[rgba(30,35,40,0.3)] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <cat.icon className="w-7 h-7 text-white mb-2" />
                <h3 className="text-white text-[16px] sm:text-[18px] font-bold">{cat.name}</h3>
                <p className="text-gold text-[12px] sm:text-[13px] font-medium">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Featured Businesses Section ─── */
const filterTabs = ['All', 'Restaurants', 'Grocery', 'Services', 'Healthcare'];

function FeaturedBusinessesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? businesses.slice(0, 4)
    : businesses.filter((b) =>
        activeFilter === 'Services' ? b.category === 'Professional Services' :
        activeFilter === 'Healthcare' ? b.category === 'Healthcare' :
        b.category === activeFilter
      ).slice(0, 4);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.biz-header', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
      gsap.fromTo('.biz-card', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.biz-grid', start: 'top 85%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [activeFilter]);

  function getGoogleMapsUrl(name: string, city: string): string {
    const query = encodeURIComponent(`${name}, ${city}, NC`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  return (
    <section ref={sectionRef} className="bg-light-saffron py-20 lg:py-[100px]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="biz-header text-center mb-10">
          <p className="text-teal text-[13px] font-medium uppercase tracking-[1.5px] mb-3">Businesses</p>
          <h2 className="font-display text-[32px] sm:text-[40px] font-bold text-charcoal leading-tight tracking-[-1px] mb-3">
            Community Favorites
          </h2>
          <p className="text-warm-gray text-[16px]">Verified and reviewed by your neighbors</p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
                activeFilter === tab
                  ? 'bg-teal text-white'
                  : 'bg-teal/10 text-teal hover:bg-teal/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="biz-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {filtered.map((biz) => (
            <div
              key={biz.id}
              className="biz-card bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-charcoal text-[16px] font-bold leading-tight">{biz.name}</h3>
                  {biz.verified && <CheckCircle className="w-4 h-4 text-teal shrink-0 ml-1 mt-0.5" />}
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal/10 text-teal text-[11px] font-medium mb-2">
                  {biz.category}
                </span>

                {/* Phone number - clickable */}
                <a href={`tel:${biz.phone.replace(/\D/g, '')}`} className="flex items-center gap-1 text-sm text-[#0A7B6D] hover:text-[#D4621A] transition-colors mt-1">
                  <Phone className="w-3.5 h-3.5" />
                  {biz.phone}
                </a>

                {/* City - clickable Google Maps */}
                <a href={getGoogleMapsUrl(biz.name, biz.city)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-warm-gray text-[13px] mt-1 hover:text-[#D4621A] transition-colors">
                  <MapPin className="w-3.5 h-3.5" />
                  {biz.city} — Open in Maps
                </a>

                <Link to={`/directory`} className="text-saffron text-[13px] font-semibold hover:underline inline-flex items-center gap-0.5 mt-3">
                  View Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/directory"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-saffron text-saffron font-body text-[14px] font-semibold hover:bg-saffron hover:text-white transition-all duration-300"
          >
            View All 108+ Businesses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Events Section ─── */
const featuredEvents = events.filter((e) => e.featured).slice(0, 3);

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate(),
    display: d.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  };
}

function EventsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.evt-header', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
      gsap.fromTo('.evt-card', { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.evt-grid', start: 'top 85%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-warm-cream py-20 lg:py-[100px]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="evt-header text-center mb-12">
          <p className="text-maroon text-[13px] font-medium uppercase tracking-[1.5px] mb-3">Events</p>
          <h2 className="font-display text-[32px] sm:text-[40px] font-bold text-charcoal leading-tight tracking-[-1px] mb-3">
            Mark Your Calendar
          </h2>
          <p className="text-warm-gray text-[16px]">Don&apos;t miss the biggest celebrations in your community</p>
        </div>

        <div className="evt-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featuredEvents.map((evt) => {
            const d = formatEventDate(evt.date);
            return (
              <div
                key={evt.id}
                className={`evt-card bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group ${
                  evt.featured ? 'border-t-4 border-maroon' : 'border-t-4 border-saffron'
                }`}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={evt.image}
                    alt={evt.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-saffron text-white rounded-lg px-3 py-1.5 text-center">
                    <div className="text-[10px] font-bold uppercase tracking-wider">{d.month}</div>
                    <div className="text-[20px] font-bold leading-tight">{d.day}</div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-charcoal text-[18px] sm:text-[20px] font-bold mb-2">{evt.name}</h3>
                  <div className="flex items-center gap-2 text-warm-gray text-[13px] mb-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {d.display}
                  </div>
                  <div className="flex items-center gap-2 text-warm-gray text-[13px] mb-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {evt.venue}, {evt.city}
                  </div>
                  <div className="flex items-center gap-2 text-warm-gray text-[13px] mb-3">
                    <Users className="w-3.5 h-3.5" />
                    {evt.expectedAttendance.toLocaleString()}+ Attendees Expected
                  </div>
                  <p className="text-gold text-[13px] font-medium">
                    Presented by {evt.organizer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/events"
            className="px-8 py-3 rounded-full bg-saffron text-white font-body text-[14px] font-semibold hover:scale-[1.02] hover:brightness-110 transition-all duration-200"
          >
            View Full Calendar
          </Link>
          <Link
            to="/events"
            className="text-teal text-[14px] font-medium hover:text-deep-teal transition-colors duration-200"
          >
            Submit an Event
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── City Guides Section ─── */
const cityGuides = [
  { name: 'Morrisville', image: '/city-morrisville.jpg', badge: '36% Indian Population', desc: 'The heart of the Triangle\'s Indian community. Home to Patel Brothers, Sri Venkateswara Temple, and Park West Village.' },
  { name: 'Cary / Apex', image: '/city-cary.jpg', badge: 'Family-Friendly Hub', desc: 'Top-rated schools, beautiful parks, and a growing Indian professional community. Best for families with kids.' },
  { name: 'Charlotte', image: '/city-charlotte.jpg', badge: 'The Queen City', desc: 'North Carolina\'s largest city with a vibrant Indian community, professional networks, and cultural institutions.' },
];

const secondaryCities = ['Raleigh', 'Durham', 'Chapel Hill', 'Greensboro'];

function CityGuidesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.city-header', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
      gsap.fromTo('.city-card', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.city-grid', start: 'top 85%' },
      });
      gsap.fromTo('.city-pill', { opacity: 0 }, {
        opacity: 1, duration: 0.4, stagger: 0.1,
        scrollTrigger: { trigger: '.city-pills', start: 'top 90%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-light-saffron py-20 lg:py-[100px] relative overflow-hidden">
      {/* Subtle mandala decoration */}
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" stroke="#D4621A" strokeWidth="1" />
          <circle cx="100" cy="100" r="60" stroke="#0A7B6D" strokeWidth="1" />
          <circle cx="100" cy="100" r="40" stroke="#D4621A" strokeWidth="1" />
          <circle cx="100" cy="100" r="20" stroke="#C8A84E" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="city-header text-center mb-12">
          <p className="text-teal text-[13px] font-medium uppercase tracking-[1.5px] mb-3">City Guides</p>
          <h2 className="font-display text-[32px] sm:text-[40px] font-bold text-charcoal leading-tight tracking-[-1px] mb-4">
            Your Guide to NC&apos;s Indian Hubs
          </h2>
          <p className="text-warm-gray text-[16px] max-w-[560px] mx-auto">
            From Morrisville to Charlotte — find your perfect neighborhood
          </p>
        </div>

        <div className="city-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {cityGuides.map((city) => (
            <div
              key={city.name}
              className="city-card bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="text-charcoal text-[20px] sm:text-[24px] font-bold mb-2">{city.name}</h3>
                <span className="inline-block px-3 py-1 rounded-full bg-saffron text-white text-[12px] font-semibold mb-3">
                  {city.badge}
                </span>
                <p className="text-warm-gray text-[14px] leading-relaxed mb-4">{city.desc}</p>
                <Link
                  to="/guide"
                  className="text-teal text-[14px] font-semibold hover:text-deep-teal transition-colors inline-flex items-center gap-0.5"
                >
                  Explore {city.name.split(' ')[0]} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary city pills */}
        <div className="city-pills flex flex-wrap items-center justify-center gap-3">
          {secondaryCities.map((city) => (
            <Link
              key={city}
              to="/guide"
              className="city-pill px-5 py-2.5 rounded-full bg-warm-cream border border-warm-gray/20 text-charcoal text-[14px] font-medium hover:bg-saffron hover:text-white hover:border-saffron transition-all duration-200"
            >
              {city}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── AI Concierge CTA Section ─── */
function AIConciergeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.concierge-left > *', { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
      gsap.fromTo('.concierge-right', { x: 40, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.fromTo('.concierge-check', { scale: 0.8, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.concierge-checks', start: 'top 85%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const features = [
    'Instant answers about NC\'s Indian community',
    'Personalized recommendations based on your needs',
    'Always learning, always improving',
  ];

  return (
    <section ref={sectionRef} className="bg-deep-teal py-20 lg:py-[100px]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-3 concierge-left">
            <p className="text-gold text-[13px] font-medium uppercase tracking-[1.5px] mb-3">AI-Powered Assistant</p>
            <h2 className="font-display text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-white leading-tight tracking-[-1px] mb-5">
              Your Personal NC Community Guide
            </h2>
            <p className="text-white/85 text-[16px] md:text-[17px] leading-relaxed mb-6 max-w-[540px]">
              Ask anything — best Indian neighborhoods, top schools, grocery stores, temples, doctors, daycare, cricket leagues. Get instant, personalized answers.
            </p>
            <div className="concierge-checks space-y-3 mb-8">
              {features.map((f, i) => (
                <div key={i} className="concierge-check flex items-center gap-3">
                  <Check className="w-5 h-5 text-gold shrink-0" />
                  <span className="text-white/90 text-[15px]">{f}</span>
                </div>
              ))}
            </div>
            <Link
              to="/concierge"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-saffron text-white font-body text-[14px] font-semibold hover:scale-[1.02] hover:brightness-110 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4" />
              Chat with AI Concierge
            </Link>
          </div>
          <div className="lg:col-span-2 concierge-right">
            <img
              src="/concierge-hero.jpg"
              alt="AI Concierge"
              className="w-full rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Home Page ─── */
export default function Home() {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <FeaturedBusinessesSection />
      <EventsSection />
      <CityGuidesSection />
      <AIConciergeSection />
    </div>
  );
}
